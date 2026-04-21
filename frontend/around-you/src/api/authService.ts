import { ref } from 'vue'
import { getJwtPayload, payloadHasAdminAccess } from '@/utils/auth'

const apiUrl = 'http://localhost:4000/api/user'

type AuthResponse = {
  token: string
  user: {
    id: string
    userName: string
    email: string
    userAvatar?: string
  }
}

const token = ref<string | null>(localStorage.getItem('token'))

export const useAuthService = () => {
  const login = async (identifier: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data = await response.json()

    if (!data?.token || !data?.user?.userName) {
      throw new Error('Invalid API response')
    }

    const payload = getJwtPayload(data.token)
    const isAdmin = payloadHasAdminAccess(payload)

    token.value = data.token
    localStorage.setItem('token', data.token)
    localStorage.setItem('userName', data.user.userName)

    if (data.user.userAvatar) {
      localStorage.setItem('userAvatar', data.user.userAvatar)
    } else {
      localStorage.removeItem('userAvatar')
    }

    return data
  }

  const register = async (
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
  ): Promise<void> => {
    const res = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, userName, email, password }),
    })

    if (!res.ok) throw new Error('Registration failed')
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userAvatar')
  }

  return {
    login,
    register,
    logout,
    token,
  }
}
