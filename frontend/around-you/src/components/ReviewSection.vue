<template>
	<section aria-label="Anmeldelser">
		<h2 class="mb-6 text-lg font-bold text-[#de5826]">Anmeldelser</h2>

		<!-- Skriv review formular -->
		<div v-if="isAuthenticated" class="mb-8 rounded-2xl border border-[#C1D2DE]/70 bg-white p-6 shadow-sm">
			<h3 class="mb-4 text-base font-semibold text-[#094b7b]">Skriv en anmeldelse</h3>

			<form @submit.prevent="submitReview" class="space-y-4">
				<div>
					<label for="review-title" class="mb-1 block text-sm font-medium text-slate-700">Titel</label>
					<input
						id="review-title"
						v-model="form.title"
						type="text"
						required
						minlength="3"
						maxlength="255"
						placeholder="Kort titel for din oplevelse"
						class="w-full rounded-lg border border-[#C1D2DE] px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#094b7b] focus:ring-2 focus:ring-[#094b7b]/20"
					/>
				</div>

				<div>
					<label for="review-description" class="mb-1 block text-sm font-medium text-slate-700">Beskrivelse</label>
					<textarea
						id="review-description"
						v-model="form.description"
						required
						minlength="6"
						maxlength="1024"
						rows="4"
						placeholder="Beskriv din oplevelse..."
						class="w-full rounded-lg border border-[#C1D2DE] px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#094b7b] focus:ring-2 focus:ring-[#094b7b]/20"
					></textarea>
				</div>

				<div>
					<label class="mb-1 block text-sm font-medium text-slate-700">Bedømmelse</label>
					<div class="flex gap-1">
						<button
							v-for="star in 5"
							:key="star"
							type="button"
							@click="form.rating = star"
							:aria-label="`${star} stjerner`"
							class="text-2xl transition-transform hover:scale-110 focus:outline-none"
							:class="star <= form.rating ? 'text-[#de5826]' : 'text-slate-300'"
						>★</button>
					</div>
				</div>

				<div>
					<label for="review-image" class="mb-1 block text-sm font-medium text-slate-700">
						Billede-URL <span class="font-normal text-slate-400">(valgfrit)</span>
					</label>
					<input
						id="review-image"
						v-model="form.image"
						type="url"
						placeholder="https://..."
						class="w-full rounded-lg border border-[#C1D2DE] px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#094b7b] focus:ring-2 focus:ring-[#094b7b]/20"
					/>
				</div>

				<p v-if="submitError" class="text-sm text-[#de5826]">{{ submitError }}</p>

				<button
					type="submit"
					:disabled="submitting || form.rating === 0"
					class="rounded-full bg-[#094b7b] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#094b7b]/85 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{{ submitting ? 'Sender...' : 'Send anmeldelse' }}
				</button>
			</form>
		</div>

		<p v-else class="mb-8 rounded-xl bg-[#C1D2DE]/25 px-5 py-4 text-sm text-slate-500">
			<RouterLink to="/login" class="font-semibold text-[#094b7b] underline underline-offset-2">Log ind</RouterLink>
			for at skrive en anmeldelse.
		</p>

		<!-- Liste af reviews -->
		<div v-if="loading" class="text-sm text-slate-400">Henter anmeldelser...</div>

		<p v-else-if="fetchError" class="text-sm text-[#de5826]">{{ fetchError }}</p>

		<p v-else-if="reviews.length === 0" class="text-sm text-slate-400">
			Ingen anmeldelser endnu. Vær den første!
		</p>

		<ul v-else class="space-y-5">
			<li
				v-for="review in reviews"
				:key="review._id"
				class="rounded-2xl border border-[#C1D2DE]/70 bg-white p-6 shadow-sm"
			>
				<div class="mb-3 flex items-start justify-between gap-4">
					<div>
						<div class="flex items-center gap-2">
							<p class="text-sm font-semibold text-[#de5826]">{{ review.author }}</p>
							<span
								v-if="review.edited"
								class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400"
							>Redigeret</span>
						</div>
						<p class="text-xs text-slate-400">{{ formatDate(review.createdAt) }}</p>
					</div>
					<div class="flex items-center gap-3">
						<div class="flex shrink-0 text-[#de5826]">
							<span v-for="star in 5" :key="star" class="text-sm">
								{{ star <= review.rating ? '★' : '☆' }}
							</span>
						</div>
						<button
							v-if="isAuthenticated && review.author !== userName"
							@click="openReportModal(review)"
							type="button"
							class="text-xs text-slate-400 underline underline-offset-2"
							:class="isReviewReported(review._id) ? 'text-slate-300 cursor-not-allowed' : 'hover:text-[#094b7b]'"
							:disabled="isReviewReported(review._id)"
						>
							{{ isReviewReported(review._id) ? 'Anmeldt' : 'Anmeld' }}
						</button>
						<button
							v-if="review.author === userName"
							@click="startEdit(review)"
							type="button"
							class="text-xs text-slate-400 underline underline-offset-2 hover:text-[#094b7b]"
						>Rediger</button>
					</div>
				</div>

				<!-- Inline edit formular -->
				<form
					v-if="editingId === review._id"
					@submit.prevent="saveEdit(review._id)"
					class="mb-4 space-y-3 rounded-xl border border-[#C1D2DE]/60 bg-[#f5f7f9] p-4"
				>
					<div>
						<label :for="'edit-title-' + review._id" class="mb-1 block text-xs font-medium text-slate-600">Titel</label>
						<input
							:id="'edit-title-' + review._id"
							v-model="editForm.title"
							type="text"
							required
							class="w-full rounded-lg border border-[#C1D2DE] px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#094b7b] focus:ring-2 focus:ring-[#094b7b]/20"
						/>
					</div>
					<div>
						<label :for="'edit-desc-' + review._id" class="mb-1 block text-xs font-medium text-slate-600">Beskrivelse</label>
						<textarea
							:id="'edit-desc-' + review._id"
							v-model="editForm.description"
							required
							rows="3"
							class="w-full rounded-lg border border-[#C1D2DE] px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#094b7b] focus:ring-2 focus:ring-[#094b7b]/20"
						></textarea>
					</div>
					<div>
						<label class="mb-1 block text-xs font-medium text-slate-600">Bedømmelse</label>
						<div class="flex gap-1">
							<button
								v-for="star in 5"
								:key="star"
								type="button"
								@click="editForm.rating = star"
								:aria-label="`${star} stjerner`"
								class="text-xl transition-transform hover:scale-110 focus:outline-none"
								:class="star <= editForm.rating ? 'text-[#de5826]' : 'text-slate-300'"
							>★</button>
						</div>
					</div>
					<div>
						<label :for="'edit-image-' + review._id" class="mb-1 block text-xs font-medium text-slate-600">
							Billede-URL <span class="font-normal text-slate-400">(valgfrit)</span>
						</label>
						<input
							:id="'edit-image-' + review._id"
							v-model="editForm.image"
							type="url"
							placeholder="https://..."
							class="w-full rounded-lg border border-[#C1D2DE] px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#094b7b] focus:ring-2 focus:ring-[#094b7b]/20"
						/>
					</div>

					<p v-if="editError" class="text-xs text-[#de5826]">{{ editError }}</p>
					<div class="flex gap-2">
						<button
							type="submit"
							:disabled="editSaving"
							class="rounded-full bg-[#094b7b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#094b7b]/85 disabled:opacity-50"
						>{{ editSaving ? 'Gemmer...' : 'Gem' }}</button>
						<button
							type="button"
							@click="cancelEdit"
							class="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-500 transition hover:border-slate-300"
						>Annuller</button>
					</div>
				</form>

				<template v-else>
					<h4 class="mb-1 text-base font-semibold text-[#094b7b]">{{ review.title }}</h4>
					<p class="mb-4 text-sm leading-relaxed text-slate-600">{{ review.description }}</p>

					<img
						v-if="review.image"
						:src="review.image"
						:alt="review.title"
						class="mb-4 max-h-64 w-full rounded-xl object-cover"
					/>
				</template>

				<button
					@click="toggleLike(review)"
					:disabled="!isAuthenticated || likeLoading === review._id"
					:aria-label="hasLiked(review) ? 'Fjern like' : 'Sæt like'"
					class="flex items-center gap-1.5 text-sm transition focus:outline-none disabled:cursor-not-allowed"
					:class="hasLiked(review) ? 'text-[#de5826]' : 'text-slate-400 hover:text-[#de5826]'"
				>
					<span class="text-base">♥</span>
					<span>{{ review.likes }}</span>
				</button>
			</li>
		</ul>

		<div
			v-if="reportModalOpen && reportTargetReview"
			class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
			role="dialog"
			aria-modal="true"
		>
			<div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
				<div class="mb-4 flex items-start justify-between gap-3">
					<div>
						<h3 class="text-base font-semibold text-[#094b7b]">Anmeld review</h3>
						<p class="mt-1 text-xs text-slate-500">
							Du anmelder: <span class="font-medium text-slate-700">{{ reportTargetReview.title }}</span>
						</p>
					</div>
					<button
						type="button"
						@click="closeReportModal"
						class="text-sm text-slate-400 transition hover:text-slate-600"
						aria-label="Luk"
					>
						✕
					</button>
				</div>

				<form @submit.prevent="submitReport" class="space-y-4">
					<div>
						<label for="report-reason" class="mb-1 block text-sm font-medium text-slate-700">Årsag</label>
						<select
							id="report-reason"
							v-model="reportForm.reason"
							required
							class="w-full rounded-lg border border-[#C1D2DE] px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#094b7b] focus:ring-2 focus:ring-[#094b7b]/20"
						>
							<option value="">Vælg en årsag</option>
							<option value="upassende-sprog">Upassende sprog</option>
							<option value="chikane">Chikane eller hadefuldt indhold</option>
							<option value="spam">Spam eller reklame</option>
							<option value="andet">Andet</option>
						</select>
					</div>

					<div>
						<label for="report-details" class="mb-1 block text-sm font-medium text-slate-700">
							Beskriv kort problemet <span class="font-normal text-slate-400">(valgfrit)</span>
						</label>
						<textarea
							id="report-details"
							v-model="reportForm.details"
							maxlength="500"
							rows="4"
							placeholder="Skriv evt. hvorfor reviewet er upassende..."
							class="w-full rounded-lg border border-[#C1D2DE] px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#094b7b] focus:ring-2 focus:ring-[#094b7b]/20"
						></textarea>
					</div>

					<p v-if="reportError" class="text-sm text-[#de5826]">{{ reportError }}</p>

					<div class="flex items-center justify-end gap-2">
						<button
							type="button"
							@click="closeReportModal"
							class="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-500 transition hover:border-slate-300"
						>
							Annuller
						</button>
						<button
							type="submit"
							class="rounded-full bg-[#094b7b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#094b7b]/85"
						>
							Send anmeldelse
						</button>
					</div>
				</form>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { getStoredUserId } from '@/utils/auth'
