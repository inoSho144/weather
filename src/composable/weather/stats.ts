import type { JapanWeatherIn2hours } from './index'
import type { TimeRange } from '../use-time/types'

export interface WeatherStats {
  average: number
  max: number
  min: number
  dataPoints: number
}

export const calculateWeatherStats = (data: JapanWeatherIn2hours): WeatherStats => {
  const temps = data.hourly.temperature_2m
  if (!temps || temps.length === 0) {
    return { average: 0, max: 0, min: 0, dataPoints: 0 }
  }

  const tempArray = Array.from(temps)
  const sum = tempArray.reduce((acc, val) => acc + val, 0)

  return {
    average: Math.round((sum / tempArray.length) * 10) / 10,
    max: Math.round(Math.max(...tempArray) * 10) / 10,
    min: Math.round(Math.min(...tempArray) * 10) / 10,
    dataPoints: tempArray.length,
  }
}

export interface RangeStats {
  range: TimeRange
  stats: WeatherStats
}

export const calculateStatsForRanges = (
  weatherData: JapanWeatherIn2hours,
  timeRanges: TimeRange[],
  filterFunction: (data: JapanWeatherIn2hours, start: Date, end: Date) => JapanWeatherIn2hours
): RangeStats[] => {
  return timeRanges.map((range) => ({
    range,
    stats: calculateWeatherStats(filterFunction(weatherData, range.start, range.end)),
  }))
}
