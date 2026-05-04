<template>
	<main class="min-h-screen bg-[#f5f7f9]">
		<div class="relative h-[50vh] min-h-[340px] w-full overflow-hidden md:h-[62vh] md:min-h-[480px]">
			<img
				:src="heroImage"
				:alt="displayCityName"
				class="h-full w-full object-cover object-center"
			/>

			<div class="absolute inset-0 bg-gradient-to-b from-[#094b7b]/20 via-[#094b7b]/10 to-[#094b7b]/20"></div>
		</div>

		<div class="relative -mt-12 px-4 pb-8 md:-mt-20">
			<div
				class="mx-auto flex w-full max-w-3xl flex-col items-center rounded-2xl border border-[#C1D2DE]/70 bg-white px-6 py-8 text-center shadow-[0_18px_40px_rgba(9,75,123,0.12)] md:px-10 md:py-11"
			>
				<p
					v-if="cityLoading"
					class="rounded-full bg-[#C1D2DE]/35 px-4 py-1 text-sm font-semibold text-[#094b7b]"
				>
					Henter bydata...
				</p>

				<p
					v-else-if="cityError"
					class="rounded-full bg-[#de5826]/10 px-4 py-1 text-sm font-semibold text-[#de5826]"
				>
					{{ cityError }}
				</p>

				<h1 class="text-5xl font-black tracking-tight text-[#094b7b] md:text-7xl">{{ displayCityName }}</h1>

			</div>
		</div>

		<div v-if="city && !cityLoading" class="mx-auto max-w-5xl px-4 pb-20 md:px-8 mt-10 space-y-10">

			<div class="grid grid-cols-1 gap-20 md:grid-cols-[2fr_1fr]">

				<section>
					<h2 class="mb-3 text-lg font-bold text-[#de5826]">Om byen</h2>
					<p class="text-sm leading-loose text-slate-600">{{ city.description }}</p>
				</section>

				<section>
					<h2 class="mb-4 text-lg font-bold text-[#de5826]">Fakta</h2>
					<dl class="space-y-4">
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Kommune</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ city.commune }}</dd>
						</div>
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Region</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ city.region }}</dd>
						</div>
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Land</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ city.country }}</dd>
						</div>
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Befolkning</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ city.population.toLocaleString('da-DK') }} indbyggere</dd>
						</div>
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Visitor Center</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ city.visitorCenter }}</dd>
						</div>
					</dl>
				</section>

			</div>

			<div class="border-t border-[#C1D2DE]/60 pt-6 flex items-center gap-3">
				<span class="text-2xl font-black text-[#094b7b]">
					{{ reviewRating !== null ? reviewRating.toFixed(1) : '–' }}
				</span>
				<div class="flex text-[#de5826]">
					<span v-for="starIndex in 5" :key="starIndex" class="text-lg">
						{{ reviewRating !== null
							? (starIndex <= Math.floor(reviewRating) ? '★' : starIndex - reviewRating < 1 ? '★' : '☆')
							: '☆' }}
					</span>
				</div>
				<span class="text-xs text-slate-400 uppercase tracking-wide">Bedømmelse</span>
			</div>

			<div class="border-t border-[#C1D2DE]/60 pt-8">
				<ReviewSection :targetId="city._id" targetType="city" @average-rating="reviewRating = $event" />
			</div>

		</div>
	</main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCityByName } from '@/api/attractions.api'
import { useAsyncData } from '@/composables/useAsyncData'
import type { CityApiItem } from '@/types/attractions'
import ReviewSection from '@/components/ReviewSection.vue'

const defaultHeroImage =
	'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=2200&q=80'

const route = useRoute()

const cityParam = computed(() => {
	const routeCity = route.params.cityName
	return typeof routeCity === 'string' ? routeCity.trim() : ''
})

const citySection = useAsyncData<CityApiItem | null>(
	() => getCityByName(cityParam.value),
	{
		defaultValue: null,
		getErrorMessage: () => 'Vi kunne ikke hente byen fra databasen.',
	},
)

watch(
	cityParam,
	() => {
		void citySection.execute().catch((error: unknown) => {
			console.error('Fejl ved hentning af bydata:', error)
		})
	},
	{ immediate: true },
)

const cityLoading = computed(() => citySection.loading.value)
const cityError = computed(() => citySection.error.value)

const city = computed(() => citySection.data.value)
const reviewRating = ref<number | null>(null)
const displayCityName = computed(() => city.value?.name ?? '')

const heroImage = computed(() => citySection.data.value?.heroImage ?? defaultHeroImage)



</script>

