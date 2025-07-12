import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms/userAtom';
import Cookies from 'js-cookie';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [user, setUser] = useAtom(userAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    try {
      await axios.post(`${BACKEND_URL}/auth/login`, params,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true,
        }).then(response => {
          // console.log('Login successful:', response)
          // console.log("Cookie", Cookies.get('access_token'))
          localStorage.setItem("userinfo", JSON.stringify(response.data))
          setUser(response.data)
          return true
        }).catch(error => {
          // console.log(error)
          alert("Invalid email or password")
          return false
        })
    } catch (error) {
      // console.log("error")
      return false
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (result == false) {
        // console.log("Login failed")
      }
      else {
        onLogin();
        navigate("/account-stats");
      }
    } catch (error) {
      // console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="relative">
              <svg className="w-16 h-16" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="20 10"
                />
                <g transform="translate(35, 35)">
                  <rect x="10" y="30" width="8" height="20" fill="#10b981" />
                  <rect x="20" y="20" width="8" height="30" fill="#10b981" />
                  <rect x="30" y="10" width="8" height="40" fill="#10b981" />
                  <rect x="40" y="25" width="8" height="25" fill="#10b981" />
                </g>
                <path d="M20 30 L30 20 L25 25 Z" fill="#10b981" />
                <path d="M100 90 L90 100 L95 95 Z" fill="#10b981" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">TRADE STEWARD</div>
              <div className="text-xs text-gray-300 tracking-widest">OPENING YOUR OPTIONS</div>
            </div>
          </Link>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-300 text-sm mb-6">
            Sign in to access your trading dashboard
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300 text-sm">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              SIGN IN
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-gray-400">
                  Don't have an account?
                </span>
              </div>
            </div>

            <Link
              to="/register"
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 inline-flex justify-center"
            >
              CREATE NEW ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}