import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms/userAtom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [user, setUser] = useAtom(userAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/login`,
        params,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true,
        }
      );
      localStorage.setItem("userinfo", JSON.stringify(response.data));
      setUser(response.data); // Make sure setUser is in scope!
      return true;
    } catch (error) {
      alert("Invalid email or password");
      return false;
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
  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      console.error("No credential from Google");
      return;
    }

    const params = new URLSearchParams();
    params.append('token', credentialResponse.credential);

    await axios.post(
      `${BACKEND_URL}/auth/google-login`,
      params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true, // required so browser stores cookies
      }
    ).then(response => {
      localStorage.setItem("userinfo", JSON.stringify(response.data));
      setUser(response.data);
      onLogin();
      navigate("/account-stats");
    }).catch(error => {
      console.error("Google login error", error);
      alert(error.response.data.detail)
    }
    )
  }



  const handleError = () => {
    console.error("Google Login Failed");
  };
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-6 py-10">
      <div className="max-w-4xl w-full bg-gray-900 bg-opacity-95 rounded-2xl shadow-2xl border border-green-700 flex flex-col md:flex-row overflow-hidden">
        {/* Left side: Login Form */}
        <div className="flex-1 p-10 md:p-14 bg-gray-900 bg-opacity-95 flex flex-col justify-center">
          <div className="mb-10 text-center">
            <Link to="/" className="inline-flex items-center space-x-3 justify-center">
              <div className="relative">
                <svg className="w-16 h-16" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeDasharray="20 10"
                  />
                  <g transform="translate(35, 35)">
                    <rect x="10" y="30" width="8" height="20" fill="#22c55e" />
                    <rect x="20" y="20" width="8" height="30" fill="#22c55e" />
                    <rect x="30" y="10" width="8" height="40" fill="#22c55e" />
                    <rect x="40" y="25" width="8" height="25" fill="#22c55e" />
                  </g>
                  <path d="M20 30 L30 20 L25 25 Z" fill="#22c55e" />
                  <path d="M100 90 L90 100 L95 95 Z" fill="#22c55e" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-wide">TRADE STEWARD</h1>
                <p className="text-sm text-green-400 tracking-widest mt-1">OPENING YOUR OPTIONS</p>
              </div>
            </Link>
          </div>

          <h2 className="text-3xl font-extrabold text-green-400 mb-6 text-center md:text-left">Welcome Back</h2>
          <p className="text-green-300 text-sm mb-8 text-center md:text-left">
            Sign in to access your trading dashboard
          </p>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-5 py-4 bg-gray-800 border border-green-600 rounded-lg text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
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
                autoComplete="current-password"
                className="w-full px-5 py-4 bg-gray-800 border border-green-600 rounded-lg text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-green-600 bg-gray-800 border border-green-600 rounded focus:ring-green-500"
                />
                <span className="text-green-300 text-sm font-medium">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-green-400 hover:text-green-300 text-sm font-semibold transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              SIGN IN
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-green-400 font-semibold mb-3">Don't have an account?</p>
            <Link
              to="/register"
              className="inline-block w-full md:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              CREATE NEW ACCOUNT
            </Link>
          </div>
        </div>

        {/* Right side: Google Login */}
        <div className="w-full md:w-96 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-12 rounded-r-3xl">
          <h3 className="text-white text-2xl font-semibold mb-8">Or sign in with</h3>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="w-full flex justify-center">
              <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
            </div>
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}