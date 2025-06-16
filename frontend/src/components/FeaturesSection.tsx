export function FeaturesSection() {
  return (
    <div className="py-20 bg-[rgb(17 24 39)]">
      <div className="mx-auto px-16">
        {/* Trade Your Way Section */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Trading just got a lot easier.
              </h2>
              <p className="text-lg text-white mb-8 leading-relaxed">
                Point and click your way to trading success. Define your bot's
                strategy on the easy to use configuration page, quickly compare
                bot performances, and check the second-by-second happenings of
                your trading bots all from the web. If you can imagine an
                options trade, tradeSteward can trade it.
              </p>
              <p className="text-lg text-white mb-8 leading-relaxed">
                Choose from premium, delta, width, or percent distances for your
                strike selections. Ratios, mixed expirations, and even
                account-based conflict resolution are all possible.
              </p>
              <a
                href="/register"
                className="inline-block bg-[#3ba577] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#2a8a5f] transition-colors"
              >
                Get Started Now!
              </a>
            </div>
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
              <div className="absolute inset-0 flex animate-carousel">
                <div className="flex-shrink-0 w-full h-full">
                  <img
                    src="https://www.tradesteward.com/img/trading/botperformance.jpg"
                    alt="Bot Performance"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-shrink-0 w-full h-full">
                  <img
                    src="https://www.tradesteward.com/img/trading/logs.jpg"
                    alt="Trading Logs"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-shrink-0 w-full h-full">
                  <img
                    src="https://www.tradesteward.com/img/trading/config.jpg"
                    alt="Trading Performance"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-[#eff0f6] max-w-[85%] mx-auto opacity-[0.25]" />
        {/* Your Money. Your Progress. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
          <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
            <div className="absolute inset-0 flex animate-carousel">
              <div className="flex-shrink-0 w-full h-full">
                <img
                  src="https://www.tradesteward.com/img/account/account.jpg"
                  alt="Bot Performance"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-shrink-0 w-full h-full">
                <img
                  src="https://www.tradesteward.com/img/account/calendar.jpg"
                  alt="Trading Logs"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-shrink-0 w-full h-full">
                <img
                  src="https://www.tradesteward.com/img/account/chart.jpg"
                  alt="Trading Performance"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-5xl font-bold text-white mb-8">
              Your Money. Your Progress.
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              tradeSteward makes it easy to track your performance and overall
              progress to your trading goals with easy to use and read charts
              and reports. A quick-glance, minute-by-minute chart keeps you
              updated as the trading day unfolds, or take a longer term view on
              total account performance. The calendar report shows you trends
              that you might have never realized existed.
            </p>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              All this and much more makes tracking your winners and your money
              easier than ever.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded transition-colors">
              GET STARTED NOW!
            </button>
          </div>
        </div>

        <hr className="border-[#eff0f6] max-w-[85%] mx-auto opacity-[0.25]" />
        {/* Your Money. Your Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
          <div>
            <h2 className="text-5xl font-bold text-white mb-8">
              Trade-by-Trade Strategy Performance
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              Gone are the days of having to trust your gut on what's working
              and what's not. Our exclusive, automated trade matching system
              helps you group your trades to quickly see what's working and
              what's not. Working seemlessly with our automated trading system,
              Strategy Performance Tracking will show you the outcome for all of
              your trades, neatly grouped over time.
            </p>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Armed with the right data, strategy allocation just suddenly
              became enjoyable instead of a chore.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded transition-colors">
              START TRADING TODAY!
            </button>
          </div>
          <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
            <div className="absolute inset-0 flex animate-carousel">
              <div className="flex-shrink-0 w-full h-full">
                <img
                  src="https://www.tradesteward.com/img/strategy/stratChart.jpg"
                  alt="Bot Performance"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-shrink-0 w-full h-full">
                <img
                  src="https://www.tradesteward.com/img/account/calendar.jpg"
                  alt="Trading Logs"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-shrink-0 w-full h-full">
                <img
                  src="https://www.tradesteward.com/img/account/chart.jpg"
                  alt="Trading Performance"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="border-[#eff0f6] max-w-[85%] mx-auto opacity-[0.25]" />
      </div>
    </div>
  );
}
