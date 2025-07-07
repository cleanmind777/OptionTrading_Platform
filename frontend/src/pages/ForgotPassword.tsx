import React, { useState } from "react";
import { forgotPassword } from "../api/authAPI";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setMessage("Check your inbox for reset instructions.");
        } catch {
            setMessage("Failed to send reset email.");
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

                {/* Forgot Password Form */}
                <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">
                    <h2 className="text-2xl font-bold text-white mb-2">Reset Your Password</h2>
                    <p className="text-gray-300 text-sm mb-6">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="sr-only">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                            SEND RESET LINK
                        </button>

                        {/* Message */}
                        {message && (
                            <div className={`text-center text-sm p-3 rounded ${message.includes("Failed")
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-green-500/10 text-green-400"
                                }`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>

                {/* Back to Login Link */}
                <div className="text-center mt-6">
                    <p className="text-gray-300">
                        Remember your password?{' '}
                        <Link
                            to="/login"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;