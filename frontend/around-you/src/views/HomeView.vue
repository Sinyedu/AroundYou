<template>
  <!-- Map background wrapper -->
  <div class="min-h-screen bg-[#d6cfc5] relative py-[50px]">
    <!-- Denmark map background -->
    <div
      class="fixed inset-0 pointer-events-none"
      style="
        background-image: url('https://staticmap.openstreetmap.de/staticmap.php?center=56.0,10.5&zoom=6&size=1600x900');
        background-size: cover;
        background-position: center;
        opacity: 0.55;
      "
    ></div>

    <!-- White content card -->
    <div class="relative z-10 mx-[50px] bg-white shadow-2xl rounded-xl overflow-hidden">
      <HomeContentSection
        :title="`Oplevelser nær ${userLocation}`"
        :description="userLocationDescription"
        :loading="nearbyLoading"
        :error="nearbyError"
        :cards="nearbyCards"
        loading-text="Henter seværdigheder nær din lokation..."
        empty-text="Der blev ikke fundet seværdigheder i nærheden."
        title-class="text-5xl font-extrabold text-[#094b7b] text-center mb-2"
      />

      <HomeContentSection
        title="Udforsk Danmarks største byer"
        description="Gå på opdagelse i København, Aarhus, Odense og Aalborg, hvor hver by byder på sin egen unikke stemning. Oplev alt fra pulserende byliv og spændende kultur til hyggelige kvarterer, historiske seværdigheder og nye smagsoplevelser."
        :loading="citiesLoading"
        :error="citiesError"
        :cards="cityCards"
        loading-text="Henter Danmarks største byer..."
        empty-text="Vi kunne ikke finde information om Danmarks største byer."
      />

      <HomeContentSection
        title="Oplev naturens perler"
        description="Gå på opdagelse i Danmarks smukkeste landskaber, hvor naturen byder på ro, vidde og unikke oplevelser. Oplev alt fra imponerende udsigtspunkter og kyststrækninger til skove, søer og skjulte perler rundt i landet."
        :loading="natureLoading"
        :error="natureError"
        :cards="natureCards"
        loading-text="Henter naturoplevelser..."
        empty-text="Vi kunne ikke finde nogle naturoplevelser."
      />

      <HomeContentSection
        title="Eventyr for hele familien"
        description="Gå på opdagelse i sjove og mindeværdige oplevelser for både børn og voksne i hele Danmark. Oplev alt fra legende aktiviteter og spændende attraktioner til lærerige oplevelser og hyggelige stunder, hvor hele familien kan være med."
        :loading="familyLoading"
        :error="familyError"
        :cards="familyCards"
        loading-text="Henter familieoplevelser..."
        empty-text="Vi kunne ikke finde nogle familieoplevelser."
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import HomeContentSection from '@/components/HomeContentSection.vue'
import { useHomeViewData } from '@/composables/useHomeViewData'

const {
  userLocation,
  userLocationDescription,
  nearbyCards,
  nearbyLoading,
  nearbyError,
  cityCards,
  citiesLoading,
  citiesError,
  natureCards,
  natureLoading,
  natureError,
  familyCards,
  familyLoading,
  familyError,
} = useHomeViewData()
</script>
