const PerformanceTracking = () => {
  return (
    <section className="bg-gray-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Performance screenshots */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-ts-gray rounded-lg p-4 shadow-lg">
                <img
                  src="https://ext.same-assets.com/2831944752/2014206144.jpeg"
                  alt="Intraday account chart"
                  className="w-full rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-ts-gray rounded-lg p-4 shadow-lg">
                  <img
                    src="https://ext.same-assets.com/2831944752/342135443.jpeg"
                    alt="Calendar report"
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="bg-ts-gray rounded-lg p-4 shadow-lg">
                  <img
                    src="https://ext.same-assets.com/2831944752/4052247287.jpeg"
                    alt="Account performance chart"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <section id="accountStat" className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="mb-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="lg:order-2">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                      Your Money. Your Progress.
                    </h2>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                      tradeSteward makes it easy to track your performance and
                      overall progress to your trading goals with easy to use
                      and read charts and reports. A quick-glance,
                      minute-by-minute chart keeps you updated as the trading
                      day unfolds, or take a longer term view on total account
                      performance. The calendar report shows you trends that you
                      might have never realized existed.
                    </p>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                      All this and much more makes tracking your winners and
                      your money easier than ever.
                    </p>
                    <a
                      href="/register"
                      className="inline-block bg-[#3ba577] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#2a8a5f] transition-colors"
                    >
                      Start Trading Today!
                    </a>
                  </div>
                  <div className="lg:order-1">
                    <img
                      src="https://ext.same-assets.com/2831944752/4202880122.jpeg"
                      alt="View of TradeSteward intraday account chart report"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Account Features Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src="https://ext.same-assets.com/2831944752/3943249842.jpeg"
                    alt="View of TradeSteward calendar report"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src="https://ext.same-assets.com/2831944752/3951667257.jpeg"
                    alt="View of TradeSteward account chart"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default PerformanceTracking;
