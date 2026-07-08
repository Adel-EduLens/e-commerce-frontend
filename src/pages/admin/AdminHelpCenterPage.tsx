import { useEffect, useState } from 'react'
import {
  FaChevronDown,
  FaPen,
  FaPlus,
  FaTrash,
  FaYoutube,
} from 'react-icons/fa'
import { api } from '../../lib/axios'
import { toast } from 'sonner'

import { useAdminHelpCenterVideos, useHelpCenterCategories, type HelpCenterCategory } from '../../hooks/queries/helpCenterQuery';
import { useQueryClient } from '@tanstack/react-query';
import { handleApiError } from '../../lib/utils';

function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const idPattern = /^[a-zA-Z0-9_-]{11}$/
  return idPattern.test(trimmed) ? trimmed : null
}

type HelpVideo = {
  id: string
  title: string
  category: string
  youtubeId: string
}

function CategorySelect({
  value,
  onChange,
  categories,
}: {
  value: string | null
  onChange: (value: string) => void
  categories: HelpCenterCategory[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl bg-gray-light p-4"
      >
        <span
          className={`font-['Montserrat'] text-base font-medium ${value ? 'text-foreground' : 'text-gray-text'}`}
        >
          {value ?? 'Select a category'}
        </span>
        <FaChevronDown
          className={`h-4 w-4 text-gray-text transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex max-h-60 w-full flex-col overflow-y-auto rounded-2xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
            {categories.length === 0 ? (
              <div className="px-4 py-3 text-left font-['Montserrat'] text-sm text-gray-text">
                No categories available. Please add one first.
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    onChange(category.name)
                    setOpen(false)
                  }}
                  className={`px-4 py-3 text-left font-['Montserrat'] text-base font-medium hover:bg-gray-light ${value === category.name ? 'text-foreground' : 'text-gray-text'
                    }`}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

function AddVideoForm({
  editingVideo,
  onAdded,
  onCancelEdit,
  categories,
}: {
  editingVideo: HelpVideo | null
  onAdded: () => void
  onCancelEdit: () => void
  categories: HelpCenterCategory[]
}) {
  const [title, setTitle] = useState(editingVideo?.title ?? '')
  const [youtubeInput, setYoutubeInput] = useState(
    editingVideo?.youtubeId ?? ''
  )
  const [category, setCategory] = useState<string | null>(
    editingVideo?.category ?? null
  )
  const [touched, setTouched] = useState(false)

  const youtubeId = extractYoutubeId(youtubeInput)
  const youtubeInputHasError =
    touched && youtubeInput.trim() !== '' && !youtubeId
  const canSubmit = title.trim() !== '' && !!youtubeId && !!category

  async function handleSubmit() {
    setTouched(true)
    if (!canSubmit || !youtubeId || !category) return

    if (editingVideo) {
      try {
        const res = await api.put(
          `/admin/help-center/video/${editingVideo.id}`,
          {
            title: title.trim(),
            category,
            youtubeId,
          }
        )
        if (res.status === 200) {
          toast.success('Video updated successfully')
          onAdded()
          onCancelEdit()
        }
      } catch (error) {
        handleApiError(error, 'Failed to update video');
      }
      return
    }

    try {
      const res = await api.post('/admin/help-center/video', {
        title: title.trim(),
        category,
        youtubeId,
      })
      if (res.status === 201) {
        toast.success('Video added successfully')
        setTitle('')
        setYoutubeInput('')
        setCategory(null)
        setTouched(false)
        onAdded()
      }
    } catch (error) {
      handleApiError(error, 'Failed to add video');
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl ">
      <div className="font-['Montserrat'] text-2xl font-semibold ">
        {editingVideo ? 'Edit video' : 'Add a help video'}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-['Montserrat'] text-sm font-medium ">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. How to track your order"
          className="w-full rounded-2xl bg-gray-light p-4 font-['Montserrat'] text-base font-medium text-foreground placeholder:text-gray-text focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-['Montserrat'] text-sm font-medium ">
          YouTube video code
        </label>
        <div className="flex items-center gap-2 rounded-2xl bg-gray-light p-4">
          <FaYoutube className="h-5 w-5 shrink-0 text-gray-text" />
          <input
            type="text"
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g. dQw4w9WgXcQ"
            className="w-full bg-transparent font-['Montserrat'] text-base font-medium text-foreground placeholder:text-gray-text focus:outline-none"
          />
        </div>
        {youtubeInputHasError && (
          <div className="font-['Montserrat'] text-sm font-medium text-red-500">
            Video codes are 11 characters (letters, numbers, - and _).
          </div>
        )}
        {youtubeId && (
          <div className="mt-2 aspect-video w-full overflow-hidden rounded-2xl">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="Video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-['Montserrat'] text-sm font-medium ">
          Category
        </label>
        <CategorySelect value={category} onChange={setCategory} categories={categories} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex w-fit items-center justify-center gap-2 self-start rounded-2xl bg-primary p-4 font-['Montserrat'] text-base font-semibold text-foreground"
        >
          <FaPlus className="h-4 w-4" />
          {editingVideo ? 'Save changes' : 'Add video'}
        </button>
        {editingVideo && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex w-fit items-center justify-center gap-2 self-start rounded-2xl bg-gray-light p-4 font-['Montserrat'] text-base font-semibold text-foreground"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

function VideoList({
  videos,
  onDelete,
  onEdit,
}: {
  videos: HelpVideo[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (videos.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl bg-background p-10 text-center">
        <div className="font-['Montserrat'] text-base font-medium text-gray-text">
          No videos added yet. Fill in the form to add your first one.
        </div>
      </div>
    )
  }
  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/admin/help-center/video/${id}`)
      if (res.status === 200) {
        toast.success('Video deleted successfully')
        onDelete(id)
      }
    } catch (error) {
      handleApiError(error, 'Failed to delete video');
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex items-center gap-4 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-stroke"
        >
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
            alt=""
            className="h-16 w-28 shrink-0 rounded-lg object-cover"
          />
          <div className="flex flex-1 flex-col gap-1">
            <div className="font-['Montserrat'] text-lg font-semibold text-foreground">
              {video.title}
            </div>
            <div className="w-fit rounded-full bg-gray-light px-3 py-1 font-['Montserrat'] text-sm font-medium text-gray-text">
              {video.category}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(video.id)}
              aria-label="Edit video"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-light text-foreground hover:bg-stroke"
            >
              <FaPen className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(video.id)}
              aria-label="Delete video"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-light text-red-500 hover:bg-red-100"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AddHelpVideoPage() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const queryClient = useQueryClient();
  const { data: videos = [] } = useAdminHelpCenterVideos();
  const { data: categories = [] } = useHelpCenterCategories();

  const [newCategoryName, setNewCategoryName] = useState('')

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    try {
      const res = await api.post('/admin/help-center/category', {
        name: newCategoryName.trim(),
      })
      if (res.status === 201) {
        toast.success('Category added successfully')
        setNewCategoryName('')
        queryClient.invalidateQueries({ queryKey: ['help-center', 'admin', 'categories'] })
      }
    } catch (error) {
      handleApiError(error, 'Failed to add category');
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await api.delete(`/admin/help-center/category/${id}`)
      if (res.status === 200) {
        toast.success('Category deleted successfully')
        queryClient.invalidateQueries({ queryKey: ['help-center', 'admin', 'categories'] })
      }
    } catch (error) {
      handleApiError(error, 'Failed to delete category');
    }
  }

  const handelFetchVideos = () => {
    queryClient.invalidateQueries({ queryKey: ['help-center', 'admin'] });
  };

  const editingVideo = videos.find((v) => v.id === editingId) ?? null

  return (
    <div className="flex w-full flex-col gap-10 px-6 py-10">
      <div className="font-['Montserrat'] text-3xl font-bold ">
        Help Center Videos
      </div>

      <AddVideoForm
        key={editingId ?? 'new'}
        editingVideo={editingVideo}
        onAdded={handelFetchVideos}
        onCancelEdit={() => setEditingId(null)}
        categories={categories}
      />

      <div className="flex w-full flex-col gap-6 rounded-2xl ">
        <div className="font-['Montserrat'] text-2xl font-semibold ">
          Manage Categories
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New Category Name"
            className="flex-1 rounded-2xl bg-gray-light p-4 font-['Montserrat'] text-base font-medium text-foreground placeholder:text-gray-text focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-['Montserrat'] text-base font-semibold text-foreground"
          >
            <FaPlus className="h-4 w-4" />
            Add
          </button>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 rounded-full bg-gray-light py-2 pl-4 pr-2 outline outline-1 outline-offset-[-1px] outline-stroke"
              >
                <span className="font-['Montserrat'] text-sm font-medium text-foreground">
                  {cat.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-text hover:bg-stroke hover:text-red-500"
                >
                  <FaTrash className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="font-['Montserrat'] text-2xl font-semibold text-foreground">
          Videos
        </div>
        <VideoList
          videos={videos}
          onEdit={(id) => setEditingId(id)}
          onDelete={(id) => {
            queryClient.invalidateQueries({ queryKey: ['help-center', 'admin'] })
            if (editingId === id) setEditingId(null)
          }}
        />
      </div>
    </div>
  )
}
