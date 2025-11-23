<template>
  <div class="weather-container">
    <TimeSelector v-model="selectedTime" />
    <WeatherChart :weather-data="japanWeather" />
    <WeatherDataDetails :weather-data="japanWeather" />
    <button @click="handleReload">reload</button>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useWeatherForecast } from './composable/weather'
import { useTime } from './composable/use-time'
import TimeSelector from './components/TimeSelector.vue'
import WeatherChart from './components/WeatherChart.vue'
import WeatherDataDetails from './components/WeatherDataDetails.vue'

const { selectedTime } = useTime()
const { japanWeather, initWeather } = useWeatherForecast(selectedTime)

// selectedTimeが変更されたら自動的にデータを再取得
watchEffect(async () => {
  await initWeather()
})

const handleReload = async () => {
  await initWeather()
}
</script>

<style scoped>
.weather-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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
