<template>
  <div class="saved-locations-list" v-if="allLocations.length > 0">
    <h3>場所一覧</h3>
    <div class="locations-container">
      <el-button
        v-for="location in allLocations"
        :key="location.id"
        :type="isSelected(location.id) ? 'primary' : 'default'"
        @click="$emit('select', location)"
        class="location-item"
      >
        <span class="location-name">{{ location.name }}</span>
        <el-tag
          v-if="isCustom(location.id)"
          closable
          @close.stop="$emit('remove', location.id)"
          size="small"
          class="custom-tag"
        >
          カスタム
        </el-tag>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Location } from '../composable/use-location/types'

interface Props {
  allLocations: Location[]
  selectedLocationId?: string
}

const props = defineProps<Props>()

defineEmits<{
  select: [location: Location]
  remove: [id: string]
}>()

const isSelected = (id: string): boolean => {
  return props.selectedLocationId === id
}

const isCustom = (id: string): boolean => {
  return id.startsWith('custom-')
}
</script>

<style scoped>
.saved-locations-list {
  margin-bottom: 1rem;
}

h3 {
  font-size: 0.9375rem;
  margin-bottom: 0.75rem;
  color: #334155;
  font-weight: 600;
}

.locations-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
}

.location-name {
  font-size: 0.875rem;
}

.custom-tag {
  font-size: 0.75rem;
}

@media (max-width: 480px) {
  h3 {
    font-size: 0.875rem;
    margin-bottom: 0.625rem;
  }

  .locations-container {
    gap: 0.375rem;
  }

  .location-item {
    padding: 0.375rem 0.625rem;
    font-size: 0.8125rem;
  }

  .location-name {
    font-size: 0.8125rem;
  }
}
</style>
