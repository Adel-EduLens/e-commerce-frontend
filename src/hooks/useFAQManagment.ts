import React, { useState } from 'react'

const useFAQManagment = () => {
  const [faqLoading, setFaqLoading] = useState(false)
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null)
  const [editingFaqQuestion, setEditingFaqQuestion] = useState('')
  const [editingFaqAnswer, setEditingFaqAnswer] = useState('')
  const [isSavingFaq, setIsSavingFaq] = useState(false)
  const [deletingFaqId, setDeletingFaqId] = useState<number | null>(null)
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null)
  return {
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
  }
}

export default useFAQManagment
