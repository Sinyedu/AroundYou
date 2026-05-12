<template>
  <CardComponent :card="card" variant="search" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import { toSearchResultCard } from '@/composables/search/searchView.helpers'
import type { SearchResult } from '@/types/search'

const props = defineProps<{
  result: SearchResult
}>()

const card = computed(() => toSearchResultCard(props.result))
</script>
