const Integrations = () => {
  const partners = [
    {
      name: "Schwab Trading",
      logo: "https://ext.same-assets.com/2831944752/1968927566.png",
      className: "bg-white"
    },
    {
      name: "Tradier",
      logo: "https://ext.same-assets.com/2831944752/429257677.svg",
      className: "bg-white"
    },
    {
      name: "TastyTrade",
      logo: "https://ext.same-assets.com/2831944752/3928480305.svg",
      className: "bg-white"
    },
    {
      name: "TradeStation",
      logo: "https://ext.same-assets.com/2831944752/872774926.png",
      className: "bg-white"
    }
  ]

  return (
    <section className="bg-ts-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-8">
          Featuring Account Integration with
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className={`${partner.className} rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow w-full max-w-[200px] h-[120px] flex items-center justify-center`}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="text-ts-light text-sm italic">*TradeStation coming soon!</p>
        </div>
      </div>
    </section>
  )
}

export default Integrations
