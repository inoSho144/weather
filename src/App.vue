<template>
  <div class="weather-container">
    <div class="weather-chart">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div class="weather-data">
      <details>
        <summary>データを表示</summary>
        <div>
          <p><strong>時刻:</strong> {{ japanWeather?.hourly.time }}</p>
          <p><strong>気温:</strong> {{ japanWeather?.hourly.temperature_2m }}</p>
        </div>
      </details>
    </div>

    <button @click="reload">reload</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useWeatherForecast } from './composable/weather'
import { Chart, registerables } from 'chart.js'
import { useChart } from './composable/use-chart'

// Chart.jsの登録
Chart.register(...registerables)
const chartCanvas = ref<HTMLCanvasElement | null>(null)

const { japanWeather, initWeather, reload } = useWeatherForecast()

const { createChart } = useChart(japanWeather, chartCanvas)

// データが変更されたらチャートを再描画
watch(
  () => japanWeather.value,
  () => {
    createChart()
  },
  { deep: true },
)

onMounted(async () => {
  await initWeather()
  createChart()
})
</script>

<style scoped>
.weather-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.weather-chart {
  margin-bottom: 20px;
}

canvas {
  max-height: 400px;
}

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

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background 0.3s;
}

button:hover {
  background: #45a049;
}
</style>
