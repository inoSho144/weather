import { ElMessage } from 'element-plus'
import { fetchWeatherApi } from 'openmeteo'
import { ref } from 'vue'
import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response'
import type { Ref } from 'vue'
import type { TimeRange } from '../use-time/types'

const JapanLocation = {
  latitude: 35,
  longitude: 139,
  hourly: 'temperature_2m',
  timezone: 'Asia/Tokyo',
  forecast_days: 1,
}

export interface JapanWeatherIn2hours {
  hourly: {
    time: Date[]
    temperature_2m: Float32Array<ArrayBuffer | SharedArrayBuffer> | null
  }
}

/**
 * 天気取得API
 * url: https://open-meteo.com/en/docs?timezone=Asia%2FTokyo&forecast_days=3&latitude=35&longitude=139#location_and_time
 */
export const useWeatherForecast = (selectedTime?: Ref<[Date, Date]>) => {
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
        // time 配列を作成
        // - 長さは $N = \dfrac{Number(hourly.timeEnd()) - Number(hourly.time())}{hourly.interval()}$ で計算
        // - Array(...) に spread を使うことで未定義要素の配列を作り、map の index を利用して各時刻を生成している
        time: [
          ...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()),
        ].map((_, i) => new Date((Number(hourly.time()) + i * hourly.interval()) * 1000)),
        // temperature_2m: hourly から変数の配列を取得
        // - hourly.variables(0) は nullable 型の可能性があるため `!` で非nullアサーションしている
        // - valuesArray() が実際の数値配列を返す想定
        temperature_2m: hourly.variables(0)!.valuesArray(),
      },
    }

    if (selectedTime?.value) {
      return filterBySelectedTime(weatherData, selectedTime)
    }

    return weatherData
  }

  const filterBySelectedTime = (
    weatherData: JapanWeatherIn2hours,
    selectedTime: Ref<[Date, Date]>,
  ): JapanWeatherIn2hours => {
    const [startTime, endTime] = selectedTime.value
    const filteredTime: Date[] = []
    const filteredTemperature: number[] = []

    if (!weatherData.hourly.temperature_2m) {
      throw new Error('天気データの温度情報が存在しません')
    }

    weatherData.hourly.time.forEach((time, index) => {
      if (time >= startTime && time <= endTime) {
        filteredTime.push(time)
        filteredTemperature.push(weatherData.hourly.temperature_2m![index] ?? 0)
      }
    })

    return {
      hourly: {
        time: filteredTime,
        temperature_2m: new Float32Array(filteredTemperature),
      },
    }
  }

  const reload = async () => {
    await initWeather()
  }

  return { japanWeather, initWeather, reload }
}

export const filterByMultipleTimeRanges = (
  weatherData: JapanWeatherIn2hours,
  timeRanges: TimeRange[]
): JapanWeatherIn2hours => {
  const filteredTime: Date[] = []
  const filteredTemperature: number[] = []

  if (!weatherData.hourly.temperature_2m) {
    throw new Error('天気データの温度情報が存在しません')
  }

  weatherData.hourly.time.forEach((time, index) => {
    const isInRange = timeRanges.some((range) => time >= range.start && time <= range.end)
    if (isInRange) {
      filteredTime.push(time)
      filteredTemperature.push(weatherData.hourly.temperature_2m![index] ?? 0)
    }
  })

  return {
    hourly: {
      time: filteredTime,
      temperature_2m: new Float32Array(filteredTemperature),
    },
  }
}

export const useWeatherForecastWithRanges = (timeRanges?: Ref<TimeRange[]>) => {
  const url = 'https://api.open-meteo.com/v1/forecast'
  const japanWeather = ref<JapanWeatherIn2hours>()
  const rawWeatherData = ref<JapanWeatherIn2hours>()

  const initWeather = async () => {
    try {
      const responses = await fetchWeatherApi(url, JapanLocation)
      const response = responses[0]
      const moldedData = moldingRaw(response)

      rawWeatherData.value = moldedData

      if (timeRanges?.value && timeRanges.value.length > 0) {
        japanWeather.value = filterByMultipleTimeRanges(moldedData, timeRanges.value)
      } else {
        japanWeather.value = moldedData
      }
    } catch {
      ElMessage.error('天気の取得に失敗しました')
    }
  }

  const moldingRaw = (weather: WeatherApiResponse | undefined): JapanWeatherIn2hours => {
    if (weather === undefined) throw new Error('天気の値が存在しません')
    const hourly = weather.hourly()!
    return {
      hourly: {
        time: [
          ...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()),
        ].map((_, i) => new Date((Number(hourly.time()) + i * hourly.interval()) * 1000)),
        temperature_2m: hourly.variables(0)!.valuesArray(),
      },
    }
  }

  const reload = async () => {
    await initWeather()
  }

  return { japanWeather, rawWeatherData, initWeather, reload }
}
