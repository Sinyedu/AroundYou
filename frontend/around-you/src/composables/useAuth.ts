import { computed } from 'vue'
import { useAuthService } from '../api/authService'
import { getStoredUserAvatar, getStoredUserName, getUserInitials, hasAdminAccess } from '@/utils/auth'

export const useAuth = () => {
  const { login, register, logout, token } = useAuthService()

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => {
    token.value
    return getStoredUserName()
  })
  const isAdmin = computed(() => {
    token.value
    return hasAdminAccess()
  })
  const userAvatar = computed(() => {
    token.value
    return getStoredUserAvatar()
  })
  const avatarInitials = computed(() => getUserInitials(userName.value))

  return {
    login,
    register,
    logout,
    token,
    isAuthenticated,
    isAdmin,
    userName,
    userAvatar,
    avatarInitials,
  }
}
