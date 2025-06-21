import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Environment configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

// API Response interface
interface ApiResponse<T = any> {
    success?: boolean;
    data: T;
    message?: string;
    error_code?: string;
}

// Error response interface
interface ErrorResponse {
    error: boolean;
    message: string;
    status_code: number;
    path?: string;
    details?: any;
}

// Extended request config with metadata
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    metadata?: {
        startTime: Date;
    };
}

class ApiClient {
    private client: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (reason?: any) => void;
    }> = [];

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 30000, // 30 seconds
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // Important for cookies
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add request timestamp for debugging
                (config as ExtendedAxiosRequestConfig).metadata = { startTime: new Date() };

                // Log request in development
                if (import.meta.env.DEV) {
                    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
                }

                return config;
            },
            (error) => {
                console.error('Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response: AxiosResponse<ApiResponse>) => {
                // Log response in development
                if (import.meta.env.DEV) {
                    const metadata = (response.config as ExtendedAxiosRequestConfig).metadata;
                    const duration = metadata?.startTime ? new Date().getTime() - metadata.startTime.getTime() : 0;
                    console.log(`✅ API Response: ${response.status} ${response.config.url} (${duration}ms)`, response.data);
                }

                return response;
            },
            async (error: AxiosError<ErrorResponse>) => {
                const originalRequest = error.config as any;

                // Log error in development
                if (import.meta.env.DEV) {
                    console.error('❌ API Error:', {
                        status: error.response?.status,
                        message: error.response?.data?.message || error.message,
                        url: originalRequest?.url,
                        method: originalRequest?.method,
                    });
                }

                // Handle 401 Unauthorized errors
                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        // If already refreshing, queue the request
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        }).then(() => {
                            return this.client(originalRequest);
                        }).catch((err) => {
                            return Promise.reject(err);
                        });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        // Attempt to refresh token
                        await this.refreshToken();

                        // Retry queued requests
                        this.failedQueue.forEach(({ resolve }) => {
                            resolve();
                        });
                        this.failedQueue = [];

                        // Retry original request
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        // Refresh failed, redirect to login
                        this.failedQueue.forEach(({ reject }) => {
                            reject(refreshError);
                        });
                        this.failedQueue = [];

                        this.handleAuthError();
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                // Handle other errors
                this.handleApiError(error);
                return Promise.reject(error);
            }
        );
    }

    private async refreshToken(): Promise<void> {
        try {
            await this.client.post('/auth/refresh');
        } catch (error) {
            throw new Error('Token refresh failed');
        }
    }

    private handleAuthError(): void {
        // Clear any stored auth data
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');

        // Redirect to login
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }

    private handleApiError(error: AxiosError<ErrorResponse>): void {
        const message = error.response?.data?.message || error.message || 'An error occurred';

        // Don't show toast for 401 errors (handled by auth flow)
        if (error.response?.status !== 401) {
            console.error('API Error:', message);
            // You can implement your own toast notification here
        }
    }

    // Generic request methods
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<ApiResponse<T>>(url, config);
        return (response.data.data || response.data) as T;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<ApiResponse<T>>(url, data, config);
        return (response.data.data || response.data) as T;
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<ApiResponse<T>>(url, data, config);
        return (response.data.data || response.data) as T;
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<ApiResponse<T>>(url, data, config);
        return (response.data.data || response.data) as T;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<ApiResponse<T>>(url, config);
        return (response.data.data || response.data) as T;
    }

    // File upload method
    async upload<T>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await this.client.post<ApiResponse<T>>(url, formData, {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        });

        return (response.data.data || response.data) as T;
    }

    // Health check
    async healthCheck(): Promise<boolean> {
        try {
            const response = await axios.get(`${BACKEND_URL}/health`);
            return response.data.status === 'healthy';
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export types for use in other files
export type { ApiResponse, ErrorResponse };

// Export default for backward compatibility
export default apiClient;