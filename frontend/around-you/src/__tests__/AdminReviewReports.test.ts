import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AdminReviewReports from '@/components/admin/AdminReviewReports.vue'
import type { ReportedReview } from '@/types/admin'

const mocks = vi.hoisted(() => ({
  deleteReportedReview: vi.fn(),
  fetchReportedReviews: vi.fn(),
  resolveReviewReport: vi.fn(),
  restoreReportedReview: vi.fn(),
}))

vi.mock('@/api/admin.api', () => ({
  deleteReportedReview: mocks.deleteReportedReview,
  fetchReportedReviews: mocks.fetchReportedReviews,
  resolveReviewReport: mocks.resolveReviewReport,
  restoreReportedReview: mocks.restoreReportedReview,
}))

const reportedReview: ReportedReview = {
  _id: 'review-1',
  targetId: 'city-1',
  targetType: 'city',
  author: 'review-author',
  title: 'Rapporteret review',
  description: 'Denne anmeldelse skal kunne ses af admin.',
  rating: 2,
  likes: 0,
  likedBy: [],
  edited: false,
  image: '',
  createdAt: '2026-05-08T08:00:00.000Z',
  reportCount: 1,
  reports: [
    {
      reportedBy: 'user-1',
      reason: 'spam: Reklameindhold',
      createdAt: '2026-05-08T08:30:00.000Z',
    },
  ],
  reportResolved: false,
}

describe('AdminReviewReports', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.fetchReportedReviews.mockResolvedValue([reportedReview])
  })

  it('loads and displays reported reviews for admins', async () => {
    const wrapper = mount(AdminReviewReports)

    await vi.waitFor(() => {
      expect(mocks.fetchReportedReviews).toHaveBeenCalledWith('active')
      expect(wrapper.text()).toContain('Rapporteret review')
    })

    expect(wrapper.text()).toContain('1 rapporter')
    expect(wrapper.text()).toContain('spam: Reklameindhold')

    wrapper.unmount()
  })
})
