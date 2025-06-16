export function VideoVaultSection() {
  const videos = [
    {
      title: "tradeSteward - Dashboard - Making Sense of Your Trading Performance",
      description: "Learn how to use the Trading Dashboard to track your trades and performance.",
      embedId: "THtRpAQOjQc",
      thumbnail: "https://i.ytimg.com/vi/THtRpAQOjQc/sddefault.jpg"
    },
    {
      title: "tradeSteward - Simple Bot Creation",
      description: "Watch a brief overview of how to create a simple tradeSteward bot.",
      embedId: "cgabRemS934",
      thumbnail: "https://i.ytimg.com/vi/cgabRemS934/sddefault.jpg"
    }
  ]

  return (
    <div className=" bg-slate-900">
      <hr className="border-[#eff0f6] max-w-[85%] mx-auto opacity-[0.25]" />
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">tradeSteward Video Vault</h2>
          <p className="text-xl text-gray-300 mb-8">
            Access professional trading tutorials through our curated{' '}
            <span className="text-blue-400">collection of comprehensive video guides</span>.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {videos.map((video) => (
            <div key={video.embedId} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
              {/* Video Thumbnail/Embed */}
              <div className="relative aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.embedId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded transition-colors">
            VIEW MORE IN THE TRADESTEWARD VIDEO VAULT
          </button>
        </div>
      </div>
      <hr className="border-[#eff0f6] max-w-[85%] mx-auto opacity-[0.25]" />
    </div>
  )
}
