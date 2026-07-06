import { useParams } from 'react-router-dom'
import { api } from '../lib/axios'
import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

type HelpVideo = {
  id: string
  title: string
  category: string
  youtubeId: string
}

const HelpCenterCategorie = () => {
  const [videos, setVideos] = useState<HelpVideo[]>([])
  const [loading, setLoading] = useState(true)
  const { category } = useParams()

  const getVideos = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/user/help-center/${category}`)
      if (res.status === 200) {
        setVideos(res.data?.data ?? [])
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message ?? 'Failed to load videos')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getVideos()
  }, [category])

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
              <div className="aspect-video w-full animate-pulse rounded-lg bg-[#EDEDED] dark:bg-gray-light" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-[#EDEDED] dark:bg-gray-light" />
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
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
