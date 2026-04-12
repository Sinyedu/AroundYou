<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-4">
        <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
        <input
          id="firstName"
          v-model="firstName"
          type="text"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div class="mb-4">
        <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          id="lastName"
          v-model="lastName"
          type="text"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div class="mb-4">
        <label for="userName" class="block text-sm font-medium text-gray-700">Username</label>
        <input
          id="userName"
          v-model="userName"
          type="text"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none"
      >
        Register
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

export default {
  setup() {
    const { register } = useAuth()

    const firstName = ref('')
    const lastName = ref('')
    const userName = ref('')
    const email = ref('')
    const password = ref('')

    const handleRegister = async () => {
      try {
        await register(userName.value, email.value, password.value)
        alert('Registration successful!')
      } catch (error) {
        console.error(error)
        alert('Registration failed. Please check your details.')
      }
    }

    return {
      firstName,
      lastName,
      userName,
      email,
      password,
      handleRegister,
    }
  },
}
</script>

<style scoped>
/* Add your styles here */
</style>
