<template>
  <main class="min-h-[calc(100vh-88px)] bg-[#C1D2DE] px-4 py-8">
    <section
      class="mx-auto max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(9,75,123,0.16)]"
    >
      <div class="bg-[#094b7b] px-6 py-8 text-center text-white sm:px-10">
        <div
          class="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white text-3xl font-black text-[#094b7b] shadow-[0_18px_44px_rgba(0,0,0,0.2)]"
        >
          <img
            v-if="displayAvatar"
            :src="displayAvatar"
            :alt="`${displayName} avatar`"
            class="h-full w-full object-cover"
          />
          <span v-else>{{ initials }}</span>
        </div>
        <h1 class="mt-5 text-3xl font-black tracking-tight sm:text-4xl">{{ displayName }}</h1>
        <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/80">
          Hold dine kontooplysninger opdateret, så AroundYou kan føles mere personligt.
        </p>
      </div>

      <div class="px-6 py-8 sm:px-10">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#de5826]">Konto</p>
        <h2 class="mt-2 text-3xl font-black tracking-tight text-[#094b7b]">Min profil</h2>

        <div
          v-if="loading && !user"
          class="mt-6 rounded-xl bg-[#C1D2DE] px-4 py-3 text-sm font-semibold text-[#094b7b]"
        >
          Henter profil...
        </div>

        <p
          v-else-if="error"
          class="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
        >
          {{ error }}
        </p>

        <p
          v-if="successMessage"
          class="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
        >
          {{ successMessage }}
        </p>

        <form v-if="user" class="mt-6 grid gap-4 sm:grid-cols-2" @submit.prevent="handleUpdate">
          <div
            class="rounded-2xl border border-[#094b7b]/15 bg-[#C1D2DE]/40 px-4 py-4 sm:col-span-2"
          >
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-slate-700">Avatar billede</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                @change="handleAvatarSelected"
                class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white"
              />
            </label>
            <p v-if="avatarFile" class="mt-2 break-all text-xs font-semibold text-slate-600">
              Valgt: {{ avatarFile.name }}
            </p>
            <p v-if="avatarError" class="mt-2 text-sm font-semibold text-rose-700">
              {{ avatarError }}
            </p>
          </div>

          <label class="grid gap-2 sm:col-span-2">
            <span class="text-sm font-semibold text-slate-700">Brugernavn</span>
            <input
              v-model="user.userName"
              class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#094b7b] focus:ring-4 focus:ring-[#C1D2DE]/60"
            />
          </label>

          <label class="grid gap-2 sm:col-span-2">
            <span class="text-sm font-semibold text-slate-700">Email</span>
            <input
              v-model="user.email"
              type="email"
              class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#094b7b] focus:ring-4 focus:ring-[#C1D2DE]/60"
            />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700">Fornavn</span>
            <input
              v-model="user.firstName"
              class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#094b7b] focus:ring-4 focus:ring-[#C1D2DE]/60"
            />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700">Efternavn</span>
            <input
              v-model="user.lastName"
              class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#094b7b] focus:ring-4 focus:ring-[#C1D2DE]/60"
            />
          </label>

          <button
            type="submit"
            class="rounded-full bg-[#094b7b] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(9,75,123,0.18)] transition hover:bg-[#0b5d98] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
            :disabled="loading || uploadingAvatar"
          >
            {{ loading || uploadingAvatar ? 'Gemmer...' : 'Gem ændringer' }}
          </button>
        </form>

        <div v-if="user" class="mt-8 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4">
          <h3 class="text-lg font-black text-rose-800">Slet konto</h3>
          <p class="mt-2 text-sm leading-6 text-rose-700">
            Din konto bliver deaktiveret, og du bliver logget ud.
          </p>
          <button
            type="button"
            class="mt-4 rounded-full bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="deletingAccount"
            @click="openDeleteModal"
          >
            Slet konto
          </button>
        </div>
      </div>
    </section>

    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      <div
        class="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.32)]"
      >
        <h2 id="delete-account-title" class="text-2xl font-black text-[#094b7b]">Er du sikker?</h2>
        <p class="mt-3 text-sm leading-6 text-slate-700">
          Vil du slette din konto? Kontoen bliver deaktiveret, men dine data bliver ikke slettet
          permanent.
        </p>
        <p
          v-if="deleteAccountError"
          class="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
        >
          {{ deleteAccountError }}
        </p>
        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            class="rounded-full px-5 py-2.5 text-sm font-semibold text-[#094b7b] transition hover:bg-[#C1D2DE]"
            :disabled="deletingAccount"
            @click="closeDeleteModal"
          >
            Annuller
          </button>
          <button
            type="button"
            class="rounded-full bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="deletingAccount"
            @click="confirmDeleteAccount"
          >
            {{ deletingAccount ? 'Sletter...' : 'Ja, slet min konto' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useUserProfileView } from '@/composables/profile/useUserProfileView'

const {
  avatarError,
  avatarFile,
  closeDeleteModal,
  confirmDeleteAccount,
  deleteAccountError,
  deletingAccount,
  displayAvatar,
  displayName,
  error,
  handleAvatarSelected,
  handleUpdate,
  initials,
  isDeleteModalOpen,
  loading,
  openDeleteModal,
  successMessage,
  uploadingAvatar,
  user,
} = useUserProfileView()
</script>
