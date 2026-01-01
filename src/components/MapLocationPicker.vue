<template>
  <el-dialog
    v-model="dialogVisible"
    title="地図から場所を選択"
    width="90%"
    :close-on-click-modal="false"
    class="map-dialog"
  >
    <div class="map-container">
      <div class="instructions">
        <p>📍 地図上をクリックして場所を選択してください</p>
      </div>
      <div ref="mapElement" class="map" id="location-map"></div>
      <div class="location-info" v-if="selectedLocation">
        <h4>選択中の場所</h4>
        <div class="info-row">
          <span class="label">緯度:</span>
          <span class="value">{{ selectedLocation.latitude.toFixed(4) }}</span>
        </div>
        <div class="info-row">
          <span class="label">経度:</span>
          <span class="value">{{ selectedLocation.longitude.toFixed(4) }}</span>
        </div>
        <el-input
          v-model="locationName"
          placeholder="場所の名前を入力してください（例: 横浜駅）"
          class="name-input"
        />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">キャンセル</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :disabled="!selectedLocation || !locationName.trim()"
        >
          この場所を追加
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Props {
  modelValue: boolean
}

interface SelectedLocation {
  latitude: number
  longitude: number
}

const props = defineProps<Props>()

const emits = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [location: { name: string; latitude: number; longitude: number }]
}>()

const dialogVisible = ref(props.modelValue)
const mapElement = ref<HTMLElement | null>(null)
const selectedLocation = ref<SelectedLocation | null>(null)
const locationName = ref('')

let map: L.Map | null = null
let marker: L.Marker | null = null

// ダイアログの表示状態を監視
watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal
    if (newVal && !map) {
      // ダイアログが開いたときに地図を初期化
      setTimeout(() => {
        initMap()
      }, 100)
    }
  }
)

watch(dialogVisible, (newVal) => {
  emits('update:modelValue', newVal)
})

const initMap = () => {
  if (!mapElement.value || map) return

  // デフォルトは東京を中心に表示
  const defaultCenter: [number, number] = [35.6762, 139.6503]

  map = L.map('location-map').setView(defaultCenter, 10)

  // OpenStreetMapのタイルレイヤーを追加
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map)

  // マーカーのデフォルトアイコンを設定
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  // 地図クリックイベント
  map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng

    selectedLocation.value = {
      latitude: lat,
      longitude: lng,
    }

    // 既存のマーカーを削除
    if (marker) {
      marker.remove()
    }

    // 新しいマーカーを追加
    marker = L.marker([lat, lng]).addTo(map!)
  })
}

const handleClose = () => {
  dialogVisible.value = false
  selectedLocation.value = null
  locationName.value = ''
  if (marker) {
    marker.remove()
    marker = null
  }
}

const handleConfirm = () => {
  if (!selectedLocation.value || !locationName.value.trim()) return

  emits('confirm', {
    name: locationName.value.trim(),
    latitude: selectedLocation.value.latitude,
    longitude: selectedLocation.value.longitude,
  })

  handleClose()
}

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.instructions {
  padding: 0.75rem;
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
  border-radius: 4px;
}

.instructions p {
  margin: 0;
  color: #1e40af;
  font-size: 0.9375rem;
  font-weight: 500;
}

.map {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.location-info {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.location-info h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: #374151;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.info-row:last-of-type {
  border-bottom: none;
  margin-bottom: 0.75rem;
}

.info-row .label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;
}

.info-row .value {
  font-family: 'Courier New', monospace;
  color: #111827;
  font-size: 0.875rem;
}

.name-input {
  margin-top: 0.5rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .map {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .map {
    height: 250px;
  }

  .instructions p {
    font-size: 0.875rem;
  }
}
</style>

<style>
/* Leafletのグローバルスタイル修正 */
.map-dialog .el-dialog__body {
  padding: 1rem 1.25rem;
}

.leaflet-container {
  font-family: inherit;
}
</style>
