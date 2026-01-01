<template>
  <div class="location-selector">
    <SavedLocationsList
      :all-locations="allLocations"
      :selected-location-id="selectedLocationId"
      @select="handleSelect"
      @remove="handleRemove"
    />
    <CustomLocationInput @add="handleAddCustom" />
  </div>
</template>

<script setup lang="ts">
import SavedLocationsList from './SavedLocationsList.vue'
import CustomLocationInput from './CustomLocationInput.vue'
import type { Location } from '../composable/use-location/types'

interface Props {
  allLocations: Location[]
  selectedLocationId?: string
}

defineProps<Props>()

const emits = defineEmits<{
  selectLocation: [location: Location]
  addCustom: [location: Omit<Location, 'id'>]
  remove: [id: string]
}>()

const handleSelect = (location: Location) => {
  emits('selectLocation', location)
}

const handleAddCustom = (location: Omit<Location, 'id'>) => {
  emits('addCustom', location)
}

const handleRemove = (id: string) => {
  emits('remove', id)
}
</script>

<style scoped>
.location-selector {
  padding: 1.25rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .location-selector {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .location-selector {
    padding: 0.875rem;
  }
}
</style>
