import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface Brokerage {
  id: string
  name: string
  logo: string
  description: string
  features: string[]
  available: boolean
  comingSoon?: boolean
}

export function BrokerAuth() {
  const navigate = useNavigate()
  const [selectedBrokerage, setSelectedBrokerage] = useState<string>('')
  const [step, setStep] = useState<'select' | 'authorize' | 'success'>('select')
  const [isConnecting, setIsConnecting] = useState(false)

  const brokerages: Brokerage[] = [
    {
      id: 'schwab',
      name: 'Charles Schwab',
      logo: '🏦',
      description: 'Connect your Charles Schwab trading account for automated options trading',
      features: ['Options Trading', 'Real-time Data', 'Account Sync', 'Trade Execution'],
      available: true
    },
    {
      id: 'tastytrade',
      name: 'TastyTrade',
      logo: '🥧',
      description: 'Connect your TastyTrade account by TastyLive for professional options trading',
      features: ['Options Focused', 'Low Commissions', 'Advanced Tools', 'Fast Execution'],
      available: true
    },
    {
      id: 'tradier',
      name: 'Tradier',
      logo: '📊',
      description: 'Professional brokerage API integration with advanced trading capabilities',
      features: ['API Access', 'Real-time Market Data', 'Options Trading', 'Portfolio Analytics'],
      available: true
    },
    {
      id: 'tradestation',
      name: 'TradeStation',
      logo: '🚉',
      description: 'Professional trading platform integration with advanced charting and analysis',
      features: ['Professional Platform', 'Advanced Charting', 'Strategy Testing', 'Options Trading'],
      available: false,
      comingSoon: true
    }
  ]

  const handleBrokerageSelect = (brokerageId: string) => {
    const brokerage = brokerages.find(b => b.id === brokerageId)
    if (brokerage?.available) {
      setSelectedBrokerage(brokerageId)
    }
  }

  const handleAuthorize = async () => {
    window.location.href = "https://api.schwabapi.com/v1/oauth/authorize?response_type=code&client_id=1wzwOrhivb2PkR1UCAUVTKYqC4MTNYlj&scope=readonly&redirect_uri=https://developer.schwab.com/oauth2-redirect.html"
    // setIsConnecting(true)
    // setStep('authorize')

    // // Simulate authorization process
    // setTimeout(() => {
    //   setStep('success')
    //   setIsConnecting(false)
    // }, 3000)
  }

  const selectedBroker = brokerages.find(b => b.id === selectedBrokerage)

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="relative">
              <svg className="w-12 h-12" viewBox="0 0 120 120">
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
              <div className="text-xl font-bold text-white">TRADE STEWARD</div>
              <div className="text-xs text-gray-300 tracking-widest">OPENING YOUR OPTIONS</div>
            </div>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-4">
            Connect Your Brokerage Account
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Securely link your trading account to enable automated options trading and performance tracking
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'select' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
              {step === 'select' ? '1' : '✓'}
            </div>
            <div className={`h-1 w-16 ${step === 'select' ? 'bg-gray-600' : 'bg-green-600'
              }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'select' ? 'bg-gray-600 text-gray-400' :
              step === 'authorize' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
              {step === 'success' ? '✓' : '2'}
            </div>
            <div className={`h-1 w-16 ${step === 'success' ? 'bg-green-600' : 'bg-gray-600'
              }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'success' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-400'
              }`}>
              {step === 'success' ? '✓' : '3'}
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'select' && (
          <div>
            <h2 className="text-xl font-bold text-white text-center mb-8">
              Choose Your Brokerage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {brokerages.map((brokerage) => (
                <div
                  key={brokerage.id}
                  className={`relative bg-[rgb(15 23 42)] rounded-lg border p-6 cursor-pointer transition-all ${selectedBrokerage === brokerage.id
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : brokerage.available
                      ? 'border-slate-700 hover:border-slate-600'
                      : 'border-slate-700 opacity-60 cursor-not-allowed'
                    }`}
                  onClick={() => handleBrokerageSelect(brokerage.id)}
                >
                  {brokerage.comingSoon && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium">
                        Coming Soon
                      </span>
                    </div>
                  )}

                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{brokerage.logo}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {brokerage.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {brokerage.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {brokerage.features.map((feature) => (
                          <div key={feature} className="flex items-center space-x-1">
                            <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-300 text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedBrokerage === brokerage.id && (
                    <div className="absolute inset-0 rounded-lg border-2 border-blue-500 pointer-events-none" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Link
                to="/useracct/brokerlink"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded transition-colors"
              >
                Cancel
              </Link>
              <button
                onClick={handleAuthorize}
                disabled={!selectedBrokerage || !selectedBroker?.available}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded transition-colors"
              >
                Continue with {selectedBroker?.name || 'Selected Broker'}
              </button>
            </div>
          </div>
        )}

        {step === 'authorize' && selectedBroker && (
          <div className="text-center">
            <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-8 max-w-md mx-auto">
              <div className="text-4xl mb-4">{selectedBroker.logo}</div>
              <h2 className="text-xl font-bold text-white mb-4">
                Connecting to {selectedBroker.name}
              </h2>

              {isConnecting ? (
                <div>
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4" />
                  <p className="text-gray-300 mb-4">
                    Redirecting to {selectedBroker.name} for secure authorization...
                  </p>
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                    <p className="text-blue-300 text-sm">
                      You will be redirected to {selectedBroker.name}'s secure login page to authorize tradeSteward access to your account.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300 mb-6">
                    Click the button below to securely connect your {selectedBroker.name} account
                  </p>
                  <button
                    onClick={() => setIsConnecting(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition-colors"
                  >
                    Authorize {selectedBroker.name} Access
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'success' && selectedBroker && (
          <div className="text-center">
            <div className="bg-[rgb(15 23 42)] rounded-lg border border-slate-700 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-white mb-4">
                Successfully Connected!
              </h2>
              <p className="text-gray-300 mb-6">
                Your {selectedBroker.name} account has been successfully linked to tradeSteward.
                You can now start creating automated trading bots and tracking your performance.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition-colors"
                >
                  Go to Trading Dashboard
                </button>
                <button
                  onClick={() => navigate('/useracct/brokerlink')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded transition-colors"
                >
                  Manage Connected Accounts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-12 bg-blue-900/20 border border-blue-700/30 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">Your Security is Our Priority</h3>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>• All connections use bank-level encryption and OAuth 2.0 security</li>
                <li>• tradeSteward never stores your brokerage login credentials</li>
                <li>• You can revoke access at any time from your brokerage account</li>
                <li>• We only access your account for authorized trading and data sync</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
