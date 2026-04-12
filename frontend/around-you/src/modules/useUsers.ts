import { ref } from 'vue'

const apiUrl = 'http://localhost:4000/api/user'

export function useUser() {
  const token = ref<string | null>(localStorage.getItem('authToken') || null)

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

  return {
    login,
    register,
    logout,
    isAuthenticated,
    token,
  }
}
