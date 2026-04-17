<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow rounded">
    <h2 class="text-2xl font-bold mb-4">User Profile</h2>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <form v-else-if="user" @submit.prevent="handleUpdate">
      <div class="mb-4">
        <label class="block text-sm font-medium">Username</label>
        <input v-model="user.userName" class="input" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Email</label>
        <input v-model="user.email" class="input" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">First Name</label>
        <input v-model="user.firstName" class="input" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Last Name</label>
        <input v-model="user.lastName" class="input" />
      </div>

      <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '../composables/useUser'

const { user, loading, error, fetchUser, updateUser } = useUser()

onMounted(() => {
  fetchUser()
})

const handleUpdate = async () => {
  await updateUser()
}
</script>

<style scoped></style>
