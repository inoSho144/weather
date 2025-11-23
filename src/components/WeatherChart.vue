<template>
  <div class="weather-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import type { ChartConfiguration } from 'chart.js'
import type { JapanWeatherIn2hours } from '../composable/weather'

// Chart.jsの登録
Chart.register(...registerables)

interface Props {
  weatherData?: JapanWeatherIn2hours
}

const props = defineProps<Props>()
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const createChart = () => {
  if (!props.weatherData?.hourly || !chartCanvas.value) return

  // 既存のチャートを破棄
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // 時刻データをフォーマット
  const labels = props.weatherData.hourly.time.map((date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`
  })

  // データを number[] に明示的に変換
  const temperatureData = props.weatherData.hourly.temperature_2m
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

// propsの変更を監視してチャートを更新
watch(
  () => props.weatherData,
  () => {
    createChart()
  },
  { deep: true, immediate: true }
)

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.weather-chart {
  margin-bottom: 20px;
}

canvas {
  max-height: 400px;
}
</style>
