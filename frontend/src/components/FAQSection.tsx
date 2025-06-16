import { useState } from "react";

export function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Was tradeSteward really founded by actual traders?",
      answer:
        "Absolutely! tradeSteward's founder is a reformed manual options trader (one year his 1099-B was over 400 pages - yikes!) who loved the \"feel\" of putting on and taking off trades. After realizing how limiting - and how time consuming - it was to manually trade the same strategies day in, day out, something had to change. When you've got multiple trades on with the same strike, scratching down notes throughout the trading day quickly gets confusing and error-prone. There had to be a better way.",
    },
    {
      question: "What is automated options trading?",
      answer:
        "Our automated trading engine allows you to define a trade so that the entry and exit, if desired, is handled automatically for you. Based on a set of specific entry criteria based on an entry strike selection metric, put or call, long or short, and days to expiration, the trade can consist of up to four option legs per trade. Exits can be defined based on profit targets, stop losses, or timed forced exits or any combination of the three.",
    },
    {
      question:
        "Why would I want to use an automated trading system instead of just putting trades on myself?",
      answer:
        "The edge that automated trading systems provide is in how many different trades an automated trading system can monitor at once compared to manual trading. After putting on more than a handful of trades, the average trader can quickly get confused about which option contract goes with which trade. Monitoring various stop or profit criteria and manually putting on a closing trade when the criteria is met and setting up each individual trade on entry can take several minutes.",
    },
    {
      question: "What symbols does tradeSteward support options trading for?",
      answer:
        "tradeSteward supports options trading from over 42 different symbols. Our current list of supported symbols includes SPY, QQQ, IWM, SPX, NDX, RUT, and many more popular ETFs and indices.",
    },
    {
      question: "Is this a trading signal service?",
      answer:
        "No, tradeSteward is not a trading signal service. We provide the tools and platform for you to implement your own trading strategies through automated bots. You define your own entry and exit criteria, strike selections, and risk management parameters.",
    },
    {
      question:
        "Does tradeSteward provide trade ideas or trade signals for me to choose from?",
      answer:
        "No, tradeSteward does not provide trade ideas or signals. Our platform is designed to automate the execution of your own trading strategies. You bring the strategy, and we provide the automation and tracking tools.",
    },
    {
      question: "How complicated is tradeSteward to use?",
      answer:
        "tradeSteward is designed to be intuitive and user-friendly. Our point-and-click interface makes it easy to set up trading bots, monitor performance, and track your trades. If you can imagine an options trade, tradeSteward can trade it.",
    },
    {
      question: "How do I setup a bot?",
      answer:
        "Setting up a bot is straightforward with our configuration interface. Simply define your strike selection criteria, choose your option type (calls or puts), set your entry and exit rules, and activate the bot. Our step-by-step wizard guides you through the entire process.",
    },
    {
      question: "What brokerages does tradeSteward support?",
      answer:
        "tradeSteward currently supports integration with major brokerages including Schwab Trading, Tradier, and TastyTrade, with TradeStation coming soon. We continue to expand our brokerage partnerships to serve more traders.",
    },
    {
      question:
        "I have a taxable and Roth IRA account. Can I use both accounts with one tradeSteward account?",
      answer:
        "Yes, you can link multiple brokerage accounts to a single tradeSteward account, including both taxable and IRA accounts. Our platform supports tracking and trading across multiple account types simultaneously.",
    },
    {
      question: "Who owns my trade data?",
      answer:
        "You own your trade data. tradeSteward securely stores and processes your trading information to provide our services, but the data remains yours. We do not sell or share your personal trading data with third parties.",
    },
    {
      question:
        "Is tradeSteward open to new features or different trade functionality?",
      answer:
        "Absolutely! tradeSteward is committed to continuous improvement and regularly adds new features based on user feedback. We actively listen to our community and implement requested functionality that enhances the trading experience.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="pt-20 bg-[rgb(15 23 42)]">
      <hr className="border-[#eff0f6] max-w-[85%] mx-auto opacity-[0.25]" />
      <div className="max-w-4xl mx-auto px-6 py-20 ">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Just the FAQs</h2>
          <p className="text-xl text-gray-300">
            Got questions? No problem. Check out the stuff we get asked the
            most. If we're missing something, or you want more detail, send us a
            message to connect.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="bg-slate-900 rounded-lg border border-slate-700"
            >
              <button
                onClick={() => toggleFAQ(faqs.indexOf(faq))}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-700/50 transition-colors"
              >
                <span className="text-lg font-medium text-white pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-gray-400 transform transition-transform ${
                    openFAQ === faqs.indexOf(faq) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFAQ === faqs.indexOf(faq) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-slate-700 pt-4">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
