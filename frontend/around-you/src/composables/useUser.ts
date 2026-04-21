import { ref } from 'vue'
import { getUserProfile, updateUserProfile, type User } from '@/api/user'

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export const useUser = () => {
  const fetchUser = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      error.value = 'No token found'
      return
    }

    loading.value = true
    error.value = null

    try {
      user.value = await getUserProfile(token)
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const updateUser = async () => {
    const token = localStorage.getItem('token')

    if (!token || !user.value) return

    loading.value = true
    error.value = null

    try {
      user.value = await updateUserProfile(token, user.value)
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    fetchUser,
    updateUser,
  }
}
