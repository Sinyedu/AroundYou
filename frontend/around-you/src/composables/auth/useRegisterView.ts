import { ref } from 'vue'

import { useAuth } from '@/composables/useAuth'

export function useRegisterView() {
  const { register } = useAuth()

  const firstName = ref('')
  const lastName = ref('')
  const userName = ref('')
  const email = ref('')
  const password = ref('')
  const message = ref('')
  const isSuccess = ref(false)
  const isSubmitting = ref(false)

  const handleRegister = async () => {
    if (!firstName.value || !lastName.value || !userName.value || !email.value || !password.value) {
      return
    }

    try {
      isSubmitting.value = true
      message.value = ''
      isSuccess.value = false

      await register(firstName.value, lastName.value, userName.value, email.value, password.value)

      isSuccess.value = true
      message.value = 'Din konto er oprettet. Du kan logge ind nu.'
    } catch (error) {
      isSuccess.value = false
      message.value = error instanceof Error ? error.message : 'Registration failed.'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    email,
    firstName,
    handleRegister,
    isSubmitting,
    isSuccess,
    lastName,
    message,
    password,
    userName,
  }
}
