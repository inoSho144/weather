<template>
  <div class="time-range-selector">
    <PresetButtons :selected-presets="selectedPresetNames" @toggle="handlePresetToggle" />
    <CustomRangeInput @add="handleCustomRangeAdd" />
    <SelectedRangesList :ranges="modelValue" @remove="handleRemove" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TimeRange } from '../composable/use-time/types'
import PresetButtons from './PresetButtons.vue'
import CustomRangeInput from './CustomRangeInput.vue'
import SelectedRangesList from './SelectedRangesList.vue'

interface Props {
  modelValue: TimeRange[]
}

const props = defineProps<Props>()

const emits = defineEmits<{
  'togglePreset': [presetName: string]
  'addCustom': [range: Omit<TimeRange, 'id'>]
  'remove': [id: string]
}>()

const selectedPresetNames = computed(() => {
  return props.modelValue
    .filter((r) => r.isPreset && r.presetName)
    .map((r) => r.presetName!)
})

const handlePresetToggle = (presetName: string) => {
  emits('togglePreset', presetName)
}

const handleCustomRangeAdd = (range: Omit<TimeRange, 'id'>) => {
  emits('addCustom', range)
}

const handleRemove = (id: string) => {
  emits('remove', id)
}
</script>

<style scoped>
.time-range-selector {
  padding: 1.25rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .time-range-selector {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .time-range-selector {
    padding: 0.875rem;
  }
}
</style>
