<template>
  <div class="rounded-xl border border-slate-200 px-4 py-3">
    <label class="mb-2 block text-sm font-semibold text-slate-700">{{ label }}</label>
    <input
      type="file"
      accept="image/png,image/jpeg,image/jpg,image/webp"
      capture="environment"
      class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#094b7b] file:px-3 file:py-2 file:font-semibold file:text-white"
      @change="emit('selected', $event)"
    />
    <p v-if="selectedFile" class="mt-2 break-all text-xs text-slate-600">
      Selected: {{ selectedFile.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    selectedFile: File | null
  }>(),
  {
    label: 'Hero image file',
  },
)

const emit = defineEmits<{
  selected: [event: Event]
}>()
</script>
