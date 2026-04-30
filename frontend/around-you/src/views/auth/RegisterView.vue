<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Register</h2>

    <form @submit.prevent="handleRegister">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">First Name</label>
        <input id="firstName" v-model="firstName" type="text" required class="input" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Last Name</label>
        <input id="lastName" v-model="lastName" type="text" required class="input" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Username</label>
        <input id="userName" v-model="userName" type="text" required class="input" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input id="email" v-model="email" type="email" required class="input" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input id="password" v-model="password" type="password" required class="input" />
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded">
        Register
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const { register } = useAuth()

const firstName = ref('')
const lastName = ref('')
const userName = ref('')
const email = ref('')
const password = ref('')

const handleRegister = async () => {
  if (!firstName.value || !lastName.value || !userName.value || !email.value || !password.value) {
    return
  }

  try {
    await register(firstName.value, lastName.value, userName.value, email.value, password.value)

    alert('Registration successful!')
  } catch (error) {
    console.error(error)
    alert('Registration failed. Please check your details.')
  }
}
</script>

<style scoped></style>
