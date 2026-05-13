import { ref } from 'vue'
import { USER_API_URL } from '@/constants/config'

export function useUser() {
  const token = ref<string | null>(null)

  async function login(email: string, password: string) {
    try {
      const response = await fetch(`${USER_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      token.value = data.token
      return data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const response = await fetch(`${USER_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  function logout() {
    token.value = null
  }

  function isAuthenticated() {
    return !!token.value
  }

  return {
    login,
    register,
    logout,
    isAuthenticated,
    token,
  }
}
