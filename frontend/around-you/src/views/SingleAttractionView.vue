<template>
	<main class="min-h-screen bg-[#f5f7f9]">
		<div class="relative h-[50vh] min-h-[340px] w-full overflow-hidden md:h-[62vh] md:min-h-[480px]">
			<img :src="heroImage" :alt="displayAttractionName" class="h-full w-full object-cover object-center" />
			<div class="absolute inset-0 bg-gradient-to-b from-[#094b7b]/20 via-[#094b7b]/10 to-[#094b7b]/20"></div>
		</div>

		<div class="relative -mt-12 px-4 pb-8 md:-mt-20">
			<div
				class="mx-auto flex w-full max-w-3xl flex-col items-center rounded-2xl border border-[#C1D2DE]/70 bg-white px-6 py-8 text-center shadow-[0_18px_40px_rgba(9,75,123,0.12)] md:px-10 md:py-11"
			>
				<p v-if="attractionLoading" class="rounded-full bg-[#C1D2DE]/35 px-4 py-1 text-sm font-semibold text-[#094b7b]">
					Henter attraktion...
				</p>

				<p v-else-if="attractionError" class="rounded-full bg-[#de5826]/10 px-4 py-1 text-sm font-semibold text-[#de5826]">
					{{ attractionError }}
				</p>

				<h1 class="text-5xl font-black tracking-tight text-[#094b7b] md:text-7xl">{{ displayAttractionName }}</h1>
			</div>
		</div>

		<div v-if="attraction && !attractionLoading" class="mx-auto mt-10 max-w-5xl space-y-10 px-4 pb-20 md:px-8">
			<div class="grid grid-cols-1 gap-20 md:grid-cols-[2fr_1fr]">
				<section>
					<h2 class="mb-3 text-lg font-bold text-[#de5826]">Om attraktionen</h2>
					<p class="text-sm leading-loose text-slate-600">{{ attraction.description }}</p>
				</section>

				<section>
					<h2 class="mb-4 text-lg font-bold text-[#de5826]">Fakta</h2>
					<dl class="space-y-4">
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Pris</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ formatPrice(attraction.price) }}</dd>
						</div>
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Åbningstider</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ formatOpeningHours(attraction.openingHours) }}</dd>
						</div>
						<div v-if="attractionAddress">
							<dt class="text-sm font-bold text-[#094b7b]">Adresse</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ attractionAddress }}</dd>
						</div>
						<div v-if="attraction.link">
							<dt class="text-sm font-bold text-[#094b7b]">Website</dt>
							<dd class="mt-0.5 text-sm text-slate-600">
								<a :href="attraction.link" target="_blank" rel="noopener noreferrer" class="text-[#094b7b] underline underline-offset-2">
									{{ attraction.link }}
								</a>
							</dd>
						</div>
					</dl>
				</section>
			</div>

			<ImageCarousel
				v-if="attraction.imageArray?.length"
				:images="attraction.imageArray"
				:alt="displayAttractionName"
			/>

			<div class="flex items-center gap-3 border-t border-[#C1D2DE]/60 pt-6">
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
				<span class="text-xs uppercase tracking-wide text-slate-400">Bedømmelse</span>
			</div>

			<div class="border-t border-[#C1D2DE]/60 pt-8">
				<ReviewSection :targetId="attraction._id" targetType="attraction" @average-rating="reviewRating = $event" />
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getAttractionByIdentifier } from '@/api/attractions.api'
import ImageCarousel from '@/components/ImageCarousel.vue'
import ReviewSection from '@/components/ReviewSection.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import type { AttractionApiItem } from '@/types/attraction-api-item'

const defaultHeroImage =
	'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=2200&q=80'

const route = useRoute()

const attractionParam = computed(() => {
	const routeAttraction = route.params.attractionId
	return typeof routeAttraction === 'string' ? routeAttraction.trim() : ''
})

const attractionSection = useAsyncData<AttractionApiItem | null>(
	() => getAttractionByIdentifier(attractionParam.value),
	{
		defaultValue: null,
		getErrorMessage: () => 'Vi kunne ikke hente attraktionen fra databasen.',
	},
)

watch(
	attractionParam,
	() => {
		void attractionSection.execute().catch((error) => {
			console.error('Fejl ved hentning af attraktion:', error)
		})
	},
	{ immediate: true },
)

const attractionLoading = computed(() => attractionSection.loading.value)
const attractionError = computed(() => attractionSection.error.value)

const attraction = computed(() => attractionSection.data.value)
const reviewRating = ref<number | null>(null)
const displayAttractionName = computed(() => attraction.value?.name ?? '')

const heroImage = computed(() => attractionSection.data.value?.heroImage ?? defaultHeroImage)

const attractionAddress = ref<string | null>(null)

watch(
	() => attraction.value?.gpsPosition,
	async (gpsPosition) => {
		attractionAddress.value = null
		if (!gpsPosition?.trim()) return

		const [latRaw, lngRaw] = gpsPosition.split(',')
		const lat = parseFloat(latRaw ?? '')
		const lng = parseFloat(lngRaw ?? '')
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
				{ headers: { 'Accept-Language': 'da' } },
			)
			if (!res.ok) return
			const data = await res.json() as { display_name?: string }
			attractionAddress.value = data.display_name ?? null
		} catch {
			// silently ignore geocoding errors
		}
	},
	{ immediate: true },
)

function formatPrice(price: number): string {
	return price === 0
		? 'Gratis'
		: `${price.toLocaleString('da-DK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} kr.`
}

function formatOpeningHours(hours: string[]): string {
	if (!hours || hours.length === 0) return 'Ikke angivet'
	return hours.join(', ')
}
</script>
