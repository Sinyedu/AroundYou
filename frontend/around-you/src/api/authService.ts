import { ref } from 'vue'

const apiUrl = 'http://localhost:4000/api/user'

export const useAuthService = () => {
  const token = ref<string | null>(localStorage.getItem('authToken') || null)

  const login = async (email: string, password: string): Promise<void> => {
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
    } catch (error) {
      throw error
    }
  }

  const register = async (
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, userName, email, password }),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = (): void => {
    token.value = null
    localStorage.removeItem('authToken')
  }

  return {
    login,
    register,
    logout,
    token,
  }
}
