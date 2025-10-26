import { ElMessage } from 'element-plus'
import { fetchWeatherApi } from 'openmeteo'
import { ref } from 'vue'
import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response'

const JapanLocation = {
  latitude: 35,
  longitude: 139,
  hourly: 'temperature_2m',
  timezone: 'Asia/Tokyo',
  forecast_days: 1,
}

interface JapanWeatherIn2hours {
  hourly: {
    time: Date[]
    temperature_2m: Float32Array<ArrayBuffer | SharedArrayBuffer> | null
  }
}

/**
 * 天気取得API
 * url: https://open-meteo.com/en/docs?timezone=Asia%2FTokyo&forecast_days=3&latitude=35&longitude=139#location_and_time
 */
export const useWeatherForecast = () => {
  const url = 'https://api.open-meteo.com/v1/forecast'
  const japanWeather = ref<JapanWeatherIn2hours>()
  const initWeather = async () => {
    try {
      const responses = await fetchWeatherApi(url, JapanLocation)
      // Process first location. Add a for-loop for multiple locations or weather models
      const response = responses[0]

      japanWeather.value = molding(response)
    } catch {
      ElMessage.error('天気の取得に失敗しました')
    }
  }

  const molding = (weather: WeatherApiResponse | undefined): JapanWeatherIn2hours => {
    if (weather === undefined) throw new Error('天気の値が存在しません')
    const hourly = weather.hourly()!
    const weatherData = {
      hourly: {
        time: [
          ...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()),
        ].map(
          (_, i) =>
            new Date(
              (Number(hourly.time()) + i * hourly.interval() + weather.utcOffsetSeconds()) * 1000,
            ),
        ),
        temperature_2m: hourly.variables(0)!.valuesArray(),
      },
    }
    return weatherData
  }

  return { japanWeather, initWeather }
}
