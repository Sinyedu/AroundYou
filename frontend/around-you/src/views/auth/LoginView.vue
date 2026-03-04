<template> 
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        
      <form class="space-y-4" @submit.prevent="submitForm">
        
        <div>
          <label for="email" class="block text-gray-700 font-medium mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="example@email.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <p v-if="email && !validEmail" class="text-red-500 text-sm mt-1">Invalid email address</p>
          <p v-else-if="!email" class="text-red-500 text-sm mt-1">Email is required</p>
        </div>

        
        <div>
          <label for="password" class="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="********"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <p v-if="!password" class="text-red-500 text-sm mt-1">Password is required</p>
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
        >
          Login
        </button>

        
        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <a href="#" class="text-indigo-600 hover:underline">Forgot Password?</a>
          <a href="#" class="text-indigo-600 hover:underline">Create Account</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  //TODO :DOCUMENTATION 
import { ref, computed } from "vue";

const email = ref("");
const password = ref("");

// TODO: Temporary stay, needs to move into a global file.
const validEmail = computed(() => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.value);
});

// Placeholder
const submitForm = () => {
  alert("Login form submitted (UI only, no backend)");
};
</script>

<style scoped>
</style>
