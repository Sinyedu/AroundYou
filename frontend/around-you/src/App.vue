<template>
  <header class="text-black py-4">
    <div class="wrapper">
      <nav class="px-10">
        <RouterLink to="/" class="mr-4">Home</RouterLink>

        <template v-if="!isAuthenticated">
          <RouterLink to="/auth/register" class="mr-4">Register</RouterLink>
          <RouterLink to="/auth/login" class="mr-4">Login</RouterLink>
        </template>

        <template v-else>
          <span class="mr-4 text-black">👋 Welcome {{ userName }}</span>
          <button @click="logout" class="mr-4">Logout</button>
        </template>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, logout, userName } = useAuth()
</script>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
