<template>
  <input
    v-model="form.name"
    class="rounded-xl border border-slate-200 px-4 py-3"
    placeholder="Name"
  />
  <CreateContentImageField
    :selected-file="heroImageFile"
    @selected="emit('hero-image-selected', $event)"
  />
  <input
    v-model="form.price"
    type="number"
    class="rounded-xl border border-slate-200 px-4 py-3"
    placeholder="Price"
  />
  <input
    v-model="form.link"
    class="rounded-xl border border-slate-200 px-4 py-3"
    placeholder="Link"
  />
  <input
    v-model="form.address"
    class="rounded-xl border border-slate-200 px-4 py-3"
    placeholder="Address"
  />
  <input
    v-model="form.city"
    class="rounded-xl border border-slate-200 px-4 py-3"
    placeholder="City"
  />
  <CreateContentImageListField
    input-id="attraction-additional-images"
    :files="imageArrayFiles"
    @selected="emit('image-array-selected', $event)"
    @remove="emit('remove-image-array-file', $event)"
  />
  <CategorySlugPicker
    v-model="form.slugArray"
    :options="categoryOptions"
    label="Categories"
    placeholder="Search or create category"
  />
  <input
    v-model="form.openingHoursText"
    class="rounded-xl border border-slate-200 px-4 py-3"
    placeholder="Opening hours (comma separated)"
  />
  <textarea
    v-model="form.description"
    rows="4"
    class="rounded-xl border border-slate-200 px-4 py-3 sm:col-span-2"
    placeholder="Description"
  ></textarea>
</template>

<script setup lang="ts">
import CategorySlugPicker from '@/components/CategorySlugPicker.vue'
import CreateContentImageField from './CreateContentImageField.vue'
import CreateContentImageListField from './CreateContentImageListField.vue'
import type { CreateAttractionForm } from '@/types/content/useCreateContent'

defineProps<{
  categoryOptions: string[]
  heroImageFile: File | null
  imageArrayFiles: File[]
}>()

const emit = defineEmits<{
  'hero-image-selected': [event: Event]
  'image-array-selected': [event: Event]
  'remove-image-array-file': [index: number]
}>()

const form = defineModel<CreateAttractionForm>({ required: true })
</script>
