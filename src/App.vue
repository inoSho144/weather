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
import type { ChartConfiguration } from 'chart.js'

// Chart.jsの登録
Chart.register(...registerables)

const { japanWeather, initWeather } = useWeatherForecast()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const createChart = () => {
  if (!japanWeather.value?.hourly || !chartCanvas.value) return

  // 既存のチャートを破棄
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // 時刻データをフォーマット
  const labels = japanWeather.value.hourly.time.map((date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`
  })

  // データを number[] に明示的に変換
  const temperatureData = japanWeather.value.hourly.temperature_2m
  const temperatures: number[] = temperatureData ? Array.from(temperatureData) : []

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '気温 (°C)',
          data: temperatures,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: '日時',
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: '気温 (°C)',
          },
        },
      },
    },
  }

  chartInstance = new Chart(ctx, config)
}

const reload = async () => {
  await initWeather()
}

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
