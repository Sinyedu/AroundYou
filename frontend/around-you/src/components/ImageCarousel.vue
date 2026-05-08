<template>
	<section v-if="hasCarousel" class="flex items-center gap-3 md:gap-4">
		<button
			type="button"
			class="shrink-0 rounded-full border border-[#C1D2DE] bg-white px-3 py-2 text-xl font-bold text-[#094b7b] shadow-sm transition hover:bg-[#094b7b]/5 disabled:cursor-not-allowed disabled:opacity-45"
			@click="previousCarousel"
			:disabled="!canSlideCarousel"
			aria-label="Forrige billeder"
		>
			‹
		</button>

		<div class="overflow-hidden min-w-0 flex-1">
			<div
				class="grid"
				:class="noTransition ? '' : 'transition-transform duration-700 ease-in-out'"
				:style="{
					gridAutoFlow: 'column',
					gridAutoColumns: `calc(100% / ${CAROUSEL_VISIBLE_COUNT})`,
					transform: `translateX(${trackTranslateX})`,
				}"
			>
				<figure
					v-for="(image, index) in loopedImages"
					:key="`${image}-${index}`"
					class="overflow-hidden rounded-2xl border border-[#C1D2DE]/70 bg-white shadow-sm"
				>
					<img
						:src="image"
						:alt="alt"
						class="h-56 w-full object-cover"
					/>
				</figure>
			</div>
		</div>

		<button
			type="button"
			class="shrink-0 rounded-full border border-[#C1D2DE] bg-white px-3 py-2 text-xl font-bold text-[#094b7b] shadow-sm transition hover:bg-[#094b7b]/5 disabled:cursor-not-allowed disabled:opacity-45"
			@click="nextCarouselManual"
			:disabled="!canSlideCarousel"
			aria-label="Næste billeder"
		>
			›
		</button>
	</section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
	images: string[]
	alt?: string
	intervalMs?: number
}>()

const CAROUSEL_VISIBLE_COUNT = 3
const CAROUSEL_INTERVAL_MS = computed(() => props.intervalMs ?? 3000)

const currentItemIndex = ref(0)
const noTransition = ref(false)
const isAnimating = ref(false)
let carouselInterval: ReturnType<typeof setInterval> | null = null

const carouselImages = computed(() => props.images.filter((img) => !!img.trim()))
const hasCarousel = computed(() => carouselImages.value.length >= CAROUSEL_VISIBLE_COUNT)
const canSlideCarousel = computed(() => carouselImages.value.length > CAROUSEL_VISIBLE_COUNT)

// Track: [clone last 3] + [all real] + [clone first 3] — seamless wrap in both directions
const loopedImages = computed(() => [
	...carouselImages.value.slice(-CAROUSEL_VISIBLE_COUNT),
	...carouselImages.value,
	...carouselImages.value.slice(0, CAROUSEL_VISIBLE_COUNT),
])

// Offset by CAROUSEL_VISIBLE_COUNT to account for prepended clones
const trackTranslateX = computed(() =>
	`-${((currentItemIndex.value + CAROUSEL_VISIBLE_COUNT) * 100) / CAROUSEL_VISIBLE_COUNT}%`
)

function advanceCarousel(direction: 1 | -1, resetAutoplay = false): void {
	if (!canSlideCarousel.value || isAnimating.value) return
	isAnimating.value = true
	currentItemIndex.value += direction

	const n = carouselImages.value.length
	const needsSnap = direction === 1 ? currentItemIndex.value >= n : currentItemIndex.value < 0

	setTimeout(() => {
		if (needsSnap) {
			noTransition.value = true
			currentItemIndex.value = direction === 1 ? 0 : n - 1
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					noTransition.value = false
				})
			})
		}
		isAnimating.value = false
		if (resetAutoplay) startCarouselAutoplay()
	}, 710)
}

function nextCarousel(): void {
	advanceCarousel(1)
}

function previousCarousel(): void {
	advanceCarousel(-1, true)
}

function nextCarouselManual(): void {
	advanceCarousel(1, true)
}

function stopCarouselAutoplay(): void {
	if (!carouselInterval) return
	clearInterval(carouselInterval)
	carouselInterval = null
}

function startCarouselAutoplay(): void {
	stopCarouselAutoplay()
	if (!canSlideCarousel.value) return
	carouselInterval = setInterval(() => {
		nextCarousel()
	}, CAROUSEL_INTERVAL_MS.value)
}

watch(
	() => props.images,
	() => {
		currentItemIndex.value = 0
		startCarouselAutoplay()
	},
	{ immediate: true },
)

onBeforeUnmount(() => {
	stopCarouselAutoplay()
})
</script>
