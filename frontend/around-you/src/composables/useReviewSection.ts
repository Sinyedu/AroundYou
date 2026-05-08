import { computed, ref, watch, type Ref } from 'vue'
import { getStoredUserId } from '@/utils/auth'
import {
  createReview,
  getReviewsByTarget,
  likeReview,
  updateReview,
  type ReviewItem,
  type ReviewTargetType,
} from '@/api/reviews.api'

export type ReviewFormState = {
  title: string
  description: string
  rating: number
  image: string
}

export type EditReviewFormState = {
  title: string
  description: string
  rating: number
  image: string
}

export type ReportFormState = {
  reason: string
  details: string
}

export function useReviewSection(options: {
  targetId: Ref<string>
  targetType: Ref<ReviewTargetType>
  userName: Ref<string>
}) {
  const { targetId, targetType, userName } = options

  const reviews = ref<ReviewItem[]>([])
  const loading = ref(false)
  const fetchError = ref<string | null>(null)

  const form = ref<ReviewFormState>({ title: '', description: '', rating: 0, image: '' })
  const submitting = ref(false)
  const submitError = ref<string | null>(null)

  const likeLoading = ref<string | null>(null)

  const editingId = ref<string | null>(null)
  const editForm = ref<EditReviewFormState>({ title: '', description: '', rating: 0, image: '' })
  const editSaving = ref(false)
  const editError = ref<string | null>(null)

  const reportModalOpen = ref(false)
  const reportTargetReview = ref<ReviewItem | null>(null)
  const reportForm = ref<ReportFormState>({ reason: '', details: '' })
  const reportError = ref<string | null>(null)
  const reportedReviewIds = ref<string[]>([])

  const averageRating = computed(() => {
    if (reviews.value.length === 0) return null
    const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
    return sum / reviews.value.length
  })

  function startEdit(review: ReviewItem) {
    editingId.value = review._id
    editForm.value = {
      title: review.title,
      description: review.description,
      rating: review.rating,
      image: review.image ?? '',
    }
    editError.value = null
  }

  function cancelEdit() {
    editingId.value = null
    editError.value = null
  }

  function isReviewReported(reviewId: string): boolean {
    return reportedReviewIds.value.includes(reviewId)
  }

  function openReportModal(review: ReviewItem) {
    if (isReviewReported(review._id)) return
    reportTargetReview.value = review
    reportForm.value = { reason: '', details: '' }
    reportError.value = null
    reportModalOpen.value = true
  }

  function closeReportModal() {
    reportModalOpen.value = false
    reportTargetReview.value = null
    reportError.value = null
  }

  function submitReport() {
    if (!reportTargetReview.value) return
    if (!reportForm.value.reason) {
      reportError.value = 'Vælg en årsag for anmeldelsen.'
      return
    }
    if (!reportedReviewIds.value.includes(reportTargetReview.value._id)) {
      reportedReviewIds.value.push(reportTargetReview.value._id)
    }
    closeReportModal()
  }

  async function saveEdit(reviewId: string) {
    editSaving.value = true
    editError.value = null
    try {
      const updated = await updateReview(reviewId, {
        title: editForm.value.title,
        description: editForm.value.description,
        rating: editForm.value.rating,
        image: editForm.value.image || undefined,
      })
      const index = reviews.value.findIndex((review) => review._id === reviewId)
      if (index !== -1) reviews.value[index] = updated
      editingId.value = null
    } catch (err) {
      editError.value = err instanceof Error ? err.message : 'Noget gik galt.'
    } finally {
      editSaving.value = false
    }
  }

  async function loadReviews() {
    loading.value = true
    fetchError.value = null
    try {
      reviews.value = await getReviewsByTarget(targetId.value)
    } catch {
      fetchError.value = 'Kunne ikke hente anmeldelser.'
    } finally {
      loading.value = false
    }
  }

  async function submitReview() {
    if (form.value.rating === 0) return
    submitting.value = true
    submitError.value = null
    try {
      const created = await createReview({
        targetId: targetId.value,
        targetType: targetType.value,
        author: userName.value,
        title: form.value.title,
        description: form.value.description,
        rating: form.value.rating,
        image: form.value.image || undefined,
      })
      reviews.value.unshift(created)
      form.value = { title: '', description: '', rating: 0, image: '' }
    } catch (err) {
      submitError.value = err instanceof Error ? err.message : 'Noget gik galt.'
    } finally {
      submitting.value = false
    }
  }

  function hasLiked(review: ReviewItem): boolean {
    const userId = getStoredUserId()
    return !!userId && review.likedBy.includes(userId)
  }

  async function toggleLike(review: ReviewItem) {
    const userId = getStoredUserId()
    if (!userId || likeLoading.value) return
    likeLoading.value = review._id
    try {
      const updated = await likeReview(review._id, userId)
      const index = reviews.value.findIndex((entry) => entry._id === review._id)
      if (index !== -1) reviews.value[index] = updated
    } finally {
      likeLoading.value = null
    }
  }

  watch(targetId, () => {
    void loadReviews()
  }, { immediate: true })

  return {
    reviews,
    loading,
    fetchError,
    averageRating,
    form,
    submitting,
    submitError,
    likeLoading,
    editingId,
    editForm,
    editSaving,
    editError,
    reportModalOpen,
    reportTargetReview,
    reportForm,
    reportError,
    startEdit,
    cancelEdit,
    isReviewReported,
    openReportModal,
    closeReportModal,
    submitReport,
    saveEdit,
    submitReview,
    hasLiked,
    toggleLike,
  }
}
