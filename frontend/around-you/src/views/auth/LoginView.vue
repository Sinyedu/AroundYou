<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

      <form class="space-y-4" @submit.prevent="submitForm" novalidate>
        <!-- Email -->
        <div>
          <label for="email" class="block text-gray-700 font-medium mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="email"
            @blur="touched.email = true"
            placeholder="example@email.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            :class="{ 'border-red-400': touched.email && !validEmail }"
          />
          <p v-if="touched.email && !email" class="text-red-500 text-sm mt-1">Email is required</p>
          <p v-else-if="touched.email && !validEmail" class="text-red-500 text-sm mt-1">
            Invalid email address
          </p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            @blur="touched.password = true"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            :class="{ 'border-red-400': touched.password && !password }"
          />
          <p v-if="touched.password && !password" class="text-red-500 text-sm mt-1">
            Password is required
          </p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Logging in…' : 'Login' }}
        </button>

        <!-- API error / success -->
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
        <p v-if="successMessage" class="text-green-500 text-sm text-center">{{ successMessage }}</p>

        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <RouterLink to="/forgot-password" class="text-indigo-600 hover:underline">
            Forgot Password?
          </RouterLink>
          <RouterLink to="/auth/register" class="text-indigo-600 hover:underline">
            Create Account
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUsers } from '@/modules/useUsers'

const router = useRouter()

const email = ref<string>('')
const password = ref<string>('')
const successMessage = ref<string | null>(null)

const touched = reactive<Record<'email' | 'password', boolean>>({
  email: false,
  password: false,
})

const { login, loading, error } = useAuth()
const { setSession } = useUsers()

const validEmail = computed<boolean>(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const submitForm = async (): Promise<void> => {
  touched.email = true
  touched.password = true
  successMessage.value = null

  if (!email.value || !password.value || !validEmail.value) return

  try {
    const response = await login({
      email: email.value,
      password: password.value,
    })

    setSession(response)

    successMessage.value = 'Login successful'

    email.value = ''
    password.value = ''
    touched.email = false
    touched.password = false

    await router.push('/')
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Login error:', err.message)
    }
  }
}
</script>

<style scoped></style>
