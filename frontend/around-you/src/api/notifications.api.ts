import { apiRequest } from '@/api/http'
import type { AppNotification } from '@/types/notification'

function getToken(): string | null {
  return localStorage.getItem('token')
}

export function fetchNotifications(): Promise<AppNotification[]> {
  return apiRequest<AppNotification[]>('/notifications', {
    token: getToken(),
  })
}

export function markNotificationRead(id: string): Promise<AppNotification> {
  return apiRequest<AppNotification>(`/notifications/${encodeURIComponent(id)}/read`, {
    method: 'PATCH',
    token: getToken(),
  })
}

export function markAllNotificationsRead(): Promise<AppNotification[]> {
  return apiRequest<AppNotification[]>('/notifications/read-all', {
    method: 'PATCH',
    token: getToken(),
  })
}

export function deleteAllNotifications(): Promise<unknown> {
  return apiRequest('/notifications', {
    method: 'DELETE',
    token: getToken(),
  })
}
