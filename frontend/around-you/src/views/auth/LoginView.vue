<template>
  <main class="min-h-[calc(100vh-88px)] bg-[#C1D2DE] px-4 py-8">
    <section class="mx-auto grid max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(9,75,123,0.16)] lg:grid-cols-[0.9fr_1.1fr]">
      <div class="flex flex-col justify-between gap-8 bg-[#094b7b] px-8 py-8 text-white">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[#f1b28f]">Around You</p>
          <h1 class="mt-3 text-3xl font-black tracking-tight">Velkommen tilbage</h1>
          <p class="mt-3 max-w-md text-sm leading-6 text-white/80">
            Log ind og fortsæt med at finde oplevelser, byer og attraktioner tæt på dig.
          </p>
        </div>
      </div>

      <div class="flex items-center px-6 py-8 sm:px-10">
        <div class="w-full">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#de5826]">Login</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight text-[#094b7b]">Log ind</h2>

          <p
            v-if="errorMessage"
            class="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
          >
            {{ errorMessage }}
          </p>

          <form class="mt-5 grid gap-4" @submit.prevent="handleLogin">
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-slate-700">Email eller brugernavn</span>
              <input
                id="email"
                v-model="identifier"
                required
                autocomplete="username"
                class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#094b7b] focus:ring-4 focus:ring-[#C1D2DE]/60"
                placeholder="din@email.dk"
              />
            </label>

            <label class="grid gap-2">
              <span class="text-sm font-semibold text-slate-700">Adgangskode</span>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#094b7b] focus:ring-4 focus:ring-[#C1D2DE]/60"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              class="rounded-full bg-[#094b7b] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(9,75,123,0.18)] transition hover:bg-[#0b5d98] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Logger ind...' : 'Log ind' }}
            </button>
          </form>

          <p class="mt-5 text-sm text-slate-600">
            Har du ikke en konto?
            <RouterLink to="/auth/register" class="font-semibold text-[#094b7b] hover:text-[#de5826]">
              Opret konto
            </RouterLink>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useRouter } from 'vue-router'
import { useGeolocationStore } from '../../stores/geolocation'
const router = useRouter()

const identifier = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const { login, isAuthenticated } = useAuth()
const geo = useGeolocationStore()
const handleLogin = async () => {
  try {
    if (!identifier.value || !password.value) return

    isSubmitting.value = true
    errorMessage.value = ''

    await login(identifier.value.trim(), password.value)

    if (!isAuthenticated.value) return

    geo.getLocation()
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Login failed.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
