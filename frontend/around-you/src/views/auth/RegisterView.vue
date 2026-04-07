<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

      <form class="space-y-4" @submit.prevent="submitForm" novalidate>
        <div>
          <label for="firstName" class="block text-gray-700 font-medium mb-1">First Name</label>
          <input
            type="text"
            id="firstName"
            v-model="firstName"
            @blur="touched.firstName = true"
            placeholder="John"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            :class="{ 'border-red-400': touched.firstName && !validFirstName }"
          />
          <p v-if="touched.firstName && !firstName" class="text-red-500 text-sm mt-1">
            First name is required
          </p>
          <p
            v-else-if="touched.firstName && firstName.length < 2"
            class="text-red-500 text-sm mt-1"
          >
            First name must be at least 2 characters
          </p>
        </div>

        <div>
          <label for="lastName" class="block text-gray-700 font-medium mb-1">Last Name</label>
          <input
            type="text"
            id="lastName"
            v-model="lastName"
            @blur="touched.lastName = true"
            placeholder="Doe"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            :class="{ 'border-red-400': touched.lastName && !validLastName }"
          />
          <p v-if="touched.lastName && !lastName" class="text-red-500 text-sm mt-1">
            Last name is required
          </p>
          <p v-else-if="touched.lastName && lastName.length < 2" class="text-red-500 text-sm mt-1">
            Last name must be at least 2 characters
          </p>
        </div>

        <div>
          <label for="userName" class="block text-gray-700 font-medium mb-1">Username</label>
          <input
            type="text"
            id="userName"
            v-model="userName"
            @blur="touched.userName = true"
            placeholder="johndoe"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            :class="{ 'border-red-400': touched.userName && !validUserName }"
          />
          <p v-if="touched.userName && !userName" class="text-red-500 text-sm mt-1">
            Username is required
          </p>
          <p v-else-if="touched.userName && userName.length < 2" class="text-red-500 text-sm mt-1">
            Username must be at least 2 characters
          </p>
        </div>

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

        <div>
          <label for="password" class="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            @blur="touched.password = true"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            :class="{ 'border-red-400': touched.password && !validPassword }"
          />
          <p v-if="touched.password && !password" class="text-red-500 text-sm mt-1">
            Password is required
          </p>
          <p v-else-if="touched.password && password.length < 6" class="text-red-500 text-sm mt-1">
            Password must be at least 6 characters
          </p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-gray-700 font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            @blur="touched.confirmPassword = true"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            :class="{ 'border-red-400': touched.confirmPassword && !passwordsMatch }"
          />
          <p v-if="touched.confirmPassword && !confirmPassword" class="text-red-500 text-sm mt-1">
            Please confirm your password
          </p>
          <p
            v-else-if="touched.confirmPassword && !passwordsMatch"
            class="text-red-500 text-sm mt-1"
          >
            Passwords do not match
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Creating account…' : 'Register' }}
        </button>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
        <p v-if="successMessage" class="text-green-500 text-sm text-center">{{ successMessage }}</p>

        <p class="text-center text-gray-600 text-sm mt-2">
          Already have an account?
          <RouterLink to="/auth/login" class="text-indigo-600 hover:underline">Login</RouterLink>
        </p>
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

const firstName = ref<string>('')
const lastName = ref<string>('')
const userName = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const successMessage = ref<string | null>(null)

type FormField = 'firstName' | 'lastName' | 'userName' | 'email' | 'password' | 'confirmPassword'

const touched = reactive<Record<FormField, boolean>>({
  firstName: false,
  lastName: false,
  userName: false,
  email: false,
  password: false,
  confirmPassword: false,
})

const { register, loading, error } = useAuth()
const { setSession } = useUsers()

const validFirstName = computed<boolean>(() => firstName.value.trim().length >= 2)
const validLastName = computed<boolean>(() => lastName.value.trim().length >= 2)
const validUserName = computed<boolean>(() => userName.value.trim().length >= 2)
const validPassword = computed<boolean>(() => password.value.length >= 6)
const passwordsMatch = computed<boolean>(
  () => !!confirmPassword.value && confirmPassword.value === password.value,
)
const validEmail = computed<boolean>(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const isFormValid = computed<boolean>(
  () =>
    validFirstName.value &&
    validLastName.value &&
    validUserName.value &&
    validEmail.value &&
    validPassword.value &&
    passwordsMatch.value,
)

const touchAll = (): void => {
  const fields = Object.keys(touched) as FormField[]
  fields.forEach((field) => {
    touched[field] = true
  })
}

const resetForm = (): void => {
  firstName.value = ''
  lastName.value = ''
  userName.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  const fields = Object.keys(touched) as FormField[]
  fields.forEach((field) => {
    touched[field] = false
  })
}

const submitForm = async (): Promise<void> => {
  touchAll()
  successMessage.value = null

  if (!isFormValid.value) return

  try {
    const response = await register({
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      userName: userName.value.trim(),
      email: email.value,
      password: password.value,
    })

    setSession(response)

    successMessage.value = 'Account created successfully!'
    resetForm()

    await router.push('/')
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Registration error:', err.message)
    }
  }
}
</script>

<style scoped></style>
