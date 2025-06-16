export function PricingSection() {
  const trackTradePlans = [
    {
      name: "Track & Trade Premiere",
      price: "$99.99",
      period: "/mo",
      description:
        "Perfect for traders new to autotrading with more than one account. Use up to three accounts to trade eight bots.",
      features: [
        "Link Multiple Brokers",
        "Balance Tracking - 3 Accounts",
        "Trade Tracking - 3 Accounts",
        "Automatic Trade Capture",
        "Unlimited User-Defined P&L Strategies",
        "Unlimited Historical Storage",
        "Unlimited Trade Log",
        "Unlimited Trade Journaling Notes",
        "Auto Trading - 3 Accounts",
        "8 Autotrader Bots",
        "Launch Now! Bot Feature",
        "Bot Performance Tracking",
        "Bot Performance Tracking by Account",
        "Same-Day Email Support",
        "tradeSteward Discord Community",
        "Live Support on Discord",
      ],
    },
    {
      name: "Track & Trade Titanium",
      price: "$139.99",
      period: "/mo",
      description:
        "Up to 15 automated trading bots to use across all of your linked brokerage accounts.",
      features: [
        "Link Multiple Brokers",
        "Balance Tracking - Unlimited Accounts",
        "Trade Tracking - Unlimited Accounts",
        "Automatic Trade Capture",
        "Unlimited User-Defined P&L Strategies",
        "Unlimited Historical Storage",
        "Unlimited Trade Log",
        "Unlimited Trade Journaling Notes",
        "Auto Trading - Unlimited Accounts",
        "15 Autotrader Bots",
        "Launch Now! Bot Feature",
        "Bot Performance Tracking",
        "Bot Performance Tracking by Account",
        "Trading View/Webhook Bot Controls",
        "Same-Day Email Support",
        "tradeSteward Discord Community",
        "Live Support on Discord",
      ],
    },
    {
      name: "Track & Trade Platinum",
      price: "$249.99",
      period: "/mo",
      description:
        "Our most popular offering. Up to 30 automated trading bots to use across all your linked brokerage accounts.",
      popular: true,
      features: [
        "Multiple Brokers - Unlimited Accounts",
        "Balance Tracking - Unlimited Accounts",
        "Trade Tracking - Unlimited Accounts",
        "Automatic Trade Capture",
        "Unlimited User-Defined P&L Strategies",
        "Unlimited Historical Storage",
        "Unlimited Trade Log",
        "Unlimited Trade Journaling Notes",
        "Auto Trading - Unlimited Accounts",
        "30 Autotrader Bots",
        "Launch Now! Bot Feature",
        "Bot Performance Tracking",
        "Bot Performance Tracking by Account",
        "Trading View/Webhook Bot Controls",
        "Same-Day Priority Email Support",
        "tradeSteward Discord Community",
        "Priority Live Support on Discord",
      ],
    },
  ];

  const trackingPlans = [
    {
      name: "Tracker Free",
      price: "Free",
      period: "",
      description:
        "We'll log your trades and your balance. Like your broker should. For free.",
      features: [
        "Balance Tracking - 1 Account",
        "Trade Tracking - 1 Account",
        "Automatic Trade Capture",
        "Unlimited Historical Storage",
        "Unlimited Trade Log",
      ],
    },
    {
      name: "Tracker Starter",
      price: "$9.99",
      period: "/mo",
      description:
        "Get started with tracking one account. You'll wonder how you traded before.",
      features: [
        "Balance Tracking - 1 Account",
        "Trade Tracking - 1 Account",
        "Automatic Trade Capture",
        "5 User-Defined P&L Strategies",
        "Unlimited Historical Storage",
        "Unlimited Trade Log",
        "Email Support",
        "tradeSteward Discord Community",
        "Live Support on Discord",
      ],
    },
    {
      name: "Tracker Pro",
      price: "$24.99",
      period: "/mo",
      description:
        "Keep tabs on all your brokerage accounts with our unlimited tracking.",
      features: [
        "Multiple Brokers - Unlimited Accounts",
        "Balance Tracking - Unlimited Accounts",
        "Trade Tracking - Unlimited Accounts",
        "Automatic Trade Capture",
        "Unlimited User-Defined P&L Strategies",
        "Unlimited Historical Storage",
        "Unlimited Trade Log",
        "Unlimited Trade Journaling Notes",
        "Email Support",
        "tradeSteward Discord Community",
        "Live Support on Discord",
      ],
    },
  ];

  return (
    <div className=" bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Plan Pricing</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get your feet wet with our free tracking offering. Or jump in to
            autotrading with plans as cheap as $4.99/mo per bot.
            <br />
            Either way, tradeSteward offers a plan to fit your trading needs.
          </p>
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 max-w-4xl mx-auto">
            <p className="text-green-800 font-medium">
              Come join us and enjoy a no-obligation one week trial FREE on any
              plan up to $139.99/mo!
              <br />
              <span className="text-sm">
                Offer valid for new subscribers only. Trial automatically
                activated at checkout for eligible customers.
              </span>
            </p>
          </div>
        </div>

        {/* Track & Trade Packages */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Track & Trade Packages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trackTradePlans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-slate-800 rounded-lg p-8 border ${plan.popular ? "border-green-500" : "border-slate-700"} relative`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h4 className="text-xl font-bold text-white mb-4">
                  {plan.name}
                </h4>
                <p className="text-gray-300 text-sm mb-6">{plan.description}</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-300">{plan.period}</span>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors mb-6">
                  GET STARTED NOW!
                </button>
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Packages */}
        <div>
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Tracking Packages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trackingPlans.map((plan) => (
              <div
                key={plan.name}
                className="bg-slate-800 rounded-lg p-8 border border-slate-700"
              >
                <h4 className="text-xl font-bold text-white mb-4">
                  {plan.name}
                </h4>
                <p className="text-gray-300 text-sm mb-6">{plan.description}</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-300">{plan.period}</span>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors mb-6">
                  {plan.price === "Free"
                    ? "START FOR FREE"
                    : "GET STARTED NOW!"}
                </button>
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