import {
	getReviewsByTarget,
	createReview,
	likeReview,
	updateReview,
	type ReviewItem,
	type ReviewTargetType,
} from '@/api/reviews.api'

const props = defineProps<{
	targetId: string
	targetType: ReviewTargetType
}>()

const emit = defineEmits<{
	(e: 'averageRating', value: number | null): void
}>()

const { isAuthenticated, userName } = useAuth()

const reviews = ref<ReviewItem[]>([])
const loading = ref(false)
const fetchError = ref<string | null>(null)

const averageRating = computed(() => {
	if (reviews.value.length === 0) return null
	const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
	return sum / reviews.value.length
})

watch(averageRating, (val) => emit('averageRating', val), { immediate: true })

const form = ref({ title: '', description: '', rating: 0, image: '' })
const submitting = ref(false)
const submitError = ref<string | null>(null)

const likeLoading = ref<string | null>(null)

const editingId = ref<string | null>(null)
const editForm = ref({ title: '', description: '', rating: 0, image: '' })
const editSaving = ref(false)
const editError = ref<string | null>(null)

const reportModalOpen = ref(false)
const reportTargetReview = ref<ReviewItem | null>(null)
const reportForm = ref({ reason: '', details: '' })
const reportError = ref<string | null>(null)
const reportedReviewIds = ref<string[]>([])

