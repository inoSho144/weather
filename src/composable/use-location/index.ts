import { ref } from 'vue'
import type { Location, LocationPreset } from './types'
import { LOCATION_PRESETS, createLocationFromPreset } from './presets'

// デフォルトは東京
const DEFAULT_LOCATION: Location = {
  id: 'tokyo-default',
  name: '東京',
  latitude: 35.6762,
  longitude: 139.6503,
}

export const useLocation = () => {
  const currentLocation = ref<Location>(DEFAULT_LOCATION)
  const customLocations = ref<Location[]>([])

  const setLocationFromPreset = (presetName: string) => {
    const preset = LOCATION_PRESETS.find((p) => p.name === presetName)
    if (preset) {
      currentLocation.value = createLocationFromPreset(preset)
    }
  }

  const addCustomLocation = (location: Omit<Location, 'id'>) => {
    const newLocation: Location = {
      id: `custom-${Date.now()}`,
      ...location,
    }
    customLocations.value.push(newLocation)
    currentLocation.value = newLocation
    return newLocation
  }

  const removeCustomLocation = (id: string) => {
    customLocations.value = customLocations.value.filter((loc) => loc.id !== id)
    // 削除した場所が現在選択中の場合はデフォルトに戻す
    if (currentLocation.value.id === id) {
      currentLocation.value = DEFAULT_LOCATION
    }
  }

  const setLocation = (location: Location) => {
    currentLocation.value = location
  }

  return {
    currentLocation,
    customLocations,
    setLocationFromPreset,
    addCustomLocation,
    removeCustomLocation,
    setLocation,
  }
}

export { LOCATION_PRESETS }
export type { Location, LocationPreset }
