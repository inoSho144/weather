import type { ChartConfiguration } from 'chart.js'
import { Chart } from 'chart.js'
import type { Ref } from 'vue'
import type { JapanWeatherIn2hours } from '../weather'

export const useChart = (
  japanWeather: Ref<JapanWeatherIn2hours | undefined, JapanWeatherIn2hours | undefined>,
  chartCanvas: Ref<HTMLCanvasElement | null>,
) => {
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

  return { createChart }
}
