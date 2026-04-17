<template>
  <!-- Map background wrapper -->
  <div class="min-h-screen bg-[#e8e0d5] relative">
    <!-- Map background overlay (simulated) -->
    <div
      class="fixed inset-0 opacity-40 pointer-events-none"
      style="
        background-image: url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/10.2,56.15,6.0,0/1600x900@2x?access_token=placeholder');
        background-size: cover;
        background-position: center;
      "
    ></div>

    <!-- White content card -->
    <div class="relative z-10 max-w-5xl mx-auto bg-white shadow-xl min-h-screen">

      <!-- Explore Near You -->
      <section class="px-8 pb-10">
        <h2 class="text-base font-bold text-[#de5826] mb-1">
          Explore experiences near {{ nearbyCity }}
        </h2>
        <p class="text-xs text-gray-500 mb-4">Can't-miss picks near you</p>

        <!-- Carousel cards -->
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="card in featuredCards"
            :key="card.id"
            class="rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <img :src="card.image" :alt="card.name" class="w-full h-32 object-cover" />
            <div class="p-3">
              <p class="text-sm font-semibold text-[#094b7b]">{{ card.name }}</p>
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

        <!-- Pagination dots -->
        <div class="flex justify-center gap-2 mt-4">
          <button
            v-for="(_, idx) in 4"
            :key="idx"
            @click="activeDot = idx"
            :class="[
              'w-2.5 h-2.5 rounded-full transition-colors',
              activeDot === idx ? 'bg-[#de5826]' : 'bg-gray-300'
            ]"
          ></button>
        </div>
      </section>

      <!-- Noget nyt -->
      <section class="px-8 pb-12">
        <h2 class="text-2xl font-extrabold text-[#094b7b] text-center mb-8">Noget nyt</h2>

        <!-- City sections -->
        <div v-for="city in cities" :key="city.name" class="mb-10">
          <h3 class="text-base font-bold text-[#de5826] mb-4">{{ city.name }}</h3>
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="card in city.cards"
              :key="card.id"
              class="rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <img :src="card.image" :alt="card.name" class="w-full h-32 object-cover" />
              <div class="p-3">
                <p class="text-sm font-semibold text-[#094b7b]">{{ card.name }}</p>
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
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, logout, userName } = useAuth()

// Two-way bound search input
const searchQuery = ref('')
const activeDot = ref(1)
const nearbyCity = ref('København')

function handleSearch() {
  console.log('Søger efter:', searchQuery.value)
}

// Placeholder card data
interface Card {
  id: number
  name: string
  image: string
  rating: number
  reviews: number
  tags: string[]
}

const placeholderImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'

function makeCards(startId: number): Card[] {
  return Array.from({ length: 4 }, (_, i) => ({
    id: startId + i,
    name: 'Cafe bala',
    image: placeholderImage,
    rating: 4.5,
    reviews: 25784,
    tags: ['Familie', 'Mad', 'Udendørs'],
  }))
}

const featuredCards = ref<Card[]>(makeCards(1))

const cities = ref([
  { name: 'København', cards: makeCards(10) },
  { name: 'Aarhus', cards: makeCards(20) },
  { name: 'Odense', cards: makeCards(30) },
])
</script>
