import { useState } from 'react'

export function ContactSection() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    userType: '',
    topic: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="py-20 bg-[rgb(15 23 42)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Got questions?</h2>
          <p className="text-xl text-gray-300">
            Still have more questions? Having an issue with your account? tradeSteward's got your back.
            Two easy ways to get in touch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Discord Section */}
          <div className="text-center">
            <div className="bg-slate-900 rounded-lg p-8 border border-slate-700">
              {/* Discord Icon */}
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.865-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.249.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.120.098.246.193.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>

              <h3 className="text-3xl font-bold text-white mb-6">
                Join the<br />
                <span className="text-blue-400">tradeSteward<br />Discord</span>
              </h3>

              <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 inline-block">
                Fastest Response Time
              </div>

              <p className="text-gray-300 leading-relaxed mb-8">
                Interact with other traders, get instant updates on tradeSteward service status,
                open tickets for support and communicate in real-time with tradeSteward support.
              </p>

              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded transition-colors">
                JOIN DISCORD
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-slate-900 rounded-lg p-8 border border-slate-700">
              <h3 className="text-3xl font-bold text-white mb-8">Shoot Us a Message</h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">I am a...</option>
                      <option value="current-user">Current User</option>
                      <option value="potential-user">Potential User</option>
                      <option value="developer">Developer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">I have a question about...</option>
                    <option value="account">Account Issues</option>
                    <option value="trading">Trading Questions</option>
                    <option value="billing">Billing</option>
                    <option value="technical">Technical Support</option>
                    <option value="features">Feature Requests</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="What's your message?"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                    required
                  />
                </div>

                {/* reCAPTCHA placeholder */}
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded" />
                  <span className="text-gray-300 text-sm">I'm not a robot</span>
                  <div className="text-xs text-gray-400">
                    <div>reCAPTCHA</div>
                    <div>Privacy - Terms</div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded transition-colors"
                >
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-700">
          <p className="text-gray-400 text-sm">
            Copyright © 2025 tradeSteward, LLC | Terms of Service
          </p>
        </div>
      </div>
    </div>
  )
}
