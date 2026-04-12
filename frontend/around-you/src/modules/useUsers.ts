import { ref } from 'vue'

const apiUrl = 'http://localhost:4000/api/register'

export function useUser() {
  const token = ref<string | null>(null)

  async function login(email: string, password: string) {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      token.value = data.token
      if (token.value) {
        localStorage.setItem('authToken', token.value)
      }
      return data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const response = await fetch(`${apiUrl}/register`, {
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
    localStorage.removeItem('authToken')
  }

  function isAuthenticated() {
    return !!token.value
  }

  async function getUserInfo() {
    try {
      const response = await fetch(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })

      if (!response.ok) {
        throw new Error('Failed to get user info')
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get user info:', error)
      throw error
    }
  }

  return {
    login,
    register,
    logout,
    isAuthenticated,
    getUserInfo,
    token,
  }
}
