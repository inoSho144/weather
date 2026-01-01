<template>
  <div class="custom-location-input">
    <h3>カスタム場所を追加</h3>
    <div class="button-group">
      <el-button type="primary" @click="openMapDialog" class="map-button">
        <span class="button-icon">🗺️</span>
        地図から選択
      </el-button>
    </div>

    <MapLocationPicker
      v-model="showMapDialog"
      @confirm="handleMapConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapLocationPicker from './MapLocationPicker.vue'
import type { Location } from '../composable/use-location/types'

const showMapDialog = ref(false)

const emits = defineEmits<{
  add: [location: Omit<Location, 'id'>]
}>()

const openMapDialog = () => {
  showMapDialog.value = true
}

const handleMapConfirm = (location: Omit<Location, 'id'>) => {
  emits('add', location)
}
</script>

<style scoped>
.custom-location-input {
  margin-bottom: 1rem;
}

h3 {
  font-size: 0.9375rem;
  margin-bottom: 0.75rem;
  color: #4a5568;
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.map-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.625rem 1rem;
}

.button-icon {
  font-size: 1.125rem;
}

@media (max-width: 480px) {
  h3 {
    font-size: 0.875rem;
    margin-bottom: 0.625rem;
  }

  .map-button {
    font-size: 0.8125rem;
    padding: 0.5rem 0.875rem;
  }

  .button-icon {
    font-size: 1rem;
  }
}
</style>
