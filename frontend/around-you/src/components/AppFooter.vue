<template>
  <footer class="border-t border-[#094b7b]/10 bg-white px-4 py-8">
    <div class="mx-auto grid max-w-7xl gap-8 px-1 md:grid-cols-[1.2fr_0.8fr_1fr_1fr] md:px-2">
      <div>
        <RouterLink
          to="/"
          class="inline-flex items-center transition hover:opacity-85"
          aria-label="AroundYou home"
        >
          <img :src="aroundYouLogo" alt="AroundYou" class="h-11 w-auto" />
        </RouterLink>
        <p class="mt-4 max-w-sm text-sm leading-6 text-slate-600">
          Find events, attraktioner og byer i Danmark, og oplev nye steder tæt på dig.
        </p>
      </div>

      <nav aria-label="Footer navigation">
        <h2 class="text-sm font-black uppercase tracking-[0.2em] text-[#de5826]">Sider</h2>
        <div class="mt-4 grid gap-3 text-sm font-semibold">
          <RouterLink :to="{ name: 'home' }" class="footer-link">Hjem</RouterLink>
          <RouterLink :to="{ name: 'search' }" class="footer-link">Udforsk</RouterLink>
          <RouterLink :to="{ name: 'create' }" class="footer-link">Tilføj</RouterLink>
          <RouterLink :to="{ name: 'contact' }" class="footer-link">Kontakt</RouterLink>
        </div>
      </nav>

      <div>
        <h2 class="text-sm font-black uppercase tracking-[0.2em] text-[#de5826]">Links</h2>
        <button
          type="button"
          class="footer-link mt-4 text-left text-sm font-semibold"
          @click="isPrivacyOpen = true"
        >
          Privatlivspolitik
        </button>
      </div>

      <address class="not-italic">
        <h2 class="text-sm font-black uppercase tracking-[0.2em] text-[#de5826]">Kontakt</h2>
        <div class="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
          <p>
            <span class="block font-semibold text-[#094b7b]">Email</span>
            <a href="mailto:kontakt@aroundyou.dk" class="footer-link">kontakt@aroundyou.dk</a>
          </p>
          <p>
            <span class="block font-semibold text-[#094b7b]">Telefon</span>
            <a href="tel:+4571234567" class="footer-link">+45 71 23 45 67</a>
          </p>
          <p>
            <span class="block font-semibold text-[#094b7b]">Åbningstid</span>
            Mandag-fredag 09.00-15.00
          </p>
        </div>
      </address>
    </div>

    <div class="mx-auto mt-8 max-w-7xl border-t border-[#094b7b]/10 px-1 pt-5 md:px-2">
      <p class="text-xs font-semibold text-slate-500">
        © {{ currentYear }} AroundYou. Alle rettigheder forbeholdes.
      </p>
    </div>
  </footer>

  <PrivacyPolicyModal v-if="isPrivacyOpen" @close="isPrivacyOpen = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import aroundYouLogo from '@/assets/around-you-logo.svg'
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal.vue'

const currentYear = new Date().getFullYear()
const isPrivacyOpen = ref(false)
</script>

<style scoped>
.footer-link {
  color: #094b7b;
  transition:
    color 150ms ease,
    transform 150ms ease;
}

.footer-link:hover {
  color: #de5826;
  transform: translateX(2px);
}
</style>
