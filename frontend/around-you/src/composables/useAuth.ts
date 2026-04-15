import { computed } from 'vue'
import { useAuthService } from '../api/authService'

export const useAuth = () => {
  const { login, register, logout, token } = useAuthService()

  const isAuthenticated = computed(() => !!token.value)

  const userName = computed(() => localStorage.getItem('userName'))

  return {
    login,
    register,
    logout,
    token,
    isAuthenticated,
    userName,
  }
}
