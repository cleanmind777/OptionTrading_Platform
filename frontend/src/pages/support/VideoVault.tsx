import { useState, useEffect } from 'react'

interface VideoModule {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  category: string
  videoUrl: string
  durationSeconds: number
}

interface VideoProgress {
  [videoId: string]: {
    watchedSeconds: number
    completed: boolean
    lastWatched: string
    progressPercentage: number
  }
}

const videoModules: VideoModule[] = [
  // Bot Settings
  {
    id: 'bot-settings-1',
    title: 'Configuring Bot Settings',
    description: 'Watch a brief overview of how to create a proper tradesteward bot.',
    thumbnail: '/api/placeholder/400/250',
    duration: '8:30',
    category: 'Bot Settings',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    durationSeconds: 510
  },
  {
    id: 'bot-settings-2',
    title: 'How to create your first bot: settings and setup and the account for bot first time',
    description: 'Sign here to create your first trading strategy and configuration and setup your account for the first time',
    thumbnail: '/api/placeholder/400/250',
    duration: '12:45',
    category: 'Bot Settings',
    videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    durationSeconds: 765
  },
  {
    id: 'bot-settings-3',
    title: 'Quick Daily Earning: Including setting and setup and fixing fee account for the new user.',
    description: 'Think Daily Settings, Including setting and setup and fixing fee account for the new user.',
    thumbnail: '/api/placeholder/400/250',
    duration: '15:20',
    category: 'Bot Settings',
    videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
    durationSeconds: 920
  },
  {
    id: 'bot-settings-4',
    title: 'Learn about Trading Setup',
    description: 'Learn about trading your setup strategy: setting strategies which will help in your bot trading.',
    thumbnail: '/api/placeholder/400/250',
    duration: '18:45',
    category: 'Bot Settings',
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    durationSeconds: 1125
  },

  // Trading Dashboard
  {
    id: 'trading-dashboard-1',
    title: 'Trading Dashboard',
    description: 'Learn how to use the Trading Dashboard to keep your trading performance.',
    thumbnail: '/api/placeholder/400/250',
    duration: '10:15',
    category: 'Trading Dashboard',
    videoUrl: 'https://www.youtube.com/embed/LDU_Txk06tM',
    durationSeconds: 615
  },
  {
    id: 'trading-dashboard-2',
    title: 'Get a quick overview of the different parts of the Dashboard Dashboard.',
    description: 'Get a quick overview of the different parts of the Dashboard Dashboard.',
    thumbnail: '/api/placeholder/400/250',
    duration: '14:30',
    category: 'Trading Dashboard',
    videoUrl: 'https://www.youtube.com/embed/CevxZvSJLk8',
    durationSeconds: 870
  },

  // Performance Tracking
  {
    id: 'performance-1',
    title: 'Performance Tracking',
    description: 'Learn how to track your strategy account and your trading performance in TradesSteward.',
    thumbnail: '/api/placeholder/400/250',
    duration: '13:25',
    category: 'Performance Tracking',
    videoUrl: 'https://www.youtube.com/embed/kffacxfA7G4',
    durationSeconds: 805
  },

  // Linking Broker Accounts
  {
    id: 'broker-1',
    title: 'Linking Broker Accounts',
    description: 'Hook up required brokers under standard account requirements.',
    thumbnail: '/api/placeholder/400/250',
    duration: '9:40',
    category: 'Linking Broker Accounts',
    videoUrl: 'https://www.youtube.com/embed/YQHsXMglC9A',
    durationSeconds: 580
  },

  // Strategies
  {
    id: 'strategies-1',
    title: 'Strategies',
    description: 'View Strategies are and have easy to read to understand Trading strategies and performance in TradesSteward.',
    thumbnail: '/api/placeholder/400/250',
    duration: '16:55',
    category: 'Strategies',
    videoUrl: 'https://www.youtube.com/embed/hFcLyDb7iPM',
    durationSeconds: 1015
  }
]

const categories = [
  'All Videos',
  'Bot Settings',
  'Trading Dashboard',
  'Performance Tracking',
  'Linking Broker Accounts',
  'Strategies'
]

