import { ref, computed } from 'vue'
import type { User } from '../types/user'
import type { AuthResponse } from '@/interfaces/auth'

const TOKEN_KEY = 'auth_token' as const
const USER_ID_KEY = 'auth_user_id' as const

/**
 * Composable for managing authenticated user state and session persistence.
 * Handles storing/retrieving the JWT token and userId from localStorage.
 */
export function useUsers() {
  const currentUserId = ref<string | null>(localStorage.getItem(USER_ID_KEY))
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))

  const isAuthenticated = computed<boolean>(() => token.value !== null)

  /**
   * Persists auth session data after a successful login or registration.
   */
  const setSession = (authResponse: AuthResponse): void => {
    token.value = authResponse.token
    currentUserId.value = authResponse.userId
    localStorage.setItem(TOKEN_KEY, authResponse.token)
    localStorage.setItem(USER_ID_KEY, authResponse.userId)
  }

  /**
   * Clears auth session data on logout.
   */
  const clearSession = (): void => {
    token.value = null
    currentUserId.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
  }

  /**
   * Returns auth headers for use in authenticated API requests.
   */
  const getAuthHeaders = (): Record<string, string> => {
    if (!token.value) return {}
    return { 'auth-token': token.value }
  }

  return {
    currentUserId,
    token,
    isAuthenticated,
    setSession,
    clearSession,
    getAuthHeaders,
  }
}
