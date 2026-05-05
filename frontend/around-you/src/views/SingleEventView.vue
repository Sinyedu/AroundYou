<template>
	<main class="min-h-screen bg-[#f5f7f9]">
		<div class="relative h-[50vh] min-h-[340px] w-full overflow-hidden md:h-[62vh] md:min-h-[480px]">
			<img :src="heroImage" :alt="displayEventName" class="h-full w-full object-cover object-center" />

			<div class="absolute inset-0 bg-gradient-to-b from-[#094b7b]/20 via-[#094b7b]/10 to-[#094b7b]/20"></div>
		</div>

		<div class="relative -mt-12 px-4 pb-8 md:-mt-20">
			<div
				class="mx-auto flex w-full max-w-3xl flex-col items-center rounded-2xl border border-[#C1D2DE]/70 bg-white px-6 py-8 text-center shadow-[0_18px_40px_rgba(9,75,123,0.12)] md:px-10 md:py-11"
			>
				<p v-if="eventLoading" class="rounded-full bg-[#C1D2DE]/35 px-4 py-1 text-sm font-semibold text-[#094b7b]">
					Henter eventdata...
				</p>

				<p v-else-if="eventError" class="rounded-full bg-[#de5826]/10 px-4 py-1 text-sm font-semibold text-[#de5826]">
					{{ eventError }}
				</p>

				<h1 class="text-5xl font-black tracking-tight text-[#094b7b] md:text-7xl">{{ displayEventName }}</h1>
			</div>
		</div>

		<div v-if="eventItem && !eventLoading" class="mx-auto mt-10 max-w-5xl space-y-10 px-4 pb-20 md:px-8">
			<div class="grid grid-cols-1 gap-20 md:grid-cols-[2fr_1fr]">
				<section>
					<h2 class="mb-3 text-lg font-bold text-[#de5826]">Om begivenheden</h2>
					<p class="text-sm leading-loose text-slate-600">{{ eventItem.description }}</p>
				</section>

				<section>
					<h2 class="mb-4 text-lg font-bold text-[#de5826]">Fakta</h2>
					<dl class="space-y-4">
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Startdato</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ formatDate(eventItem.startDate) }}</dd>
						</div>
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Slutdato</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ formatDate(eventItem.endDate) }}</dd>
						</div>
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Pris</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ formatPrice(eventItem.price) }}</dd>
						</div>
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Årlig begivenhed</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ eventItem.isAnnual ? 'Ja' : 'Nej' }}</dd>
						</div>
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Åbningstider</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ formatOpeningHours(eventItem.openingHours) }}</dd>
						</div>
						<div v-if="eventAddress">
							<dt class="text-sm font-bold text-[#094b7b]">Adresse</dt>
							<dd class="mt-0.5 text-sm text-slate-600">{{ eventAddress }}</dd>
						</div>
						<div>
							<dt class="text-sm font-bold text-[#094b7b]">Website</dt>
							<dd class="mt-0.5 text-sm text-slate-600">
								<a :href="eventItem.link" target="_blank" rel="noopener noreferrer" class="text-[#094b7b] underline underline-offset-2">
									{{ eventItem.link }}
								</a>
							</dd>
						</div>
					</dl>
				</section>
			</div>

			<ImageCarousel
				v-if="eventItem.imageArray?.length"
				:images="eventItem.imageArray"
				:alt="displayEventName"
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
				<ReviewSection :targetId="eventItem._id" targetType="event" @average-rating="reviewRating = $event" />
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getEventByIdentifier } from '@/api/attractions.api'
import ImageCarousel from '@/components/ImageCarousel.vue'
import ReviewSection from '@/components/ReviewSection.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import type { EventApiItem } from '@/types/event-api-item'

const defaultHeroImage =
	'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2200&q=80'

const route = useRoute()

const eventParam = computed(() => {
	const routeEvent = route.params.eventId ?? route.params.eventName ?? route.params.id
	return typeof routeEvent === 'string' ? routeEvent.trim() : ''
})

const eventSection = useAsyncData<EventApiItem | null>(() => getEventByIdentifier(eventParam.value), {
	defaultValue: null,
	getErrorMessage: () => 'Vi kunne ikke hente eventet fra databasen.',
})

watch(
	eventParam,
	() => {
		void eventSection.execute().catch((error) => {
			console.error('Fejl ved hentning af eventdata:', error)
		})
	},
	{ immediate: true },
)

const eventLoading = computed(() => eventSection.loading.value)
const eventError = computed(() => eventSection.error.value)

const eventItem = computed(() => eventSection.data.value)
const reviewRating = ref<number | null>(null)
const displayEventName = computed(() => eventItem.value?.name ?? '')

const heroImage = computed(() => eventSection.data.value?.heroImage ?? defaultHeroImage)

const eventAddress = ref<string | null>(null)

watch(
	() => eventItem.value?.gpsPosition,
	async (gpsPosition) => {
		eventAddress.value = null
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
			eventAddress.value = data.display_name ?? null
		} catch {
			// silently ignore geocoding errors
		}
	},
	{ immediate: true },
)

function formatDate(dateValue: string): string {
	const parsed = new Date(dateValue)
	if (Number.isNaN(parsed.getTime())) return 'Ikke angivet'

	return parsed.toLocaleDateString('da-DK', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	})
}

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


