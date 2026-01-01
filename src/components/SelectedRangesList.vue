<template>
  <div class="selected-ranges-list" v-if="ranges.length > 0">
    <h3>選択中の時間範囲</h3>
    <div class="ranges-container">
      <el-tag
        v-for="range in ranges"
        :key="range.id"
        closable
        @close="$emit('remove', range.id)"
        size="large"
        class="range-tag"
      >
        {{ range.label }}
        <span class="time-text">
          ({{ formatTime(range.start) }} - {{ formatTime(range.end) }})
        </span>
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimeRange } from '../composable/use-time/types'

interface Props {
  ranges: TimeRange[]
}

defineProps<Props>()

defineEmits<{
  remove: [id: string]
}>()

const formatTime = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.selected-ranges-list {
  margin-bottom: 1.25rem;
}

h3 {
  font-size: 0.9375rem;
  margin-bottom: 0.75rem;
  color: #4a5568;
  font-weight: 600;
}

.ranges-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.range-tag {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.time-text {
  margin-left: 0.375rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

@media (max-width: 480px) {
  h3 {
    font-size: 0.875rem;
    margin-bottom: 0.625rem;
  }

  .ranges-container {
    gap: 0.375rem;
  }

  .range-tag {
    padding: 0.375rem 0.625rem;
    font-size: 0.8125rem;
    width: 100%;
    justify-content: space-between;
  }

  .time-text {
    font-size: 0.6875rem;
  }
}
</style>