export function VideoVault() {
  const [selectedCategory, setSelectedCategory] = useState('All Videos')
  const [selectedVideo, setSelectedVideo] = useState<VideoModule | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [videoProgress, setVideoProgress] = useState<VideoProgress>({})

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('tradesteward-video-progress')
    if (savedProgress) {
      try {
        setVideoProgress(JSON.parse(savedProgress))
      } catch (error) {
        console.error('Error loading video progress:', error)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tradesteward-video-progress', JSON.stringify(videoProgress))
  }, [videoProgress])

  const filteredVideos = selectedCategory === 'All Videos'
    ? videoModules
    : videoModules.filter(video => video.category === selectedCategory)

  const handleVideoClick = (video: VideoModule) => {
    setSelectedVideo(video)
    setIsModalOpen(true)

    // Update last watched time
    const now = new Date().toISOString()
    setVideoProgress(prev => ({
      ...prev,
      [video.id]: {
        ...prev[video.id],
        lastWatched: now,
        watchedSeconds: prev[video.id]?.watchedSeconds || 0,
        completed: prev[video.id]?.completed || false,
        progressPercentage: prev[video.id]?.progressPercentage || 0
      }
    }))
  }

  const handleVideoComplete = (videoId: string) => {
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        completed: true,
        progressPercentage: 100,
        watchedSeconds: videoModules.find(v => v.id === videoId)?.durationSeconds || 0,
        lastWatched: new Date().toISOString()
      }
    }))
  }

  const handleVideoProgress = (videoId: string, currentTime: number) => {
    const video = videoModules.find(v => v.id === videoId)
    if (!video) return

    const progressPercentage = Math.round((currentTime / video.durationSeconds) * 100)
    const isCompleted = progressPercentage >= 90 // Consider 90% as completed

    setVideoProgress(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        watchedSeconds: currentTime,
        progressPercentage,
        completed: isCompleted,
        lastWatched: new Date().toISOString()
      }
    }))
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  const getVideoProgress = (videoId: string) => {
    return videoProgress[videoId] || {
      watchedSeconds: 0,
      completed: false,
      lastWatched: '',
      progressPercentage: 0
    }
  }

  const getCompletedVideosCount = () => {
    return Object.values(videoProgress).filter(p => p.completed).length
  }

  const getCategoryProgress = (category: string) => {
    const categoryVideos = videoModules.filter(v => v.category === category)
    const completedInCategory = categoryVideos.filter(v => videoProgress[v.id]?.completed).length
    return { completed: completedInCategory, total: categoryVideos.length }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              tradesteward Video Vault
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto mb-4">
              Access professional trading tutorials through our curated collection of comprehensive video guides.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">
                  {getCompletedVideosCount()} of {videoModules.length} videos completed
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">
                  {Math.round((getCompletedVideosCount() / videoModules.length) * 100)}% progress
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-slate-800 border-b border-slate-700 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const progress = category !== 'All Videos' ? getCategoryProgress(category) : null
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {category}
                  {progress && progress.completed > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                      {progress.completed}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Video Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Current Category Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {selectedCategory === 'All Videos' ? 'All Training Videos' : selectedCategory}
          </h2>
          <p className="text-gray-400">
            {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} available
            {selectedCategory !== 'All Videos' && (() => {
              const progress = getCategoryProgress(selectedCategory)
              return ` • ${progress.completed} completed`
            })()}
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const progress = getVideoProgress(video.id)
            return (
              <div
                key={video.id}
                className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors cursor-pointer group relative"
                onClick={() => handleVideoClick(video)}
              >
                {/* Completion Badge */}
                {progress.completed && (
                  <div className="absolute top-2 right-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Completed</span>
                  </div>
                )}

                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-slate-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
                    {video.duration}
                  </div>
                  <div className="absolute top-2 left-2 bg-blue-600 px-2 py-1 rounded text-xs text-white">
                    {video.category}
                  </div>

                  {/* Progress Bar */}
                  {progress.progressPercentage > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-600">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${progress.progressPercentage}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    {video.description}
                  </p>

                  {/* Progress Info */}
                  {progress.progressPercentage > 0 && (
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{progress.progressPercentage}% watched</span>
                      {progress.lastWatched && (
                        <span>Last: {new Date(progress.lastWatched).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Video Actions */}
                <div className="px-4 pb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVideoClick(video)
                    }}
                    className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      progress.completed
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : progress.progressPercentage > 0
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {progress.completed ? 'Watch Again' : progress.progressPercentage > 0 ? 'Continue Watching' : 'Watch Video'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Videos Found</h3>
            <p className="text-gray-400">
              No videos available for the selected category.
            </p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white truncate pr-4">
                  {selectedVideo.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedVideo.category} • {selectedVideo.duration}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors ml-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-black">
              <iframe
                src={`${selectedVideo.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => {
                  // Simulate video progress tracking
                  const simulateProgress = () => {
                    let currentTime = getVideoProgress(selectedVideo.id).watchedSeconds
                    const interval = setInterval(() => {
                      currentTime += 5
                      handleVideoProgress(selectedVideo.id, currentTime)

                      if (currentTime >= selectedVideo.durationSeconds * 0.9) {
                        handleVideoComplete(selectedVideo.id)
                        clearInterval(interval)
                      }
                    }, 5000)

                    // Clear interval when modal closes
                    return () => clearInterval(interval)
                  }

                  setTimeout(simulateProgress, 2000)
                }}
              />
            </div>

            {/* Video Info & Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${getVideoProgress(selectedVideo.id).completed ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className="text-gray-300">
                      {getVideoProgress(selectedVideo.id).progressPercentage}% completed
                    </span>
                  </div>
                  {getVideoProgress(selectedVideo.id).completed && (
                    <div className="flex items-center space-x-1 text-green-400 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Completed</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleVideoComplete(selectedVideo.id)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  Mark Complete
                </button>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="bg-slate-800 border-t border-slate-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            Need help with specific features? Check our comprehensive video guides for step-by-step tutorials.
          </p>
        </div>
      </div>
    </div>
  )
}
