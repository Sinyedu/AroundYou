<template class="w-screen">
  <header class="text-black py-4">
    <div class="wrapper">
      <nav class="px-10">
        <RouterLink to="/" class="mr-4">Home</RouterLink>
        <RouterLink to="/auth/register" class="mr-4">Register</RouterLink>
        <RouterLink to="/auth/login" class="mr-4">Login</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
