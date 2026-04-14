import { ref } from 'vue'

const apiUrl = 'http://localhost:4000/api/user'

type AuthResponse = {
  token: string
}

export const useAuthService = () => {
  const token = ref<string | null>(localStorage.getItem('authToken'))

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Backend error:', errorData)
      throw new Error(errorData.message || 'Login failed')
    }

    const data: AuthResponse = await response.json()

    token.value = data.token
    localStorage.setItem('authToken', data.token)

    return data
  }

  const register = async (
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
  ): Promise<void> => {
    const response = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, userName, email, password }),
    })

    if (!response.ok) {
      throw new Error('Registration failed')
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
