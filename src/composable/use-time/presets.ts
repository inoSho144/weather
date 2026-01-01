import type { TimePreset, TimeRange } from './types'

export const TIME_PRESETS: TimePreset[] = [
  {
    name: 'morning',
    label: '朝',
    emoji: '🌅',
    startHour: 6,
    startMinute: 0,
    endHour: 9,
    endMinute: 0,
  },
  {
    name: 'noon',
    label: '昼',
    emoji: '☀️',
    startHour: 12,
    startMinute: 0,
    endHour: 14,
    endMinute: 0,
  },
  {
    name: 'evening',
    label: '夕方',
    emoji: '🌆',
    startHour: 17,
    startMinute: 0,
    endHour: 19,
    endMinute: 0,
  },
  {
    name: 'night',
    label: '夜',
    emoji: '🌙',
    startHour: 20,
    startMinute: 0,
    endHour: 23,
    endMinute: 59,
  },
  {
    name: 'allday',
    label: '終日',
    emoji: '🌍',
    startHour: 0,
    startMinute: 0,
    endHour: 23,
    endMinute: 59,
  },
]

export const createTimeRangeFromPreset = (
  preset: TimePreset,
  baseDate: Date = new Date()
): TimeRange => {
  const start = new Date(baseDate)
  start.setHours(preset.startHour, preset.startMinute, 0, 0)

  const end = new Date(baseDate)
  end.setHours(preset.endHour, preset.endMinute, 59, 999)

  return {
    id: `preset-${preset.name}-${Date.now()}`,
    label: `${preset.emoji} ${preset.label}`,
    start,
    end,
    isPreset: true,
    presetName: preset.name,
  }
}
