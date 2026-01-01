<template>
  <div class="custom-range-input">
    <h3>カスタム範囲を追加</h3>
    <div class="input-group">
      <el-time-picker
        v-model="customRange"
        is-range
        range-separator="〜"
        start-placeholder="開始時刻"
        end-placeholder="終了時刻"
        format="HH:mm"
      />
      <el-button
        type="success"
        @click="handleAdd"
        :disabled="!customRange || customRange.length !== 2"
      >
        追加
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TimeRange } from '../composable/use-time/types'

const customRange = ref<[Date, Date] | null>(null)

const emits = defineEmits<{
  add: [range: Omit<TimeRange, 'id'>]
}>()

const handleAdd = () => {
  if (!customRange.value || customRange.value.length !== 2) return

  const [start, end] = customRange.value

  emits('add', {
    label: `カスタム (${formatTime(start)} - ${formatTime(end)})`,
    start,
    end,
    isPreset: false,
  })

  // リセット
  customRange.value = null
}

const formatTime = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.custom-range-input {
  margin-bottom: 1.25rem;
}

h3 {
  font-size: 0.9375rem;
  margin-bottom: 0.75rem;
  color: #4a5568;
  font-weight: 600;
}

.input-group {
  display: flex;
  gap: 0.625rem;
  align-items: stretch;
}

.input-group :deep(.el-date-editor) {
  flex: 1;
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .input-group :deep(.el-button) {
    width: 100%;
  }
}

@media (max-width: 480px) {
  h3 {
    font-size: 0.875rem;
    margin-bottom: 0.625rem;
  }

  .input-group {
    gap: 0.5rem;
  }
}
</style>
