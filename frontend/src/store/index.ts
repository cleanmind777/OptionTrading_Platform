import { atom } from 'jotai';
import { atomWithStorage, atomWithReset } from 'jotai/utils';
import { UserInfo } from '../types/user';

// ============================================================================
// AUTHENTICATION & USER STATE
// ============================================================================

// User information atom (persisted in localStorage)
export const userAtom = atomWithStorage<UserInfo | null>('user', null);

// Authentication status atom
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);

// User session atom (for temporary session data)
export const sessionAtom = atomWithStorage('session', {
  lastActivity: Date.now(),
  rememberMe: false,
});

// ============================================================================
// UI STATE
// ============================================================================

// Theme atom (persisted)
export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'dark');

// Sidebar collapsed state (persisted)
export const sidebarCollapsedAtom = atomWithStorage('sidebarCollapsed', false);

// Loading states
export const globalLoadingAtom = atom(false);
export const authLoadingAtom = atom(false);

// Error states
export const globalErrorAtom = atom<string | null>(null);
export const authErrorAtom = atom<string | null>(null);

// ============================================================================
// DERIVED ATOMS
// ============================================================================

// User full name
export const userFullNameAtom = atom((get) => {
  const user = get(userAtom);
  if (!user) return '';
  return `${user.first_name} ${user.last_name || ''}`.trim();
});

// User initials for avatar
export const userInitialsAtom = atom((get) => {
  const user = get(userAtom);
  if (!user) return '';
  const first = user.first_name.charAt(0).toUpperCase();
  const last = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
});

// User email
export const userEmailAtom = atom((get) => {
  const user = get(userAtom);
  return user?.email || '';
});

// User level for permissions
export const userLevelAtom = atom((get) => {
  const user = get(userAtom);
  return user?.user_level || 0;
});

// User preferences
export const userPreferencesAtom = atom((get) => {
  const user = get(userAtom);
  return user?.user_preferences || {};
});

// Bot preferences
export const botPreferencesAtom = atom((get) => {
  const user = get(userAtom);
  return user?.bot_preferences || {};
});

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

// Session timeout atom (in minutes)
export const sessionTimeoutAtom = atomWithStorage('sessionTimeout', 60);

// Session activity tracking
export const lastActivityAtom = atomWithStorage('lastActivity', Date.now());

// Session status
export const sessionStatusAtom = atom((get) => {
  const lastActivity = get(lastActivityAtom);
  const timeout = get(sessionTimeoutAtom);
  const now = Date.now();
  const timeSinceLastActivity = (now - lastActivity) / (1000 * 60); // minutes
  
  return {
    isActive: timeSinceLastActivity < timeout,
    timeRemaining: Math.max(0, timeout - timeSinceLastActivity),
    lastActivity,
  };
});

// ============================================================================
// NOTIFICATION STATE
// ============================================================================

// Notification queue
export const notificationsAtom = atomWithReset<Array<{
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  timestamp: number;
}>>([]);

// ============================================================================
// MODAL STATE
// ============================================================================

// Active modal
export const activeModalAtom = atom<string | null>(null);

// Modal data
export const modalDataAtom = atom<any>(null);

// ============================================================================
// FORM STATE
// ============================================================================

// Form loading states
export const formLoadingAtom = atom<Record<string, boolean>>({});

// Form errors
export const formErrorsAtom = atom<Record<string, string[]>>({});

// ============================================================================
// API STATE
// ============================================================================

// API health status
export const apiHealthAtom = atom<{
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastCheck: number;
  error?: string;
}>({
  status: 'unknown',
  lastCheck: 0,
});

// API connection status
export const apiConnectedAtom = atom((get) => {
  const health = get(apiHealthAtom);
  return health.status === 'healthy';
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Helper function to update user activity
export const updateUserActivity = (set: any) => {
  set(lastActivityAtom, Date.now());
};

// Helper function to clear all auth data
export const clearAuthData = (set: any) => {
  set(userAtom, null);
  set(sessionAtom, {
    lastActivity: Date.now(),
    rememberMe: false,
  });
  set(lastActivityAtom, Date.now());
  set(authErrorAtom, null);
};

// Helper function to set loading state
export const setLoading = (set: any, key: string, loading: boolean) => {
  if (key === 'global') {
    set(globalLoadingAtom, loading);
  } else if (key === 'auth') {
    set(authLoadingAtom, loading);
  } else {
    set(formLoadingAtom, (prev: Record<string, boolean>) => ({
      ...prev,
      [key]: loading,
    }));
  }
};

// Helper function to set error state
export const setError = (set: any, key: string, error: string | null) => {
  if (key === 'global') {
    set(globalErrorAtom, error);
  } else if (key === 'auth') {
    set(authErrorAtom, error);
  } else {
    set(formErrorsAtom, (prev: Record<string, string[]>) => ({
      ...prev,
      [key]: error ? [error] : [],
    }));
  }
};

// Helper function to add notification
export const addNotification = (
  set: any,
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  duration = 5000
) => {
  const id = Math.random().toString(36).substr(2, 9);
  const notification = {
    id,
    type,
    message,
    duration,
    timestamp: Date.now(),
  };

  set(notificationsAtom, (prev: any[]) => [...prev, notification]);

  // Auto-remove notification after duration
  if (duration > 0) {
    setTimeout(() => {
      set(notificationsAtom, (prev: any[]) => 
        prev.filter(n => n.id !== id)
      );
    }, duration);
  }
};

// Helper function to remove notification
export const removeNotification = (set: any, id: string) => {
  set(notificationsAtom, (prev: any[]) => 
    prev.filter(n => n.id !== id)
  );
};

// Helper function to open modal
export const openModal = (set: any, modalId: string, data?: any) => {
  set(activeModalAtom, modalId);
  if (data) {
    set(modalDataAtom, data);
  }
};

// Helper function to close modal
export const closeModal = (set: any) => {
  set(activeModalAtom, null);
  set(modalDataAtom, null);
}; 