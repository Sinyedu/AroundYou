//TODO: CREATE REGISTER VIEW


<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

      <!-- Registration Form -->
      <form class="space-y-4" @submit.prevent="submitForm">
        <!-- Name -->
        <div>
          <label for="name" class="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            placeholder="John Doe"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <p v-if="!name" class="text-red-500 text-sm mt-1">Name is required</p>
        </div>

        <!-- Email -->
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

        <!-- Password -->
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

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-gray-700 font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="********"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <p v-if="confirmPassword && confirmPassword !== password" class="text-red-500 text-sm mt-1">
            Passwords do not match
          </p>
          <p v-else-if="!confirmPassword" class="text-red-500 text-sm mt-1">Please confirm your password</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
        >
          Register
        </button>

        <!-- Already have an account -->
        <p class="text-center text-gray-600 text-sm mt-2">
          Already have an account?
          <a href="#" class="text-indigo-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// Simple email regex validation
const validEmail = computed(() => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.value);
});

// Placeholder submit function
const submitForm = () => {
  alert("Form submitted (UI only, no backend)");
};
</script>

<style scoped>
</style>
