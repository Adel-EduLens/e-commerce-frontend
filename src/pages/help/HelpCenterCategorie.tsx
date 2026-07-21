import { useParams } from 'react-router-dom'
import { useUserHelpCenterVideos } from '../../hooks/queries/helpCenterQuery'

type HelpVideo = {
  id: string
  title: string
  category: string
  youtubeId: string
}

const HelpCenterCategorie = () => {
  const { category } = useParams()
  const { data: videos = [], isLoading: loading } = useUserHelpCenterVideos(category || '')

  return (
    <div className="flex w-full flex-col gap-10 px-6 py-10">
      <div className="font-['Montserrat'] text-3xl font-bold text-foreground">
        {category}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl bg-card p-4 outline outline-1 outline-offset-[-1px] outline-stroke"
            >
              <div className="aspect-video w-full animate-pulse rounded-lg bg-gray-light dark:bg-gray-light" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-light dark:bg-gray-light" />
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl bg-card p-10 text-center outline outline-1 outline-offset-[-1px] outline-stroke">
          <div className="font-['Montserrat'] text-base font-medium text-gray-text">
            No videos available in this category yet.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex flex-col gap-3 rounded-2xl bg-card p-4 outline outline-1 outline-offset-[-1px] outline-stroke"
            >
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${video.youtubeId.replace(/[^a-zA-Z0-9_-]/g, '')}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                  allowFullScreen
                />
              </div>
              <div className="font-['Montserrat'] text-lg font-semibold text-foreground">
                {video.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HelpCenterCategorie