function startEdit(review: ReviewItem) {
	editingId.value = review._id
	editForm.value = { title: review.title, description: review.description, rating: review.rating, image: review.image ?? '' }
	editError.value = null
}

function cancelEdit() {
	editingId.value = null
	editError.value = null
}

function isReviewReported(reviewId: string): boolean {
	return reportedReviewIds.value.includes(reviewId)
}

function openReportModal(review: ReviewItem) {
	if (isReviewReported(review._id)) return
	reportTargetReview.value = review
	reportForm.value = { reason: '', details: '' }
	reportError.value = null
	reportModalOpen.value = true
}

function closeReportModal() {
	reportModalOpen.value = false
	reportTargetReview.value = null
	reportError.value = null
}

function submitReport() {
	if (!reportTargetReview.value) return
	if (!reportForm.value.reason) {
		reportError.value = 'Vælg en årsag for anmeldelsen.'
		return
	}
	if (!reportedReviewIds.value.includes(reportTargetReview.value._id)) {
		reportedReviewIds.value.push(reportTargetReview.value._id)
	}
	closeReportModal()
}

async function saveEdit(reviewId: string) {
	editSaving.value = true
	editError.value = null
	try {
		const updated = await updateReview(reviewId, {
			title: editForm.value.title,
			description: editForm.value.description,
			rating: editForm.value.rating,
			image: editForm.value.image || undefined,
		})
		const index = reviews.value.findIndex((r) => r._id === reviewId)
		if (index !== -1) reviews.value[index] = updated
		editingId.value = null
	} catch (err) {
		editError.value = err instanceof Error ? err.message : 'Noget gik galt.'
	} finally {
		editSaving.value = false
	}
}

