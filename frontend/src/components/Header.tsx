import { useState } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    'TRADING',
    'ACCOUNT INSIGHTS',
    'PERFORMANCE TRACKING',
    'PRICING',
    'FAQ',
    'VIDEO VAULT',
    'SUPPORT'
  ]

  return (
    <header className="bg-ts-dark border-b border-ts-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-ts-green rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                  <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm5-18v4h3V3h-3z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white">TRADE STEWARD</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '')}`}
                className="text-ts-light hover:text-white text-sm font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Login/Signup Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="bg-ts-blue hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
              LOGIN
            </button>
            <button className="bg-ts-green hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
              SIGN UP
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-ts-light hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-ts-gray">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '')}`}
                  className="text-ts-light hover:text-white block px-3 py-2 text-sm font-medium"
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <button className="w-full bg-ts-blue hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
                  LOGIN
                </button>
                <button className="w-full bg-ts-green hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium">
                  SIGN UP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
