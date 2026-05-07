<template>
  <main class="min-h-[calc(100vh-88px)] bg-[#C1D2DE] px-4 py-8">
    <section class="mx-auto max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(9,75,123,0.16)]">
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

        <div v-if="loading && !user" class="mt-6 rounded-xl bg-[#C1D2DE] px-4 py-3 text-sm font-semibold text-[#094b7b]">
          Henter profil...
        </div>

        <p v-else-if="error" class="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {{ error }}
        </p>

        <p
          v-if="successMessage"
          class="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
        >
          {{ successMessage }}
        </p>

        <form v-if="user" class="mt-6 grid gap-4 sm:grid-cols-2" @submit.prevent="handleUpdate">
          <div class="rounded-2xl border border-[#094b7b]/15 bg-[#C1D2DE]/40 px-4 py-4 sm:col-span-2">
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
            @click="isDeleteModalOpen = true"
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
      <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.32)]">
        <h2 id="delete-account-title" class="text-2xl font-black text-[#094b7b]">Er du sikker?</h2>
        <p class="mt-3 text-sm leading-6 text-slate-700">
          Vil du slette din konto? Kontoen bliver deaktiveret, men dine data bliver ikke slettet
          permanent.
        </p>
        <p v-if="deleteAccountError" class="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { uploadImageFile } from '@/api/contentApi'
import { restrictUserProfile } from '@/api/user'
import { useAuth } from '@/composables/useAuth'
import { compressImageFile, isAllowedImageType } from '@/utils/imageCompressor'
import { useUser } from '../composables/useUser'

const router = useRouter()
const { user, loading, error, fetchUser, updateUser } = useUser()
const { logout } = useAuth()
const successMessage = ref('')
const avatarError = ref('')
const avatarFile = ref<File | null>(null)
const avatarPreview = ref('')
const hasInvalidAvatarFile = ref(false)
const uploadingAvatar = ref(false)
const deletingAccount = ref(false)
const deleteAccountError = ref('')
const isDeleteModalOpen = ref(false)

const displayName = computed(() => user.value?.userName || 'Din profil')
const displayAvatar = computed(() => avatarPreview.value || user.value?.userAvatar || '')
const initials = computed(() => {
  const source = user.value?.userName || user.value?.email || 'AY'
  return source.slice(0, 2).toUpperCase()
})

const revokeAvatarPreview = () => {
  if (avatarPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }
}

onMounted(() => {
  fetchUser()
})

onUnmounted(() => {
  revokeAvatarPreview()
})

const handleAvatarSelected = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]

  avatarError.value = ''
  successMessage.value = ''

  if (!file) {
    hasInvalidAvatarFile.value = false
    return
  }

  if (!isAllowedImageType(file)) {
    avatarError.value = 'Vælg et PNG-, JPG- eller WEBP-billede.'
    avatarFile.value = null
    hasInvalidAvatarFile.value = true
    target.value = ''
    return
  }

  hasInvalidAvatarFile.value = false
  revokeAvatarPreview()
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

const uploadAvatarIfSelected = async () => {
  if (!avatarFile.value || !user.value) return true

  const token = localStorage.getItem('token')

  if (!token) {
    avatarError.value = 'Du skal være logget ind for at uploade et avatarbillede.'
    return false
  }

  uploadingAvatar.value = true

  try {
    const compressedFile = await compressImageFile(avatarFile.value, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.78,
    })
    user.value.userAvatar = await uploadImageFile(compressedFile, token)
    avatarFile.value = null
    revokeAvatarPreview()
    avatarPreview.value = ''
    return true
  } catch (err: unknown) {
    avatarError.value = err instanceof Error ? err.message : 'Avatarbilledet kunne ikke uploades.'
    return false
  } finally {
    uploadingAvatar.value = false
  }
}

const handleUpdate = async () => {
  successMessage.value = ''

  if (hasInvalidAvatarFile.value) {
    avatarError.value = 'Vælg et PNG-, JPG- eller WEBP-billede, før du gemmer.'
    return
  }

  avatarError.value = ''

  const avatarUploaded = await uploadAvatarIfSelected()
  if (!avatarUploaded) return

  await updateUser()
  if (!error.value) {
    successMessage.value = 'Profilen er opdateret.'
  }
}

const closeDeleteModal = () => {
  if (deletingAccount.value) return

  deleteAccountError.value = ''
  isDeleteModalOpen.value = false
}

const confirmDeleteAccount = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    deleteAccountError.value = 'Du skal være logget ind for at slette din konto.'
    return
  }

  deletingAccount.value = true
  deleteAccountError.value = ''

  try {
    await restrictUserProfile(token)
    logout()
    await router.push('/auth/login')
  } catch (err: unknown) {
    deleteAccountError.value =
      err instanceof Error ? err.message : 'Kontoen kunne ikke slettes lige nu.'
  } finally {
    deletingAccount.value = false
  }
}
</script>
