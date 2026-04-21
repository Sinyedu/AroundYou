<template>
  <div class="min-h-screen bg-[#FFF]">
    <AppNavbar />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
</script>
