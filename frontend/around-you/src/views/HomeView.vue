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

      <!-- Nær din lokation -->
      <section class="px-8 py-12">
        <h2 class="text-5xl font-extrabold text-[#094b7b] text-center mb-2">
          Oplevelser nær {{ userLocation }}
        </h2>
        <p class="text-sm text-gray-500 text-center max-w-3xl mx-auto mb-8">{{ userLocationDescription }}</p>

        <p v-if="nearbyLoading" class="text-sm text-gray-500 text-center mb-8">
          Henter seværdigheder nær din lokation...
        </p>

        <p v-else-if="nearbyError" class="text-sm text-red-600 text-center mb-8">
          {{ nearbyError }}
        </p>

        <p v-else-if="!nearbyCards.length" class="text-sm text-gray-500 text-center mb-8">
          Der blev ikke fundet seværdigheder i nærheden.
        </p>

        <div v-if="showNearbyCards" class="grid grid-cols-4 gap-4">
          <AttractionCard
            v-for="card in nearbyCards"
            :key="card.id"
            :card="card"
          />
        </div>
      </section>

      <!-- Danmarks største byer -->
      <section class="px-8 py-12">
        <h2 class="text-3xl font-extrabold text-[#094b7b] text-center mb-2">Udforsk Danmarks største byer</h2>
        <p class="text-sm text-gray-500 text-center max-w-3xl mx-auto mb-8">Gå på opdagelse i København, Aarhus, Odense og Aalborg, hvor hver by byder på sin egen unikke stemning. Oplev alt fra pulserende byliv og spændende kultur til hyggelige kvarterer, historiske seværdigheder og nye smagsoplevelser.</p>

        <p v-if="citiesLoading" class="text-sm text-gray-500 text-center mb-8">
          Henter Danmarks største byer...
        </p>

        <p v-else-if="citiesError" class="text-sm text-red-600 text-center mb-8">
          {{ citiesError }}
        </p>

        <p v-else-if="!cityCards.length" class="text-sm text-gray-500 text-center mb-8">
          Der blev ikke fundet byer i databasen.
        </p>

        <div v-if="showCityCards" class="grid grid-cols-4 gap-4">
          <AttractionCard
            v-for="card in cityCards"
            :key="card.id"
            :card="card"
          />
        </div>
      </section>

      <!-- Natur -->
      <section class="px-8 py-12">
        <h2 class="text-3xl font-extrabold text-[#094b7b] text-center mb-2">Oplev naturens perler</h2>
        <p class="text-sm text-gray-500 text-center max-w-3xl mx-auto mb-8">Gå på opdagelse i Danmarks smukkeste landskaber, hvor naturen byder på ro, vidde og unikke oplevelser. Oplev alt fra imponerende udsigtspunkter og kyststrækninger til skove, søer og skjulte perler rundt i landet.</p>

        <p v-if="natureLoading" class="text-sm text-gray-500 text-center mb-8">
          Henter naturoplevelser...
        </p>

        <p v-else-if="natureError" class="text-sm text-red-600 text-center mb-8">
          {{ natureError }}
        </p>

        <p v-else-if="!natureCards.length" class="text-sm text-gray-500 text-center mb-8">
          Der blev ikke fundet naturoplevelser i databasen.
        </p>

        <div v-if="showNatureCards" class="grid grid-cols-4 gap-4">
          <AttractionCard
            v-for="card in natureCards"
            :key="card.id"
            :card="card"
          />
        </div>
      </section>

      <!-- Familie -->
      <section class="px-8 py-12">
        <h2 class="text-3xl font-extrabold text-[#094b7b] text-center mb-2">Eventyr for hele familien</h2>
        <p class="text-sm text-gray-500 text-center max-w-3xl mx-auto mb-8">Gå på opdagelse i sjove og mindeværdige oplevelser for både børn og voksne i hele Danmark. Oplev alt fra legende aktiviteter og spændende attraktioner til lærerige oplevelser og hyggelige stunder, hvor hele familien kan være med.</p>

        <p v-if="familyLoading" class="text-sm text-gray-500 text-center mb-8">
          Henter familieoplevelser...
        </p>

        <p v-else-if="familyError" class="text-sm text-red-600 text-center mb-8">
          {{ familyError }}
        </p>

        <p v-else-if="!familyCards.length" class="text-sm text-gray-500 text-center mb-8">
          Der blev ikke fundet familieoplevelser i databasen.
        </p>

        <div v-if="showFamilyCards" class="grid grid-cols-4 gap-4">
          <AttractionCard
            v-for="card in familyCards"
            :key="card.id"
            :card="card"
          />
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AttractionCard from '@/components/AttractionCard.vue'
import {
  DEFAULT_NEARBY_LOCATION_DESCRIPTION,
  getFamilyExperiences,
  getLargestCities,
  getNatureExperiences,
  getNearbyLocationContent,
} from '@/api/attractions.api'
import { useGeolocationStore } from '@/stores/geolocation'

