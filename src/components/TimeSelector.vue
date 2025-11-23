<template>
  <div class="weather-condition">
    <el-time-picker
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      is-range
      range-separator="To"
      start-placeholder="Start time"
      end-placeholder="End time"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: [Date, Date]
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: [Date, Date]]
}>()
</script>

<style scoped>
.weather-condition {
  margin-bottom: 20px;
}
</style>
