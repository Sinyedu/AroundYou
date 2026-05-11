export type NotificationType =
  | 'review_removed'
  | 'review_report_action_taken'
  | 'review_report_no_action'

export type AppNotification = {
  _id: string
  recipientUserId: string
  type: NotificationType
  title: string
  message: string
  link?: string
  reviewId?: string
  readAt?: string
  createdAt: string
}
