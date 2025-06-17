import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface HeroSectionProps {
  onLogin: () => void;
}

export function HeroSection({ onLogin }: HeroSectionProps) {
  const [rememberMe, setRememberMe] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  // Auto-rotate features every 7.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 7500);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
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

  const features = [
    {
      title: "Tracking. Trading. Easier.",
      description:
        "See your strategies come to life with automated trading, industry-leading performance reporting and real-time control of your trades. And do it all from our easy to use, web-based interface.",
      image: "https://www.tradesteward.com/img/carousel/dashboard.jpg",
      buttonText: "Get Started Today",
      buttonLink: "/register",
      buttonClass: "bg-[#3ba577] hover:bg-[#2a8a5f]",
    },
    {
      title: "Trade Your Way",
      description:
        "Finally. An autotrader that trades like you do. Built by traders, for traders, tradeSteward makes it easy to run complex - or simple - trades with our automated trading system.",
      image: "https://ext.same-assets.com/2831944752/2844048597.jpeg",
      buttonText: "Learn more",
      buttonLink: "/learn-more",
      buttonClass: "bg-[#2367e1] hover:bg-[#1e5bc6]",
    },
    {
      title: "Get Started Today",
      description:
        "With a free, no-obligation one-week trial, you'll wonder how you traded before.",
      image: "https://ext.same-assets.com/2831944752/879414121.jpeg",
      buttonText: "Sign Up Now",
      buttonLink: "/register",
      buttonClass: "bg-[#3ba577] hover:bg-[#2a8a5f]",
    },
  ];

  return (
    <div className="bg-slate-900">
      {/* Main Hero Content */}
      <div className="py-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          {/* Left Side - Logo and Content */}
          <div className="text-center lg:text-left">
            {/* Logo */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-8">
              <div className="relative">
                {/* Green circular arrows */}
                <svg className="w-32 h-32 absolute" viewBox="-60 -60 120 120">
                  <circle
                    cx="0"
                    cy="0"
                    r="50"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeDasharray="20 10"
                    className="animate-spin absolute"
                    style={{ animationDuration: "10s" }}
                  />
                </svg>
                <svg className="w-32 h-32" viewBox="0 0 120 120">
                  {/* Chart bars in center */}
                  <g transform="translate(30, 30)">
                    <rect x="10" y="30" width="8" height="20" fill="#10b981" />
                    <rect x="20" y="20" width="8" height="30" fill="#10b981" />
                    <rect x="30" y="10" width="8" height="40" fill="#10b981" />
                    <rect x="40" y="25" width="8" height="25" fill="#10b981" />
                  </g>
                  {/* Arrows */}
                  <path d="M20 30 L30 20 L25 25 Z" fill="#10b981" />
                  <path d="M100 90 L90 100 L95 95 Z" fill="#10b981" />
                </svg>
              </div>
              <div>
                <h1 className="text-6xl font-bold text-white">TRADE STEWARD</h1>
                <p className="text-sm text-gray-300 tracking-widest">
                  OPENING YOUR OPTIONS
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="mb-8">
              <h2 className="text-5xl font-bold text-white leading-tight mb-6">
                Built by traders.
                <br />
                For traders.
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                tradeSteward is your one-stop service for automated options
                trading and trade strategy performance tracking. Take the
                complex out of complex orders and find your edge today.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-slate-800 p-8 rounded-lg shadow-xl max-w-md mx-auto lg:mx-0">
            <h3 className="text-2xl font-bold text-white mb-6">
              Current Trader? Login
            </h3>

            <form className="space-y-4" onSubmit={handleLogin}>
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
      </div>
      <hr className="border-[#eff0f6] max-w-[85%] mx-auto opacity-[0.25] pb-20" />

      {/* Features Section */}
      <div className="relative overflow-hidden">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`transition-all w-full  duration-1000 ease-in-out ${activeFeature === index
              ? "opacity-100 translate-x-0"
              : "opacity-0 absolute translate-x-full"
              }`}
          >
            <div
              className="relative h-[600px] w-full"
              style={{
                backgroundImage: `url(${feature.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                      {feature.title}
                    </h2>
                    <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                      <strong>{feature.description}</strong>
                    </p>
                    <a
                      href={feature.buttonLink}
                      className={`inline-block ${feature.buttonClass} text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 btn-interactive transform hover:scale-105`}
                    >
                      {feature.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-8 mb-12">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeFeature === index ? "bg-white scale-125" : "bg-gray-500"
                }`}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Brokerage Integration Section */}
      <section className="pt-16 bg-[#2D2C42]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">
              Featuring Account Integration with
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
              {/* Schwab Trading */}
              <div className="flex items-center bg-white p-4 rounded-lg">
                <img
                  src="https://www.tradesteward.com/img/schwab-trading.png"
                  alt="Schwab Trading"
                  className="h-16 w-auto"
                />
              </div>

              {/* Tradier */}
              <div className="flex items-center bg-white p-4 rounded-lg">
                <img
                  src="https://ext.same-assets.com/2831944752/1166546.svg"
                  alt="Tradier"
                  className="h-16 w-auto"
                />
              </div>

              {/* tastytrade */}
              <div className="flex items-center bg-white p-4 rounded-lg">
                <img
                  src="https://ext.same-assets.com/2831944752/1384432053.svg"
                  alt="tastytrade"
                  className="h-16 w-auto"
                />
              </div>

              {/* TradeStation */}
              <div className="flex items-center bg-white p-4 rounded-lg relative">
                <img
                  src="https://www.tradesteward.com/img/tradestation.png"
                  alt="TradeStation"
                  className="h-16 w-auto"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium">
                    Coming Soon!
                  </span>
                </div>
              </div>
            </div>

            <p className="text-white mt-6 italic">*TradeStation coming soon!</p>
          </div>
        </div>
      </section>
    </div>
  );
}
