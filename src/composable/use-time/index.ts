import { computed, ref } from 'vue'
import type { TimeRange } from './types'
import { TIME_PRESETS, createTimeRangeFromPreset } from './presets'

export const useTime = () => {
  const today = new Date()

  // 今日の24時を計算
  const todayEnd = computed(() => new Date(today))
  todayEnd.value.setHours(23, 59, 59, 999)

  const selectedTime = ref<[Date, Date]>([today, todayEnd.value])

  return { selectedTime }
}

export const useTimeRanges = () => {
  // デフォルトで「朝」の時間帯を選択
  const morningPreset = TIME_PRESETS.find((p) => p.name === 'morning')
  const initialRanges: TimeRange[] = morningPreset ? [createTimeRangeFromPreset(morningPreset)] : []
  const timeRanges = ref<TimeRange[]>(initialRanges)

  const addTimeRange = (range: Omit<TimeRange, 'id'>) => {
    const newRange: TimeRange = {
      ...range,
      id: `range-${Date.now()}-${Math.random()}`,
    }
    timeRanges.value.push(newRange)
  }

  const removeTimeRange = (id: string) => {
    timeRanges.value = timeRanges.value.filter((r) => r.id !== id)
  }

  const clearAllRanges = () => {
    timeRanges.value = []
  }

  const togglePreset = (presetName: string) => {
    const existingIndex = timeRanges.value.findIndex(
      (r) => r.isPreset && r.presetName === presetName
    )

    if (existingIndex >= 0) {
      // 既に選択されている場合は削除
      timeRanges.value.splice(existingIndex, 1)
    } else {
      // 未選択の場合は追加
      const preset = TIME_PRESETS.find((p) => p.name === presetName)
      if (preset) {
        const range = createTimeRangeFromPreset(preset)
        timeRanges.value.push(range)
      }
    }
  }

  const isPresetSelected = (presetName: string): boolean => {
    return timeRanges.value.some((r) => r.isPreset && r.presetName === presetName)
  }

  return {
    timeRanges,
    addTimeRange,
    removeTimeRange,
    clearAllRanges,
    togglePreset,
    isPresetSelected,
  }
}

export * from './types'
export * from './presets'