async function loadReviews() {
	loading.value = true
	fetchError.value = null
	try {
		reviews.value = await getReviewsByTarget(props.targetId)
	} catch {
		fetchError.value = 'Kunne ikke hente anmeldelser.'
	} finally {
		loading.value = false
	}
}

async function submitReview() {
	if (form.value.rating === 0) return
	submitting.value = true
	submitError.value = null
	try {
		const created = await createReview({
			targetId: props.targetId,
			targetType: props.targetType,
			author: userName.value,
			title: form.value.title,
			description: form.value.description,
			rating: form.value.rating,
			image: form.value.image || undefined,
		})
		reviews.value.unshift(created)
		form.value = { title: '', description: '', rating: 0, image: '' }
	} catch (err) {
		submitError.value = err instanceof Error ? err.message : 'Noget gik galt.'
	} finally {
		submitting.value = false
	}
}

function hasLiked(review: ReviewItem): boolean {
	const userId = getStoredUserId()
	return !!userId && review.likedBy.includes(userId)
}

async function toggleLike(review: ReviewItem) {
	const userId = getStoredUserId()
	if (!userId || likeLoading.value) return
	likeLoading.value = review._id
	try {
		const updated = await likeReview(review._id, userId)
		const index = reviews.value.findIndex((r) => r._id === review._id)
		if (index !== -1) reviews.value[index] = updated
	} finally {
		likeLoading.value = null
	}
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('da-DK', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}

onMounted(loadReviews)
</script>
