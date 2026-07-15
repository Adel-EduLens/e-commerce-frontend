import { useEffect, useRef, useState } from 'react'
import { FaImage, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { api } from '../../lib/axios'
import { toast } from 'sonner'
import { handleApiError } from '../../lib/utils';

type UploadedImage = {
  id: string
  title: string
  imagePath: string
}

function ImageUpload({
  file,
  onChange,
}: {
  file: File | null
  onChange: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrl = file ? URL.createObjectURL(file) : null

  return (
    <div className="flex flex-col gap-2">
      <label className="font-['Montserrat'] text-sm font-medium ">Image</label>

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
            aria-label="Remove image"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-2xl bg-gray-light p-4"
        >
          <FaImage className="h-8 w-8 text-gray-text" />
          <div className="font-['Montserrat'] text-base font-medium text-gray-text">
            Click to upload an image
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
  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/trader/designs/${id}`)
      if (res.status === 200) {
        toast.success('Image deleted successfully')
        onDeleted(id)
      }
    } catch (error) {
      handleApiError(error, 'Failed to delete image');
    }
  }

  if (images.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl bg-background p-10 text-center">
        <div className="font-['Montserrat'] text-base font-medium text-gray-text">
          No images added yet.
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative flex flex-col gap-3 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-stroke"
        >
          <div className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-light">
            <img
              src={image.imagePath}
              alt={image.title}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleDelete(image.id)}
              aria-label="Delete image"
              className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] hover:bg-red-100"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
          <div className="font-['Montserrat'] text-lg font-semibold text-foreground">
            {image.title}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TraderDesignPage() {
  const [title, setTitle] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [touched, setTouched] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])

  const canSubmit = title.trim() !== '' && !!image

  const fetchImages = async () => {
    try {
      const res = await api.get('/trader/designs/images')
      if (res.status === 200) {
        setImages(res.data?.data?.images ?? [])
      }
    } catch (error) {
      handleApiError(error, 'Failed to load images');
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  async function handleSubmit() {
    setTouched(true)
    if (!canSubmit || !image) return
    const formData = new FormData()
    formData.append('title', title)
    formData.append('image', image)
    try {
      const res = await api.post('/trader/designs', formData)
      if (res.status === 200) {
        toast.success('Image uploaded successfully')
        setTitle('')
        setImage(null)
        setTouched(false)
        fetchImages()
      } else {
        toast.error('Failed to upload image')
      }
    } catch (error) {
      handleApiError(error, 'Failed to upload image');
    }
  }

  return (
    <div className="flex w-full flex-col gap-10 px-6 py-10">
      <div className="flex w-full flex-col gap-6 rounded-2xl p-6">
        <div className="font-['Montserrat'] text-2xl font-semibold ">
          Add New Design
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-sm font-medium ">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Men"
            className="w-full rounded-2xl bg-gray-light p-4 font-['Montserrat'] text-base font-medium text-foreground placeholder:text-gray-text focus:outline-none"
          />
          {touched && title.trim() === '' && (
            <div className="font-['Montserrat'] text-sm font-medium text-red-500">
              Title is required.
            </div>
          )}
        </div>

        <ImageUpload file={image} onChange={setImage} />
        {touched && !image && (
          <div className="-mt-4 font-['Montserrat'] text-sm font-medium text-red-500">
            Please upload an image.
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex w-fit items-center justify-center gap-2 self-start rounded-2xl bg-primary p-4 font-['Montserrat'] text-base font-semibold text-foreground"
        >
          <FaPlus className="h-4 w-4" />
          Add design
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="font-['Montserrat'] text-2xl font-semibold text-foreground">
          Images
        </div>
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
