import { computed } from 'vue'
import { useAuthService } from '../api/authService'
import { getStoredUserAvatar, getStoredUserName, getUserInitials } from '@/utils/auth'

export const useAuth = () => {
  const { login, register, logout, checkSession, token, currentUser, authValidated, isAdmin } =
    useAuthService()

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => {
    token.value
    return currentUser.value?.userName ?? getStoredUserName()
  })
  const userAvatar = computed(() => {
    token.value
    return currentUser.value?.userAvatar ?? getStoredUserAvatar()
  })
  const hasAdminAccess = computed(() => isAdmin.value)
  const avatarInitials = computed(() => getUserInitials(userName.value))

  return {
    login,
    register,
    logout,
    checkSession,
    token,
    currentUser,
    authValidated,
    isAuthenticated,
    isAdmin: hasAdminAccess,
    userName,
    userAvatar,
    avatarInitials,
  }
}
