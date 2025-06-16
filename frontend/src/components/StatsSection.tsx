export function StatsSection() {
  const stats = [
    {
      icon: (
        <svg
          className="w-12 h-12 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3 13h8V3c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10zm0 8h8c1.1 0 2-.9 2-2v-6H3v8zm10 0h8c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2h-8v10zm0-12h8V3c0-1.1-.9-2-2-2h-6v6z" />
        </svg>
      ),
      number: "14,068,525",
      label: "Options Traded",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
        </svg>
      ),
      number: "2,973,121",
      label: "Trades Tracked",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      number: "70,769",
      label: "Bots Configured",
    },
  ];

  return (
    <section className="bg-gray-900 text-white ">
      <hr className="border-[#eff0f6] max-w-[85%] mx-auto opacity-[0.25]" />
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            The numbers speak for themselves!
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 ">
          {/* Options Traded */}
          <div className="text-center animate-fade-in-up animate-delay-100 hover-lif bg-[#38a671!important] p-4 rounded-lg">
            <div className="mb-4">
              <img
                src="https://ext.same-assets.com/2831944752/3041934413.svg"
                alt="Options Icon"
                className="h-16 w-16 mx-auto animate-float brightness-0 invert"
              />
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-[#ffffff] mb-2 animate-count-up animate-glow">
              14,284,344
            </div>
            <h3 className="text-xl font-semibold">Options Traded</h3>
          </div>

          {/* Trades Tracked */}
          <div className="text-center animate-fade-in-up animate-delay-200 hover-lift bg-[#38a671!important] p-4 rounded-lg">
            <div className="mb-4">
              <img
                src="https://ext.same-assets.com/2831944752/1218589114.svg"
                alt="Trades Icon"
                className="h-16 w-16 mx-auto animate-float animate-delay-100 brightness-0 invert"
              />
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-[#ffffff] mb-2 animate-count-up animate-delay-100">
              3,019,546
            </div>
            <h3 className="text-xl font-semibold">Trades Tracked</h3>
          </div>

          {/* Bots Configured */}
          <div className="text-center animate-fade-in-up animate-delay-300 hover-lift bg-[#38a671!important] p-4 rounded-lg">
            <div className="mb-4">
              <img
                src="https://ext.same-assets.com/2831944752/396876698.svg"
                alt="Bots Icon"
                className="h-16 w-16 mx-auto animate-float animate-delay-200  brightness-0 invert"
              />
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-[#ffffff] mb-2 animate-count-up animate-delay-200">
              71,959
            </div>
            <h3 className="text-xl font-semibold">Bots Configured</h3>
          </div>
        </div>
      </div>
      <hr className="border-[#eff0f6] max-w-[85%] mx-auto opacity-[0.25]" />
    </section>
  );
}
