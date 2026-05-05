<template>
  <main class="min-h-[calc(100vh-88px)] bg-[#C1D2DE] px-4 py-8">
    <section
      class="mx-auto grid max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(9,75,123,0.16)] lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div class="flex flex-col justify-between gap-8 bg-[#094b7b] px-8 py-8 text-white">
        <div>
          <h1 class="text-3xl font-black tracking-tight">Opret konto</h1>
          <p class="mt-3 max-w-md text-sm leading-6 text-white/80">
            Bliv en del af AroundYou og begynd at oprette oplevelser, events og steder i Danmark.
          </p>
        </div>
      </div>

      <div class="flex items-center px-6 py-8 sm:px-10">
        <div class="w-full">
          <h2 class="text-3xl font-black tracking-tight text-[#094b7b]">Kom i gang</h2>

          <p
            v-if="message"
            class="mt-5 rounded-xl px-4 py-3 text-sm font-semibold"
            :class="isSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
          >
            {{ message }}
          </p>

          <form class="mt-5 grid gap-4 sm:grid-cols-2" @submit.prevent="handleRegister">
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-slate-700">Fornavn</span>
              <input
                id="firstName"
                v-model="firstName"
                type="text"
                required
                autocomplete="given-name"
                class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#094b7b] focus:ring-4 focus:ring-[#C1D2DE]/60"
              />
            </label>

            <label class="grid gap-2">
              <span class="text-sm font-semibold text-slate-700">Efternavn</span>
              <input
                id="lastName"
                v-model="lastName"
                type="text"
                required
                autocomplete="family-name"
                class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#094b7b] focus:ring-4 focus:ring-[#C1D2DE]/60"
              />
            </label>

            <label class="grid gap-2 sm:col-span-2">
              <span class="text-sm font-semibold text-slate-700">Brugernavn</span>
              <input
                id="userName"
                v-model="userName"
                type="text"
                required
                autocomplete="username"
                class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#094b7b] focus:ring-4 focus:ring-[#C1D2DE]/60"
              />
            </label>

            <label class="grid gap-2 sm:col-span-2">
              <span class="text-sm font-semibold text-slate-700">Email</span>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#094b7b] focus:ring-4 focus:ring-[#C1D2DE]/60"
              />
            </label>

            <label class="grid gap-2 sm:col-span-2">
              <span class="text-sm font-semibold text-slate-700">Adgangskode</span>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                autocomplete="new-password"
                class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#094b7b] focus:ring-4 focus:ring-[#C1D2DE]/60"
              />
            </label>

            <button
              type="submit"
              class="rounded-full bg-[#094b7b] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(9,75,123,0.18)] transition hover:bg-[#0b5d98] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Opretter konto...' : 'Opret konto' }}
            </button>
          </form>

          <p class="mt-5 text-sm text-slate-600">
            Har du allerede en konto?
            <RouterLink to="/auth/login" class="font-semibold text-[#094b7b] hover:text-[#de5826]">
              Log ind
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

const { register } = useAuth()

const firstName = ref('')
const lastName = ref('')
const userName = ref('')
const email = ref('')
const password = ref('')
const message = ref('')
const isSuccess = ref(false)
const isSubmitting = ref(false)

const handleRegister = async () => {
  if (!firstName.value || !lastName.value || !userName.value || !email.value || !password.value) {
    return
  }

  try {
    isSubmitting.value = true
    message.value = ''
    isSuccess.value = false

    await register(firstName.value, lastName.value, userName.value, email.value, password.value)

    isSuccess.value = true
    message.value = 'Din konto er oprettet. Du kan logge ind nu.'
  } catch (error) {
    console.error(error)
    isSuccess.value = false
    message.value = error instanceof Error ? error.message : 'Registration failed.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
