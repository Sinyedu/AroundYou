//TODO: JUST A PLACEHOLDER FOR NOW, THIS FILE IS MEANT TO BE USED FOR AUTHENTICATION RELATED COMPOSABLES IN THE FUTURE.
import { ref } from "vue"
import { registerUser, loginUser } from "@/api/authService"
import type { RegisterUser, LoginUser } from "@/interfaces/auth"

export function useAuth() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const register = async (data: RegisterUser) => {
    loading.value = true
    error.value = null

    try {
      const response = await registerUser(data)
      return response
    } catch (err: any) {
      error.value = err.message || "Registration failed"
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (data: LoginUser) => {
    loading.value = true
    error.value = null

    try {
      const response = await loginUser(data)
      return response
    } catch (err: any) {
      error.value = err.message || "Login failed"
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    register,
    login
  }
}
