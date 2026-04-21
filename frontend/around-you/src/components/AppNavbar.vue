<template>
  <header class="sticky top-0 z-50 border-b border-[#094b7b]/10 bg-white px-4 py-4">
    <nav
      ref="navRef"
      class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-3 px-1 py-1 md:px-2"
      aria-label="Primary"
    >
      <RouterLink
        to="/"
        class="text-3xl font-black tracking-tight text-[#094b7b] transition hover:text-[#0b5d98]"
      >
        AroundYou
      </RouterLink>

      <div class="flex basis-full flex-wrap items-center justify-start gap-x-4 gap-y-3 md:ml-20 md:basis-auto md:flex-1 md:justify-end md:gap-x-8">
        <RouterLink :to="{ name: 'home' }" :class="getNavLinkClass('home')">Hjem</RouterLink>
        <RouterLink :to="{ name: 'mapview' }" :class="getNavLinkClass('mapview')">Udforsk</RouterLink>
        <RouterLink :to="{ name: 'create' }" :class="getNavLinkClass('create')">Tilføj</RouterLink>
        <RouterLink :to="{ name: 'contact' }" :class="getNavLinkClass('contact')">Kontakt</RouterLink>

        <template v-if="isAuthenticated">
          <span class="rounded-full bg-[#C1D2DE] px-4 py-2 text-sm font-medium text-[#094b7b]">
            Velkommen {{ displayUserName }}
          </span>

          <RouterLink
            v-if="isAdmin"
            :to="{ name: 'admin' }"
            :class="getNavLinkClass('admin')"
          >
            Admin
          </RouterLink>

          <div class="relative">
            <button
              type="button"
              class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#094b7b]/12 bg-gradient-to-br from-[#094b7b] to-[#de5826] text-sm font-bold text-white shadow-[0_10px_30px_rgba(9,75,123,0.18)] transition hover:scale-[1.02]"
              aria-haspopup="menu"
              :aria-expanded="isAvatarMenuOpen"
              aria-label="Brugermenu"
              @click="toggleAvatarMenu"
            >
              <img
                v-if="userAvatar"
                :src="userAvatar"
                :alt="`${displayUserName} avatar`"
                class="h-full w-full object-cover"
              />
              <span v-else>{{ avatarInitials }}</span>
            </button>

            <div
              v-if="isAvatarMenuOpen"
              class="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-3xl border border-[#094b7b] bg-white shadow-[0_22px_60px_rgba(9,75,123,0.2)]"
              role="menu"
            >
              <div class="border-b border-[#094b7b]/8 bg-[#FFF] px-5 py-4">
                <p class="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#de5826]">Min konto</p>
                <p class="mt-1 text-sm font-semibold text-[#094b7b]">{{ displayUserName }}</p>
              </div>

              <RouterLink
                :to="{ name: 'user-profile' }"
                class="block px-5 py-3 text-sm text-slate-700 transition hover:bg-[#C1D2DE] hover:text-[#094b7b]"
                role="menuitem"
                @click="closeAvatarMenu"
              >
                Profil
              </RouterLink>
              <RouterLink
                :to="{ name: 'settings' }"
                class="block px-5 py-3 text-sm text-slate-700 transition hover:bg-[#C1D2DE] hover:text-[#094b7b]"
                role="menuitem"
                @click="closeAvatarMenu"
              >
                Indstillinger
              </RouterLink>
              <button
                type="button"
                class="block w-full px-5 py-3 text-left text-sm text-slate-700 transition hover:bg-[#C1D2DE] hover:text-[#094b7b]"
                role="menuitem"
                @click="handleLogout"
              >
                Log ud
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <RouterLink
            to="/auth/login"
            class="rounded-full px-4 py-2 text-sm font-semibold text-[#094b7b] transition hover:bg-[#C1D2DE]"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/auth/register"
            class="rounded-full bg-[#094b7b] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(9,75,123,0.18)] transition hover:bg-[#0b5d98]"
          >
            Opret konto
          </RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const navRef = ref<ComponentPublicInstance | HTMLElement | null>(null)
const isAvatarMenuOpen = ref(false)

const { avatarInitials, isAdmin, isAuthenticated, logout, userAvatar, userName } = useAuth()

const displayUserName = computed(() => userName.value || 'Guest')

const getNavLinkClass = (routeName: string) => {
  const isActive = route.name === routeName

  return [
    'rounded-full px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-[#094b7b] text-white shadow-[0_12px_25px_rgba(9,75,123,0.18)]'
      : 'text-[#094b7b] hover:bg-[#C1D2DE] hover:text-[#de5826]',
  ]
}

const closeAvatarMenu = () => {
  isAvatarMenuOpen.value = false
}

const toggleAvatarMenu = () => {
  isAvatarMenuOpen.value = !isAvatarMenuOpen.value
}

const handleLogout = async () => {
  closeAvatarMenu()
  logout()
  await router.push('/')
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!isAvatarMenuOpen.value) {
    return
  }

  const navElement = navRef.value instanceof HTMLElement ? navRef.value : navRef.value?.$el

  if (navElement && event.target instanceof Node && !navElement.contains(event.target)) {
    closeAvatarMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>