import type { LocationPreset } from './types'

export const LOCATION_PRESETS: LocationPreset[] = [
  {
    name: 'tokyo',
    label: '東京',
    latitude: 35.6762,
    longitude: 139.6503,
    emoji: '🗼',
  },
  {
    name: 'kanagawa',
    label: '神奈川',
    latitude: 35.4437,
    longitude: 139.6380,
    emoji: '🌊',
  },
]

export const createLocationFromPreset = (
  preset: LocationPreset,
  id?: string
): import('./types').Location => {
  return {
    id: id || `${preset.name}-${Date.now()}`,
    name: preset.label,
    latitude: preset.latitude,
    longitude: preset.longitude,
  }
}
