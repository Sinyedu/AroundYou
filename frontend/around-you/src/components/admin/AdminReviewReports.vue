<template>
  <section class="rounded-lg border border-slate-200 bg-white p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#de5826]">Anmeldelser</p>
        <h2 class="mt-2 text-xl font-black text-[#094b7b]">Rapporterede anmeldelser</h2>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex rounded-md border border-slate-200 bg-slate-50 p-1">
          <button
            v-for="tab in reportTabs"
            :key="tab.key"
            class="rounded px-3 py-1.5 text-sm font-black"
            :class="
              activeReportTab === tab.key
                ? 'bg-white text-[#094b7b] shadow-sm'
                : 'text-slate-500'
            "
            @click="setReportTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
        <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold" @click="loadReports">
          Opdater
        </button>
      </div>
    </div>

    <p v-if="errorMessage" class="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
      {{ errorMessage }}
    </p>

    <div v-if="isLoading" class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600">
      Henter rapporter...
    </div>
    <div v-else-if="!reports.length" class="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-600">
      {{
        activeReportTab === 'hidden'
          ? 'Der er ingen skjulte rapporterede anmeldelser.'
          : 'Der er ingen uløste anmeldelsesrapporter.'
      }}
    </div>
    <div v-else class="mt-4 grid gap-3">
      <article v-for="review in reports" :key="review._id" class="rounded-lg border border-slate-200 p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="text-sm font-bold text-rose-700">{{ review.reportCount }} rapporter</p>
            <div class="mt-1 flex flex-wrap items-center gap-2">
              <h3 class="font-black text-slate-900">{{ review.title }}</h3>
              <span
                v-if="review.isHidden"
                class="rounded-full bg-amber-100 px-2 py-1 text-xs font-black text-amber-800"
              >
                Skjult
              </span>
            </div>
            <p class="text-sm text-slate-500">
              {{ review.author }} · {{ review.targetType }} · {{ review.rating }}/5
            </p>
          </div>
          <div class="flex gap-2">
            <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold" @click="resolveReport(review._id)">
              Marker som løst
            </button>
            <button
              v-if="review.isHidden"
              class="rounded-md bg-emerald-600 px-3 py-2 text-sm font-black text-white"
              @click="restoreReview(review._id)"
            >
              Gendan
            </button>
            <button v-else class="rounded-md bg-rose-600 px-3 py-2 text-sm font-black text-white" @click="removeReview(review._id)">
              Skjul
            </button>
          </div>
        </div>
        <p class="mt-3 text-sm text-slate-700">{{ review.description }}</p>
        <ul class="mt-3 grid gap-2">
          <li v-for="report in review.reports" :key="`${report.reportedBy}-${report.createdAt}`" class="rounded-md bg-slate-50 p-3 text-sm">
            <span class="font-bold text-slate-800">{{ report.reason || 'Ingen begrundelse angivet' }}</span>
            <span class="text-slate-500">
              · {{ new Date(report.createdAt).toLocaleString('da-DK') }}
            </span>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  deleteReportedReview,
  fetchReportedReviews,
  resolveReviewReport,
  restoreReportedReview,
} from '@/api/admin.api'
import type { ReportedReview } from '@/types/admin'
import type { AdminVisibility } from '@/types/admin'

const reports = ref<ReportedReview[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const activeReportTab = ref<Extract<AdminVisibility, 'active' | 'hidden'>>('active')
const reportTabs: { key: Extract<AdminVisibility, 'active' | 'hidden'>; label: string }[] = [
  { key: 'active', label: 'Aktive rapporter' },
  { key: 'hidden', label: 'Skjulte' },
]

async function loadReports(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    reports.value = await fetchReportedReviews(activeReportTab.value)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Kunne ikke hente anmeldelsesrapporter.'
  } finally {
    isLoading.value = false
  }
}

function setReportTab(tab: Extract<AdminVisibility, 'active' | 'hidden'>): void {
  activeReportTab.value = tab
  void loadReports()
}

async function resolveReport(id: string): Promise<void> {
  errorMessage.value = ''

  try {
    await resolveReviewReport(id)
    reports.value = reports.value.filter((review) => review._id !== id)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Kunne ikke markere rapporten som løst.'
  }
}

async function removeReview(id: string): Promise<void> {
  const confirmed = window.confirm('Vil du skjule denne rapporterede anmeldelse?')
  if (!confirmed) return

  errorMessage.value = ''

  try {
    await deleteReportedReview(id)
    reports.value = reports.value.filter((review) => review._id !== id)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke skjule anmeldelsen.'
  }
}

async function restoreReview(id: string): Promise<void> {
  errorMessage.value = ''

  try {
    await restoreReportedReview(id)
    reports.value = reports.value.filter((review) => review._id !== id)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke gendanne anmeldelsen.'
  }
}

onMounted(() => {
  void loadReports()
})
</script>
