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
        <p class="text-sm text-gray-500 text-center max-w-3xl mx-auto mb-8">Gå på opdagelse i spændende oplevelser tæt på din egen lokation, hvor natur, kultur, attraktioner og restauranter er lige inden for rækkevidde. Oplev alt fra populære seværdigheder og hyggelige udflugtsmål til lokale favoritter og skjulte perler lige i nærheden.</p>

        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="card in nearbyCards"
            :key="card.id"
            class="group rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <img :src="card.image" :alt="card.name" class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            <div class="p-3">
              <p class="text-sm font-semibold text-[#094b7b]">{{ card.name }}</p>
              <p class="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3">{{ card.description }}</p>
              <div class="flex items-center gap-1 mt-1">
                <span class="text-xs font-bold text-gray-800">{{ card.rating }}</span>
                <div class="flex text-[#de5826]">
                  <span v-for="n in 5" :key="n" class="text-xs">
                    {{ n <= Math.floor(card.rating) ? '★' : n - card.rating < 1 ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-xs text-gray-400">({{ card.reviews.toLocaleString() }})</span>
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="tag in card.tags"
                  :key="tag"
                  class="text-[10px] text-gray-500 border border-gray-200 rounded-full px-2 py-0.5"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Danmarks største byer -->
      <section class="px-8 py-12">
        <h2 class="text-3xl font-extrabold text-[#094b7b] text-center mb-2">Udforsk Danmarks største byer</h2>
        <p class="text-sm text-gray-500 text-center max-w-3xl mx-auto mb-8">Gå på opdagelse i København, Aarhus, Odense og Aalborg, hvor hver by byder på sin egen unikke stemning. Oplev alt fra pulserende byliv og spændende kultur til hyggelige kvarterer, historiske seværdigheder og nye smagsoplevelser.</p>

        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="card in cityCards"
            :key="card.id"
            class="group rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <img :src="card.image" :alt="card.name" class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            <div class="p-3">
              <p class="text-sm font-semibold text-[#094b7b]">{{ card.name }}</p>
              <p class="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3">{{ card.description }}</p>
              <div class="flex items-center gap-1 mt-1">
                <span class="text-xs font-bold text-gray-800">{{ card.rating }}</span>
                <div class="flex text-[#de5826]">
                  <span v-for="n in 5" :key="n" class="text-xs">
                    {{ n <= Math.floor(card.rating) ? '★' : n - card.rating < 1 ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-xs text-gray-400">({{ card.reviews.toLocaleString() }})</span>
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="tag in card.tags"
                  :key="tag"
                  class="text-[10px] text-gray-500 border border-gray-200 rounded-full px-2 py-0.5"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Natur -->
      <section class="px-8 py-12">
        <h2 class="text-3xl font-extrabold text-[#094b7b] text-center mb-2">Oplev naturens perler</h2>
        <p class="text-sm text-gray-500 text-center max-w-3xl mx-auto mb-8">Gå på opdagelse i Danmarks smukkeste landskaber, hvor naturen byder på ro, vidde og unikke oplevelser. Oplev alt fra imponerende udsigtspunkter og kyststrækninger til skove, søer og skjulte perler rundt i landet.</p>

        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="card in natureCards"
            :key="card.id"
            class="group rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <img :src="card.image" :alt="card.name" class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            <div class="p-3">
              <p class="text-sm font-semibold text-[#094b7b]">{{ card.name }}</p>
              <p class="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3">{{ card.description }}</p>
              <div class="flex items-center gap-1 mt-1">
                <span class="text-xs font-bold text-gray-800">{{ card.rating }}</span>
                <div class="flex text-[#de5826]">
                  <span v-for="n in 5" :key="n" class="text-xs">
                    {{ n <= Math.floor(card.rating) ? '★' : n - card.rating < 1 ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-xs text-gray-400">({{ card.reviews.toLocaleString() }})</span>
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="tag in card.tags"
                  :key="tag"
                  class="text-[10px] text-gray-500 border border-gray-200 rounded-full px-2 py-0.5"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Familie -->
      <section class="px-8 py-12">
        <h2 class="text-3xl font-extrabold text-[#094b7b] text-center mb-2">Eventyr for hele familien</h2>
        <p class="text-sm text-gray-500 text-center max-w-3xl mx-auto mb-8">Gå på opdagelse i sjove og mindeværdige oplevelser for både børn og voksne i hele Danmark. Oplev alt fra legende aktiviteter og spændende attraktioner til lærerige oplevelser og hyggelige stunder, hvor hele familien kan være med.</p>

        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="card in familyCards"
            :key="card.id"
            class="group rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <img :src="card.image" :alt="card.name" class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            <div class="p-3">
              <p class="text-sm font-semibold text-[#094b7b]">{{ card.name }}</p>
              <p class="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3">{{ card.description }}</p>
              <div class="flex items-center gap-1 mt-1">
                <span class="text-xs font-bold text-gray-800">{{ card.rating }}</span>
                <div class="flex text-[#de5826]">
                  <span v-for="n in 5" :key="n" class="text-xs">
                    {{ n <= Math.floor(card.rating) ? '★' : n - card.rating < 1 ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-xs text-gray-400">({{ card.reviews.toLocaleString() }})</span>
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="tag in card.tags"
                  :key="tag"
                  class="text-[10px] text-gray-500 border border-gray-200 rounded-full px-2 py-0.5"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const userLocation = ref('København')

// Placeholder card data
interface Card {
  id: number
  name: string
  description: string
  image: string
  rating: number
  reviews: number
  tags: string[]
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

const cityCards = ref<Card[]>([
  createCard(1, 'København', 'Udforsk kanaler, kultur og gastronomi i hjertet af hovedstaden.', ['Storby', 'Kultur', 'Mad']),
  createCard(2, 'Aarhus', 'Oplev moderne byliv med kunst, havnefront og hyggelige kvarterer.', ['Havn', 'Kultur', 'Shopping']),
  createCard(3, 'Odense', 'Gå i H.C. Andersens fodspor med historie, caféer og grønne områder.', ['Historie', 'Hygge', 'Museer']),
  createCard(4, 'Aalborg', 'Nyd fjordstemning, spændende arkitektur og et levende natteliv.', ['Natteliv', 'Fjord', 'Oplevelser']),
])

const nearbyCards = ref<Card[]>([
  createCard(31, 'Nyhavn', 'Farverige huse, hyggelige restauranter og klassisk københavnerstemning.', ['Lokalt', 'Havn', 'Mad']),
  createCard(32, 'Tivoli i centrum', 'En ikonisk forlystelseshave med lys, musik og oplevelser for alle.', ['Forlystelser', 'Byliv', 'Aften']),
  createCard(33, 'Torvehallerne', 'Smag på lokale specialiteter og street food fra hele verden.', ['Street food', 'Marked', 'Smag']),
  createCard(34, 'Christianshavn', 'Tag en rolig gåtur langs kanalerne og oplev områdets særlige charme.', ['Kanaler', 'Gåtur', 'Hygge']),
])

const natureCards = ref<Card[]>([
  createCard(11, 'Møns Klint', 'Hvide klinter og turkisblåt vand danner en af Danmarks flotteste udsigter.', ['Natur', 'Vandretur', 'Udsigt']),
  createCard(12, 'Nationalpark Thy', 'Vild vestkystnatur med klitter, hede og brede sandstrande.', ['Vild natur', 'Strand', 'Ro']),
  createCard(13, 'Rold Skov', 'Store skovområder med stier til både vandring, cykling og familiehygge.', ['Skov', 'Cykling', 'Familie']),
  createCard(14, 'Bornholms klipper', 'Rå klippekyster, små fiskerlejer og fantastisk udsigt over havet.', ['Ø', 'Klipper', 'Havudsigt']),
])

const familyCards = ref<Card[]>([
  createCard(21, 'Tivoli', 'Forlystelser, musik og magisk stemning midt i København.', ['Forlystelser', 'Byliv', 'Aften']),
  createCard(22, 'LEGOLAND', 'En hel dag med sjove temaområder, byggeleg og action for børn.', ['Børn', 'Aktiviteter', 'Heldagstur']),
  createCard(23, 'Den Blå Planet', 'Mød hajer, rokker og tropiske fisk i Nordeuropas største akvarium.', ['Akvarium', 'Læring', 'Indendørs']),
  createCard(24, 'Djurs Sommerland', 'Vandland og rutsjebaner giver fart, grin og familieeventyr.', ['Familie', 'Rutsjebaner', 'Sjov']),
])
</script>
