import { ref } from 'vue'
import { registerUser, loginUser } from '@/api/authService'
import type { RegisterUser, LoginUser, AuthResponse } from '@/interfaces/auth'

export function useAuth() {
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const register = async (data: RegisterUser): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await registerUser(data)
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (data: LoginUser): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await loginUser(data)
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    register,
    login,
  }
}
