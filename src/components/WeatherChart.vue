<template>
  <div class="weather-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import type { ChartConfiguration } from 'chart.js'
import type { JapanWeatherIn2hours } from '../composable/weather'
import type { TimeRange } from '../composable/use-time/types'

// Chart.jsの登録
Chart.register(...registerables, annotationPlugin)

interface Props {
  weatherData?: JapanWeatherIn2hours
  timeRanges?: TimeRange[]
  highlightMode?: 'background' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  highlightMode: 'none',
})
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

  // アノテーション (範囲ハイライト) の設定
  const annotations: any = {}
  if (props.highlightMode === 'background' && props.timeRanges) {
    props.timeRanges.forEach((range, index) => {
      annotations[`range-${index}`] = {
        type: 'box',
        xMin: formatDateForChart(range.start),
        xMax: formatDateForChart(range.end),
        backgroundColor: getColorForIndex(index, 0.1),
        borderColor: getColorForIndex(index, 0.3),
        borderWidth: 1,
        label: {
          display: true,
          content: range.label,
          position: 'start',
        },
      }
    })
  }

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
        annotation: {
          annotations: annotations,
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

const formatDateForChart = (date: Date): string => {
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`
}

const getColorForIndex = (index: number, alpha: number): string => {
  const colors: [number, number, number][] = [
    [255, 99, 132], // 赤系
    [54, 162, 235], // 青系
    [255, 206, 86], // 黄色系
    [75, 192, 192], // 緑系
    [153, 102, 255], // 紫系
  ]
  const color = colors[index % colors.length]!
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`
}

// propsの変更を監視してチャートを更新
watch(
  () => [props.weatherData, props.timeRanges, props.highlightMode],
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
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

canvas {
  max-height: 400px;
}
</style>
