import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const login = async (email: string, password: string) => {
    const userData = {
      email: email,
      password: password,
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/token`, userData)
      console.log('Login successful:', response.data)
      // navigate("/login");
      // Handle successful registration, e.g., redirect to login page
      return response.data
    } catch (error) {
      console.log("error")
      return false
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Here you would typically make an API call to authenticate
      // For now, we'll just simulate a successful login
      console.log("Logging in with:", { email, password, rememberMe });
      const result = await login(email, password);
      // Call the onLogin prop to update the global login state
      if (result == false) {
        console.log("Login failed")
      }
      else {
        onLogin();
        sessionStorage.setItem('access_token', result.access_token);
        sessionStorage.setItem('token_type', result.token_type);
        navigate("/account-stats");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Here you would typically show an error message to the user
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl max-w-md mx-auto lg:mx-0">
        <h3 className="text-2xl font-bold text-white mb-6">
          Current Trader? Login
        </h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 bg-slate-700 border border-slate-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300 text-sm">Remember me</span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors"
            >
              LOGIN
            </button>
            <Link
              to="/register"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded transition-colors text-center"
            >
              SIGN UP
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
