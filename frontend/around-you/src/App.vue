<template>
  <div class="flex min-h-screen flex-col bg-[#FFF]">
    <AppNavbar />
    <div class="flex-1">
      <RouterView />
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppFooter from '@/components/AppFooter.vue'
import AppNavbar from '@/components/AppNavbar.vue'
</script>
