<template>
  <div class="weather-data">
    <details>
      <summary>データを表示</summary>
      <div v-if="weatherData">
        <p><strong>時刻:</strong> {{ weatherData.hourly.time }}</p>
        <p><strong>気温:</strong> {{ weatherData.hourly.temperature_2m }}</p>
      </div>
      <div v-else>
        <p>データがありません</p>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import type { JapanWeatherIn2hours } from '../composable/weather'

interface Props {
  weatherData?: JapanWeatherIn2hours
}

defineProps<Props>()
</script>

<style scoped>
.weather-data {
  margin: 20px 0;
}

details {
  cursor: pointer;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
}

summary {
  font-weight: bold;
}
</style>
