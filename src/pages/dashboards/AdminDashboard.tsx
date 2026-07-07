import {
  Ban,
  CheckCircle,
  MessageCircleQuestion,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../../lib/axios'
import useFAQManagment from '../../hooks/useFAQManagment'
import type { User } from '../../types/auth'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [faqQuestion, setFaqQuestion] = useState('')
  const [faqAnswer, setFaqAnswer] = useState('')
  const [faqs, setFaqs] = useState<
    Array<{ id: number; question: string; answer: string; createdAt: string }>
  >([])
  const {
    faqLoading,
    setFaqLoading,
    editingFaqId,
    setEditingFaqId,
    editingFaqQuestion,
    setEditingFaqQuestion,
    editingFaqAnswer,
    setEditingFaqAnswer,
    isSavingFaq,
    setIsSavingFaq,
    deletingFaqId,
    setDeletingFaqId,
    expandedFaqId,
    setExpandedFaqId,
  } = useFAQManagment()
  const fetchFaqs = async () => {
    setFaqLoading(true)
    try {
      const response = await api.get('/admin/faqs/questions')
      setFaqs(response?.data?.data || [])
    } catch (error) {
      console.error('Failed to fetch FAQs:', error)
      toast.error('Unable to load questions')
    } finally {
      setFaqLoading(false)
    }
  }
  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response?.data?.data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Unable to load users')
    }
  }

  const handleChangeStatus = async (
    userId: string,
    newStatus: 'active' | 'suspended'
  ) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, {
        status: newStatus,
      })
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === userId ? { ...u, status: newStatus } : u
          )
        )
        toast.success(`User status updated to ${newStatus}`)
      } else {
        toast.error('Failed to update user status')
      }
    } catch (error) {
      toast.error('Unable to update user status')
    }
  }

  useEffect(() => {
    fetchFaqs()
    fetchAllUsers()
  }, [])

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      toast.error('Please provide both a question and an answer')
      return
    }

    setIsSavingFaq(true)

    try {
      const response = await api.post('/admin/faqs/questions', {
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
      })

      const createdFaq = response?.data?.data
      if (createdFaq) {
        setFaqs((prev) => [createdFaq, ...prev])
      }

      setFaqQuestion('')
      setFaqAnswer('')
      toast.success(response?.data?.message || 'Question added successfully')
    } catch (error: any) {
      const data = error?.response?.data
      if (data?.errors) {
        const firstErrorKey = Object.keys(data.errors)[0]
        toast.error(data.errors[firstErrorKey][0])
      } else {
        toast.error(data?.message || 'Unable to add question')
      }
    } finally {
      setIsSavingFaq(false)
    }
  }

  const handleDeleteFaq = async (id: number) => {
    setDeletingFaqId(id)

    try {
      await api.delete(`/admin/faqs/questions/${id}`)
      setFaqs((prev) => prev.filter((faq) => faq.id !== id))
      setExpandedFaqId((prev) => (prev === id ? null : prev))
      toast.success('Question removed successfully')
    } catch (error) {
      console.error('Failed to delete FAQ:', error)
      toast.error('Unable to delete question')
    } finally {
      setDeletingFaqId(null)
    }
  }

  const startEditingFaq = (faq: {
    id: number
    question: string
    answer: string
  }) => {
    setEditingFaqId(faq.id)
    setEditingFaqQuestion(faq.question)
    setEditingFaqAnswer(faq.answer)
    setExpandedFaqId(faq.id)
  }

  const cancelEditingFaq = () => {
    setEditingFaqId(null)
    setEditingFaqQuestion('')
    setEditingFaqAnswer('')
  }

  const handleUpdateFaq = async (id: number) => {
    if (!editingFaqQuestion.trim() || !editingFaqAnswer.trim()) {
      toast.error('Please provide both a question and an answer')
      return
    }

    setIsSavingFaq(true)

    try {
      const response = await api.put(`/admin/faqs/questions/${id}`, {
        question: editingFaqQuestion.trim(),
        answer: editingFaqAnswer.trim(),
      })

      const updatedFaq = response?.data?.data
      if (updatedFaq) {
        setFaqs((prev) =>
          prev.map((faq) =>
            faq.id === id
              ? {
                  ...faq,
                  question: updatedFaq.question,
                  answer: updatedFaq.answer,
                }
              : faq
          )
        )
      }

      toast.success(response?.data?.message || 'Question updated successfully')
      cancelEditingFaq()
    } catch (error: any) {
      const data = error?.response?.data
      if (data?.errors) {
        const firstErrorKey = Object.keys(data.errors)[0]
        toast.error(data.errors[firstErrorKey][0])
      } else {
        toast.error(data?.message || 'Unable to update question')
      }
    } finally {
      setIsSavingFaq(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex">
      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold font-['Montserrat']">
              System Dashboard
            </h1>
            <p className="text-gray-text text-sm mt-1">
              Platform overview and user privilege logs
            </p>
          </div>

          <Link
            to="/"
            className="px-5 py-2.5 bg-white text-dark-background hover:bg-lime-300
          font-semibold rounded-xl text-sm transition-all"
          >
            Back to Storefront
          </Link>
        </header>

        <section className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold font-['Montserrat'] flex items-center gap-2">
                <MessageCircleQuestion size={18} className="text-lime-300" />
                FAQ Management
              </h3>
              <p className="text-sm text-gray-text mt-1">
                Add, edit, and remove frequently asked questions.
              </p>
            </div>
            <span className="px-3 py-1 bg-neutral-800 text-gray-text rounded-full text-xs font-semibold">
              Admin Content
            </span>
          </div>

          <form onSubmit={handleCreateFaq} className="grid gap-4 mb-6">
            <div className="grid gap-2">
              <label
                htmlFor="faq-question"
                className="text-sm font-medium text-white"
              >
                Question
              </label>
              <input
                id="faq-question"
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
                placeholder="Enter a frequently asked question"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-400"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="faq-answer"
                className="text-sm font-medium text-white"
              >
                Answer
              </label>
              <textarea
                id="faq-answer"
                rows={4}
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
                placeholder="Write a clear answer"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-400"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingFaq}
                className="rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-dark-background transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingFaq ? 'Saving…' : 'Add FAQ'}
              </button>
            </div>
          </form>

          <div className="border-t border-neutral-800 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Questions</h4>
              <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-gray-text">
                {faqs.length} saved
              </span>
            </div>

            {faqLoading ? (
              <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/50 p-6 text-sm text-gray-text">
                Loading questions...
              </div>
            ) : faqs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/50 p-6 text-sm text-gray-text">
                No questions added yet.
              </div>
            ) : (
              <ul className="space-y-3">
                {faqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id
                  const isEditing = editingFaqId === faq.id

                  return (
                    <li
                      key={faq.id}
                      className="rounded-2xl border border-neutral-800 bg-neutral-950/70 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          aria-expanded={expandedFaqId === faq.id}
                          onClick={() =>
                            setExpandedFaqId((prev) =>
                              prev === faq.id ? null : faq.id
                            )
                          }
                          className="flex-1 text-left"
                        >
                          <p className="font-semibold text-white">
                            {faq.question}
                          </p>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label="Edit question"
                            onClick={() => startEditingFaq(faq)}
                            className="rounded-lg p-2 text-gray-text transition hover:bg-lime-400/10 hover:text-lime-300"
                            title="Edit question"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Are you sure you want to delete this FAQ?'
                                )
                              ) {
                                handleDeleteFaq(faq.id)
                              }
                            }}
                            disabled={deletingFaqId === faq.id}
                            className="rounded-lg p-2 text-gray-text transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                            title="Delete question"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/80 p-3 text-sm text-gray-text">
                          {isEditing ? (
                            <div className="grid gap-3">
                              <input
                                value={editingFaqQuestion}
                                onChange={(e) =>
                                  setEditingFaqQuestion(e.target.value)
                                }
                                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2 text-sm text-white outline-none transition focus:border-lime-400"
                              />
                              <textarea
                                rows={4}
                                value={editingFaqAnswer}
                                onChange={(e) =>
                                  setEditingFaqAnswer(e.target.value)
                                }
                                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2 text-sm text-white outline-none transition focus:border-lime-400"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={cancelEditingFaq}
                                  className="rounded-lg border border-neutral-700 px-3 py-2 text-sm font-medium text-gray-text transition hover:text-lime-300"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateFaq(faq.id)}
                                  disabled={isSavingFaq}
                                  className="rounded-lg bg-lime-400 px-3 py-2 text-sm font-semibold text-dark-background transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isSavingFaq ? 'Saving…' : 'Save'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="whitespace-pre-line">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>

        {/* User Management Section */}
        <section className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold font-['Montserrat']">
              User Registration Directory
            </h3>
            <span className="px-3 py-1 bg-neutral-800 text-gray-text rounded-full text-xs font-semibold">
              Live Platform Users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-gray-text text-xs uppercase font-semibold">
                  <th className="py-4 px-2">Name / Email</th>
                  <th className="py-4 px-2">Role</th>
                  <th className="py-4 px-2">Joined Date</th>
                  <th className="py-4 px-2">Status</th>
                  <th className="py-4 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50 text-sm">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-neutral-900/20 transition-all"
                  >
                    <td className="py-4 px-2">
                      <div>
                        <p className="font-semibold text-white">{u.name}</p>
                        <p className="text-xs text-gray-text">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : u.role === 'trader'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-gray-text">{u.createdAt}</td>
                    <td className="py-4 px-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'active'
                              ? 'bg-emerald-400'
                              : 'bg-red-400'
                          }`}
                        />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleChangeStatus(
                              u.id,
                              u.status === 'active' ? 'suspended' : 'active'
                            )
                          }
                          className={`p-1.5 bg-neutral-800 rounded-lg transition-all ${
                            u.status === 'active'
                              ? 'hover:bg-red-500/20 text-gray-text hover:text-red-400'
                              : 'hover:bg-emerald-500/20 text-gray-text hover:text-emerald-400'
                          }`}
                          title={
                            u.status === 'active'
                              ? 'Suspend Account'
                              : 'Activate Account'
                          }
                        >
                          {u.status === 'active' ? (
                            <Ban size={16} />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
