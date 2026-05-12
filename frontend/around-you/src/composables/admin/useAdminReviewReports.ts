import { onMounted, ref, watch } from 'vue'

import {
  deleteReportedReview,
  fetchReportedReviews,
  resolveReviewReport,
  restoreReportedReview,
} from '@/api/admin.api'
import type { ReportedReview } from '@/types/admin'
import {
  adminReviewReportTabs,
  getReviewRemovalReason,
  type AdminReviewReportTabKey,
} from './adminReviewReports.helpers'

export function useAdminReviewReports() {
  const reports = ref<ReportedReview[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const activeReportTab = ref<AdminReviewReportTabKey>('active')

  async function loadReports(): Promise<void> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      reports.value = await fetchReportedReviews(activeReportTab.value)
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Kunne ikke hente anmeldelsesrapporter.'
    } finally {
      isLoading.value = false
    }
  }

  async function resolveReport(id: string): Promise<void> {
    errorMessage.value = ''

    try {
      await resolveReviewReport(id)
      reports.value = reports.value.filter((review) => review._id !== id)
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Kunne ikke markere rapporten som løst.'
    }
  }

  async function removeReview(id: string): Promise<void> {
    const ruleBroken = getReviewRemovalReason()
    if (!ruleBroken) return

    errorMessage.value = ''

    try {
      await deleteReportedReview(id, ruleBroken)
      reports.value = reports.value.filter((review) => review._id !== id)
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke skjule anmeldelsen.'
    }
  }

  async function restoreReview(id: string): Promise<void> {
    errorMessage.value = ''

    try {
      await restoreReportedReview(id)
      reports.value = reports.value.filter((review) => review._id !== id)
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Kunne ikke gendanne anmeldelsen.'
    }
  }

  watch(activeReportTab, () => {
    void loadReports()
  })

  onMounted(() => {
    void loadReports()
  })

  return {
    activeReportTab,
    errorMessage,
    isLoading,
    loadReports,
    removeReview,
    reportTabs: adminReviewReportTabs,
    reports,
    resolveReport,
    restoreReview,
  }
}
