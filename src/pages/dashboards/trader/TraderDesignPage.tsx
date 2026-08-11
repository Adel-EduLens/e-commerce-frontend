import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaImage, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { Eye, Vote } from 'lucide-react'
import { api } from '../../../lib/axios'
import { toast } from 'sonner'
import { handleApiError } from '../../../lib/utils'

type UploadedImage = {
  id: string
  description: string
  imagePath: string
  votes?: number
}

function ImageUpload({
  file,
  onChange,
}: {
  file: File | null
  onChange: (file: File | null) => void
}) {
  const { t } = useTranslation('traderDesigns')
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrl = file ? URL.createObjectURL(file) : null

  return (
    <div className="flex flex-col gap-2">
      <label className="font-['Montserrat'] text-sm font-medium">{t('imageLabel')}</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />

      {previewUrl ? (
        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gray-light">
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={t('removeImage')}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-2xl bg-gray-light p-4 cursor-pointer hover:bg-stroke/30 transition"
        >
          <FaImage className="h-8 w-8 text-gray-text" />
          <div className="font-['Montserrat'] text-base font-medium text-gray-text">
            {t('clickToUpload')}
          </div>
        </button>
      )}
    </div>
  )
}

function ImageGrid({
  images,
  onDeleted,
}: {
  images: UploadedImage[]
  onDeleted: (id: string) => void
}) {
  const { t } = useTranslation('traderDesigns')
  const navigate = useNavigate()

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/trader/designs/${id}`)
      if (res.status === 200) {
        toast.success(t('deleteSuccess'))
        onDeleted(id)
      }
    } catch (error) {
      handleApiError(error, t('deleteError'))
    }
  }

  if (images.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl bg-card border border-stroke p-10 text-center">
        <div className="font-['Montserrat'] text-base font-medium text-gray-text">
          {t('noImagesYet')}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => {
        const votesCount = image.votes ?? 0

        return (
          <div
            key={image.id}
            className="group relative flex flex-col justify-between rounded-[24px] bg-card p-4 border border-stroke shadow-sm transition hover:shadow-md"
          >
            <div className="space-y-3">
              {/* Image Preview & Badges */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-light">
                <img
                  src={image.imagePath}
                  alt={image.description}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Vote Count Badge */}
                <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-xl bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/20">
                  <Vote className="h-3.5 w-3.5 text-primary" />
                  <span>{t('votesCount', '{{count}} Votes', { count: votesCount })}</span>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  aria-label={t('deleteImage')}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 dark:bg-card/90 text-red-500 shadow-md backdrop-blur-sm transition hover:bg-red-500 hover:text-white cursor-pointer"
                >
                  <FaTrash className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Description */}
              <p className="font-['Montserrat'] text-sm font-semibold text-foreground line-clamp-2 leading-relaxed">
                {image.description}
              </p>
            </div>

            {/* Actions Bar: View Details Button */}
            <div className="mt-4 pt-3 border-t border-stroke/50 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-gray-text">
                {t('votesCount', '{{count}} Votes', { count: votesCount })}
              </span>

              <button
                type="button"
                onClick={() => navigate(`/dashboard/trader/designs/${image.id}`)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-3.5 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white cursor-pointer shadow-sm active:scale-95"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>{t('viewVotes', 'View Votes')}</span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function TraderDesignPage() {
  const { t } = useTranslation('traderDesigns')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [touched, setTouched] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])

  const canSubmit = description.trim() !== '' && !!image

  const fetchImages = useCallback(async () => {
    try {
      const res = await api.get('/trader/designs/images')
      if (res.status === 200) {
        setImages(res.data?.data?.images ?? [])
      }
    } catch (error) {
      handleApiError(error, t('loadImagesError'))
    }
  }, [t])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  async function handleSubmit() {
    setTouched(true)
    if (!canSubmit || !image) return
    const formData = new FormData()
    formData.append('description', description.trim())
    formData.append('image', image)
    try {
      const res = await api.post('/trader/designs', formData)
      if (res.status === 200) {
        toast.success(t('uploadSuccess'))
        setDescription('')
        setImage(null)
        setTouched(false)
        fetchImages()
      } else {
        toast.error(t('uploadError'))
      }
    } catch (error) {
      handleApiError(error, t('uploadError'))
    }
  }

  return (
    <div className="space-y-8">
      {/* Add New Design Form Section */}
      <div className="flex flex-col gap-6 rounded-[24px] border border-stroke bg-card p-6 shadow-sm">
        <h2 className="font-['Montserrat'] text-xl font-bold text-foreground sm:text-2xl">
          {t('addNewDesign')}
        </h2>

        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-sm font-medium text-foreground">
            {t('imageLabel', 'Description')} <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter design description..."
            className="w-full rounded-2xl border border-stroke bg-background p-4 font-['Montserrat'] text-sm font-medium text-foreground placeholder:text-gray-text focus:border-primary focus:outline-none resize-none transition"
          />
          {touched && description.trim() === '' && (
            <div className="font-['Montserrat'] text-xs font-medium text-red-500">
              Description is required
            </div>
          )}
        </div>

        <ImageUpload file={image} onChange={setImage} />
        {touched && !image && (
          <div className="-mt-3 font-['Montserrat'] text-xs font-medium text-red-500">
            {t('imageRequired')}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex w-fit items-center justify-center gap-2 self-start rounded-2xl bg-primary px-6 py-3 font-['Montserrat'] text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95 cursor-pointer"
        >
          <FaPlus className="h-4 w-4" />
          <span>{t('addDesignButton')}</span>
        </button>
      </div>

      {/* Existing Designs Grid Section */}
      <div className="space-y-4">
        <h2 className="font-['Montserrat'] text-xl font-bold text-foreground sm:text-2xl">
          {t('imagesHeading', 'Designs & Votes')}
        </h2>
        <ImageGrid
          images={images}
          onDeleted={(id) =>
            setImages((prev) => prev.filter((img) => img.id !== id))
          }
        />
      </div>
    </div>
  )
}
