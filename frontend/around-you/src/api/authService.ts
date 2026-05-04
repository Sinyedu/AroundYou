import { ref } from 'vue'
import type { User } from '@/types/user'
import { hasPermission, hasRole } from '@/utils/accessControl'
import { toAuthenticatedUser } from '@/api/helpers/authMapper'
import { USER_API_URL } from '@/constants/config'

type AuthResponse = {
  token: string
  user: User
}

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const error = (await response.json()) as { message?: string; error?: string }
    return error.message || error.error || fallback
  } catch {
    return fallback
  }
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  const storage = window.localStorage as Storage | undefined
  if (!storage || typeof storage.getItem !== 'function') return null
  return storage.getItem('token')
}

const token = ref<string | null>(getStoredToken())
const currentUser = ref<User | null>(null)
const authValidated = ref(false)
const isAdmin = ref(false)

function syncUserStorage(user: User | null): void {
  if (!user) {
    localStorage.removeItem('userName')
    localStorage.removeItem('userAvatar')
    return
  }

  localStorage.setItem('userName', user.userName)

  if (user.userAvatar) {
    localStorage.setItem('userAvatar', user.userAvatar)
    return
  }

  localStorage.removeItem('userAvatar')
}

export const useAuthService = () => {
  const login = async (identifier: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${USER_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Login failed'))
    }

    const data = await response.json()
    const authenticatedUser = toAuthenticatedUser((data as { user?: unknown }).user)

    if (!(data as { token?: unknown }).token || !authenticatedUser) {
      throw new Error('Invalid API response')
    }

    token.value = (data as { token: string }).token
    currentUser.value = authenticatedUser
    authValidated.value = true
    isAdmin.value =
      hasRole(authenticatedUser.role, 'admin') ||
      hasPermission(authenticatedUser.permissions, 'admin:access')
    localStorage.setItem('token', token.value)
    syncUserStorage(authenticatedUser)

    return { token: token.value, user: authenticatedUser }
  }

  const register = async (
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
  ): Promise<void> => {
    const res = await fetch(`${USER_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, userName, email, password }),
    })

    if (!res.ok) {
      throw new Error(await getErrorMessage(res, 'Registration failed'))
    }
  }

  const logout = () => {
    token.value = null
    currentUser.value = null
    authValidated.value = false
    isAdmin.value = false
    localStorage.removeItem('token')
    syncUserStorage(null)
  }

  const checkSession = async (): Promise<boolean> => {
    if (!token.value) {
      currentUser.value = null
      authValidated.value = false
      isAdmin.value = false
      syncUserStorage(null)
      return false
    }

    const response = await fetch(`${USER_API_URL}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!response.ok) {
      logout()
      return false
    }

    const user = toAuthenticatedUser(await response.json())
    if (!user) {
      logout()
      return false
    }

    currentUser.value = user
    authValidated.value = true
    isAdmin.value = hasRole(user.role, 'admin') || hasPermission(user.permissions, 'admin:access')
    syncUserStorage(currentUser.value)
    return true
  }

  return {
    login,
    register,
    logout,
    checkSession,
    token,
    currentUser,
    authValidated,
    isAdmin,
  }
}
