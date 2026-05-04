<template>
	<main class="min-h-screen bg-[#f5f7f9]">
		<section class="relative h-[50vh] min-h-[340px] w-full overflow-hidden md:h-[62vh] md:min-h-[480px]">
			<img
				:src="heroImage"
				:alt="displayCityName"
				class="h-full w-full object-cover object-center"
			/>

			<div class="absolute inset-0 bg-gradient-to-b from-[#094b7b]/20 via-[#094b7b]/10 to-[#094b7b]/20"></div>

			<nav
				aria-label="Brødkrumme"
				class="absolute left-4 top-5 z-10 flex items-center gap-2 text-xs font-medium text-white drop-shadow md:left-8 md:top-7 md:text-base"
			>
				<span>Destinationer</span>
				<span class="text-[10px] text-[#de5826] md:text-xs">■</span>
				<span class="text-[#C1D2DE]">{{ displayCityName }}</span>
			</nav>
		</section>

		<section class="relative -mt-12 px-4 pb-16 md:-mt-20">
			<article
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

				<h1 class="text-5xl font-black tracking-tight text-[#111827] md:text-7xl">{{ displayCityName }}</h1>

				<p class="mt-4 inline-flex items-center gap-1.5 text-base font-semibold text-[#094b7b]">
					<svg
						viewBox="0 0 24 24"
						aria-hidden="true"
						class="h-4 w-4 shrink-0 fill-[#de5826] md:h-[18px] md:w-[18px]"
					>
						<path
							d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
						/>
					</svg>
					{{ cityLocationLabel }}
				</p>

				<p class="mt-1 text-[15px] text-slate-600">{{ cityDescription }}</p>
			</article>
		</section>
	</main>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCityByName } from '@/api/attractions.api'
import { useAsyncData } from '@/composables/useAsyncData'
import type { CityApiItem } from '@/types/attractions'

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
		void citySection.execute().catch((error) => {
			console.error('Fejl ved hentning af bydata:', error)
		})
	},
	{ immediate: true },
)

const cityLoading = computed(() => citySection.loading.value)
const cityError = computed(() => citySection.error.value)

const displayCityName = computed(() => citySection.data.value?.name ?? '')

const heroImage = computed(() => citySection.data.value?.heroImage ?? defaultHeroImage)

const cityLocationLabel = computed(() => {
	if (citySection.data.value?.visitorCenter) {
		return citySection.data.value.visitorCenter
	}

	if (citySection.data.value?.commune) {
		return citySection.data.value.commune
	}

	return 'Bymidten'
})

const cityDescription = computed(() => {
	if (citySection.data.value?.description) {
		return citySection.data.value.description
	}

	return 'Bybeskrivelse er ikke tilgængelig endnu.'
})
</script>

