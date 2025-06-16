import { useState } from 'react'
import { Link } from 'react-router-dom'

export function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Registration data:', formData)
      // Handle registration logic here
    }
  }

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

        {/* Registration Form */}
        <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
          <p className="text-gray-300 text-sm mb-6">
            Join thousands of traders using tradeSteward for automated options trading
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={`w-full px-4 py-3 bg-slate-700 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 ${
                    errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  required
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={`w-full px-4 py-3 bg-slate-700 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 ${
                    errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  required
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full px-4 py-3 bg-slate-700 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                required
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (Optional)"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 bg-slate-700 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 ${
                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                required
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 bg-slate-700 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 ${
                  errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                required
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-700/50 p-3 rounded text-xs text-gray-300">
              <p className="font-medium mb-1">Password Requirements:</p>
              <ul className="space-y-1">
                <li className="flex items-center space-x-2">
                  <span className={`w-1 h-1 rounded-full ${formData.password.length >= 8 ? 'bg-green-400' : 'bg-gray-400'}`} />
                  <span>At least 8 characters</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className={`w-1 h-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-400' : 'bg-gray-400'}`} />
                  <span>One uppercase letter</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className={`w-1 h-1 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-400' : 'bg-gray-400'}`} />
                  <span>One number</span>
                </li>
              </ul>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`mt-1 w-4 h-4 text-blue-600 bg-slate-700 border rounded focus:ring-blue-500 ${
                    errors.agreeToTerms ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
                <span className="text-gray-300 text-sm">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-400 hover:text-blue-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-400 text-xs">{errors.agreeToTerms}</p>}

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 bg-slate-700 border border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300 text-sm">
                  Send me updates about new features and trading insights
                </span>
              </label>
            </div>

            {/* Free Trial Notice */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-400 font-medium text-sm">Free Trial Included</span>
              </div>
              <p className="text-green-300 text-xs mt-1">
                Start with a 7-day free trial on any plan up to $139.99/month
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-300">
            Already have an account?{' '}
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
  )
}
