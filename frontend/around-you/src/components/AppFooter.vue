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
          Find events, attraktioner og byer i Danmark – og oplev nye steder tæt på dig.
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

  <div
    v-if="isPrivacyOpen"
    class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 py-6"
    role="dialog"
    aria-modal="true"
    aria-labelledby="privacy-title"
  >
    <div class="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.32)]">
      <div class="flex shrink-0 items-start justify-between gap-4 px-6 pt-6">
        <div>
          <h2 id="privacy-title" class="mt-2 text-2xl font-black text-[#094b7b]">
            Privatlivspolitik
          </h2>
        </div>
        <button
          type="button"
          class="rounded-full px-3 py-1 text-xl font-black text-[#094b7b] transition hover:bg-[#C1D2DE]"
          aria-label="Luk privatlivspolitik"
          @click="isPrivacyOpen = false"
        >
          ×
        </button>
      </div>

      <div class="modal-scroll mt-5 grid gap-4 overflow-y-auto px-6 pb-6 pr-8 text-sm leading-6 text-slate-700">
        <section>
          <h3 class="font-black text-[#094b7b]">1. Hvilke oplysninger vi indsamler</h3>
          <p>
            AroundYou kan gemme de oplysninger, du selv giver os, når du opretter en konto,
            opdaterer din profil, uploader billeder, opretter indhold eller skriver anmeldelser.
            Det kan for eksempel være navn, brugernavn, email, profilbillede, beskrivelser og
            andet indhold, du vælger at dele.
          </p>
        </section>

        <section>
          <h3 class="font-black text-[#094b7b]">2. Lokation og geografiske oplysninger</h3>
          <p>
            Hvis du vælger at dele din lokation, bruger vi den til at vise relevante events,
            attraktioner og byer tæt på dig. Lokationsadgang er frivillig, og du kan til enhver tid
            ændre tilladelsen i din browser.
          </p>
        </section>

        <section>
          <h3 class="font-black text-[#094b7b]">3. Billeder og brugerindhold</h3>
          <p>
            Billeder, anmeldelser og indhold, du uploader, bruges til at vise og forbedre
            oplevelserne på AroundYou. Du er selv ansvarlig for kun at uploade indhold, du har ret
            til at bruge.
          </p>
        </section>

        <section>
          <h3 class="font-black text-[#094b7b]">4. Hvordan vi bruger oplysningerne</h3>
          <p>
            Vi bruger oplysningerne til at drive siden, vise relevant indhold, gemme dine
            kontoindstillinger, håndtere login og gøre AroundYou mere brugbar for dig og andre
            brugere.
          </p>
        </section>

        <section>
          <h3 class="font-black text-[#094b7b]">5. Cookies</h3>
          <p>
            Vi kan bruge nødvendige cookies eller lokal lagring til login, sessioner og
            grundlæggende funktionalitet. Vi bruger ikke oplysningerne til at sælge dine personlige
            data.
          </p>
        </section>

        <section>
          <h3 class="font-black text-[#094b7b]">6. Kontakt</h3>
          <p>
            Har du spørgsmål til dine oplysninger eller denne privatlivspolitik, kan du kontakte os
            på
            <a href="mailto:kontakt@aroundyou.dk" class="footer-link font-semibold">
              kontakt@aroundyou.dk </a
            >.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import aroundYouLogo from '@/assets/around-you-logo.svg'

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

.modal-scroll {
  margin-right: 10px;
  scrollbar-gutter: stable;
}
</style>
