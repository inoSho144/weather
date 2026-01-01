<template>
  <el-card class="weather-stats-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="range-label">{{ timeRange.label }}</span>
        <span class="time-range">
          {{ formatTime(timeRange.start) }} - {{ formatTime(timeRange.end) }}
        </span>
      </div>
    </template>
    <div class="stats-content">
      <div class="stat-item main-stat">
        <div class="stat-label">平均気温</div>
        <div class="stat-value">{{ stats.average }}°C</div>
      </div>
      <div class="stat-row">
        <div class="stat-item">
          <div class="stat-label">最高気温</div>
          <div class="stat-value small">{{ stats.max }}°C</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">最低気温</div>
          <div class="stat-value small">{{ stats.min }}°C</div>
        </div>
      </div>
      <div class="data-points">データ数: {{ stats.dataPoints }}時間分</div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { TimeRange } from '../composable/use-time/types'
import type { WeatherStats } from '../composable/weather/stats'

interface Props {
  timeRange: TimeRange
  stats: WeatherStats
}

defineProps<Props>()

const formatTime = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.weather-stats-card {
  min-width: 280px;
  height: 100%;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.range-label {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1e293b;
}

.time-range {
  font-size: 0.875rem;
  color: #64748b;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.main-stat {
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 10px;
  color: white;
}

.main-stat .stat-label {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  opacity: 0.95;
  font-weight: 500;
}

.main-stat .stat-value {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.375rem;
  font-weight: 500;
}

.stat-value.small {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e293b;
  line-height: 1;
}

.data-points {
  font-size: 0.75rem;
  color: #94a3b8;
  text-align: center;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 480px) {
  .range-label {
    font-size: 1rem;
  }

  .time-range {
    font-size: 0.8125rem;
  }

  .main-stat {
    padding: 0.875rem;
  }

  .main-stat .stat-value {
    font-size: 1.75rem;
  }

  .stat-value.small {
    font-size: 1.25rem;
  }

  .data-points {
    font-size: 0.6875rem;
  }
}
</style>
