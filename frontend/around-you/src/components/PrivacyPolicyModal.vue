<template>
  <div
    class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 py-6"
    role="dialog"
    aria-modal="true"
    aria-labelledby="privacy-title"
  >
    <div
      class="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.32)]"
    >
      <div class="flex shrink-0 items-start justify-between gap-4 px-6 pt-6">
        <h2 id="privacy-title" class="mt-2 text-2xl font-black text-[#094b7b]">
          Privatlivspolitik
        </h2>
        <button
          type="button"
          class="rounded-full px-3 py-1 text-xl font-black text-[#094b7b] transition hover:bg-[#C1D2DE]"
          aria-label="Luk privatlivspolitik"
          @click="$emit('close')"
        >
          ×
        </button>
      </div>

      <div
        class="modal-scroll mt-5 grid gap-4 overflow-y-auto px-6 pb-6 pr-8 text-sm leading-6 text-slate-700"
      >
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
            <a href="mailto:kontakt@aroundyou.dk" class="privacy-link font-semibold">
              kontakt@aroundyou.dk </a
            >.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  close: []
}>()
</script>

<style scoped>
.privacy-link {
  color: #094b7b;
  transition: color 150ms ease;
}

.privacy-link:hover {
  color: #de5826;
}

.modal-scroll {
  margin-right: 10px;
  scrollbar-gutter: stable;
}
</style>