const geolocationStore = useGeolocationStore()
const userLocation = ref('din lokation')
const userLocationDescription = ref(DEFAULT_NEARBY_LOCATION_DESCRIPTION)
const nearbyLoading = ref(false)
const nearbyError = ref<string | null>(null)
const citiesLoading = ref(false)
const citiesError = ref<string | null>(null)
const natureLoading = ref(false)
const natureError = ref<string | null>(null)
const familyLoading = ref(false)
const familyError = ref<string | null>(null)

// Placeholder card data
interface Card {
  id: number | string
  name: string
  description: string
  image: string
  rating: number
  reviews: number
  tags: string[]
  metaText?: string
}

const placeholderImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'

function createCard(id: number, name: string, description: string, tags: string[]): Card {
  return {
    id,
    name,
    description,
    image: placeholderImage,
    rating: 4.5,
    reviews: 25784,
    tags,
  }
}

const cityCards = ref<Card[]>([])

async function loadLargestCities() {
  citiesLoading.value = true
  citiesError.value = null

  try {
    cityCards.value = await getLargestCities(4)
  } catch (error) {
    console.error('Fejl ved hentning af byer:', error)
    citiesError.value = 'Vi kunne ikke hente de største byer fra databasen.'
    cityCards.value = []
  } finally {
    citiesLoading.value = false
  }
}

async function loadNatureExperiences() {
  natureLoading.value = true
  natureError.value = null

  try {
    natureCards.value = await getNatureExperiences(4)
  } catch (error) {
    console.error('Fejl ved hentning af naturoplevelser:', error)
    natureError.value = 'Vi kunne ikke hente naturoplevelser fra databasen.'
    natureCards.value = []
  } finally {
    natureLoading.value = false
  }
}

async function loadFamilyExperiences() {
  familyLoading.value = true
  familyError.value = null

  try {
    familyCards.value = await getFamilyExperiences(4)
  } catch (error) {
    console.error('Fejl ved hentning af familieoplevelser:', error)
    familyError.value = 'Vi kunne ikke hente familieoplevelser fra databasen.'
    familyCards.value = []
  } finally {
    familyLoading.value = false
  }
}

const nearbyCards = ref<Card[]>([])

async function loadNearbyContent() {
  if (!geolocationStore.coords) {
    nearbyCards.value = []
    userLocation.value = 'din lokation'
    userLocationDescription.value = DEFAULT_NEARBY_LOCATION_DESCRIPTION
    return
  }

  nearbyLoading.value = true
  nearbyError.value = null

  try {
    const nearbyContent = await getNearbyLocationContent(geolocationStore.coords, 4)

    userLocation.value = nearbyContent.locationName
    userLocationDescription.value = nearbyContent.locationDescription
    nearbyCards.value = nearbyContent.attractions
  } catch (error) {
    console.error('Fejl ved hentning af nærliggende seværdigheder:', error)
    nearbyError.value = 'Vi kunne ikke hente seværdigheder tæt på din lokation.'
    userLocationDescription.value = DEFAULT_NEARBY_LOCATION_DESCRIPTION
    nearbyCards.value = []
  } finally {
    nearbyLoading.value = false
  }
}

watch(
  () => geolocationStore.coords,
  (coords) => {
    if (!coords) {
      if (!geolocationStore.loading) {
        geolocationStore.getLocation()
      }

      return
    }

    void loadNearbyContent()
  },
  { immediate: true },
)

watch(
  () => geolocationStore.error,
  (error) => {
    if (error) {
      nearbyError.value = 'Vi kunne ikke få adgang til din lokation.'
      userLocation.value = 'din lokation'
      userLocationDescription.value = DEFAULT_NEARBY_LOCATION_DESCRIPTION
    }
  },
)

const showNearbyCards = computed(() => !nearbyLoading.value && !nearbyError.value && nearbyCards.value.length > 0)
const showCityCards = computed(() => !citiesLoading.value && !citiesError.value && cityCards.value.length > 0)
const showNatureCards = computed(() => !natureLoading.value && !natureError.value && natureCards.value.length > 0)
const showFamilyCards = computed(() => !familyLoading.value && !familyError.value && familyCards.value.length > 0)

onMounted(() => {
  void loadLargestCities()
  void loadNatureExperiences()
  void loadFamilyExperiences()
})

const natureCards = ref<Card[]>([])

const familyCards = ref<Card[]>([])
</script>
