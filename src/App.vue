<template>
  <div class="app-wrapper">
    <!-- ヘッダー -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">
          <span class="title-icon">🌤️</span>
          天気予報
        </h1>
        <button @click="handleReload" class="reload-button" title="データを更新">
          <span class="reload-icon">🔄</span>
        </button>
      </div>
    </header>

    <main class="main-content">
      <!-- 時間帯選択セクション -->
      <section class="section">
        <TimeRangeSelector
          :model-value="timeRanges"
          @toggle-preset="handleTogglePreset"
          @add-custom="handleAddCustom"
          @remove="handleRemove"
        />
      </section>

      <!-- 全体統計カード（最優先） -->
      <section class="section" v-if="overallStats && timeRanges.length > 0">
        <h2 class="section-title">📊 選択時間帯の気温</h2>
        <div class="overall-stats">
          <el-card class="overall-stats-card" shadow="hover">
            <div class="stats-content">
              <div class="stat-item main-stat">
                <div class="stat-label">平均気温</div>
                <div class="stat-value">{{ overallStats.average }}°C</div>
              </div>
              <div class="stat-row">
                <div class="stat-item">
                  <div class="stat-label">最高</div>
                  <div class="stat-value small">{{ overallStats.max }}°C</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">最低</div>
                  <div class="stat-value small">{{ overallStats.min }}°C</div>
                </div>
              </div>
              <div class="data-points">
                {{ timeRanges.length }}個の時間帯 • {{ overallStats.dataPoints }}時間分のデータ
              </div>
            </div>
          </el-card>
        </div>
      </section>

      <!-- 個別の時間帯統計カード -->
      <section class="section" v-if="rangeStats.length > 0">
        <h2 class="section-title">📋 時間帯別の詳細</h2>
        <div class="stats-grid">
          <WeatherStatsCard
            v-for="stat in rangeStats"
            :key="stat.range.id"
            :time-range="stat.range"
            :stats="stat.stats"
          />
        </div>
      </section>

      <!-- グラフセクション（折りたたみ可能） -->
      <section class="section chart-section">
        <details class="chart-details" :open="isChartOpen">
          <summary class="chart-summary" @click.prevent="toggleChart">
            <span class="summary-text">
              <span class="summary-icon">📈</span>
              気温グラフ
            </span>
            <span class="toggle-icon">{{ isChartOpen ? '▲' : '▼' }}</span>
          </summary>
          <div class="chart-content">
            <WeatherChart :weather-data="japanWeather" :time-ranges="timeRanges" />
          </div>
        </details>
      </section>

      <!-- デバッグ情報（折りたたみ） -->
      <section class="section debug-section">
        <WeatherDataDetails :weather-data="japanWeather" />
      </section>
    </main>

    <!-- フッター -->
    <footer class="app-footer">
      <p class="footer-text">天気データ提供: Open-Meteo API</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { watchEffect, computed, ref } from 'vue'
import { useWeatherForecastWithRanges } from './composable/weather'
import { useTimeRanges, type TimeRange } from './composable/use-time'
import { calculateStatsForRanges, calculateWeatherStats } from './composable/weather/stats'
import TimeRangeSelector from './components/TimeRangeSelector.vue'
import WeatherChart from './components/WeatherChart.vue'
import WeatherStatsCard from './components/WeatherStatsCard.vue'
import WeatherDataDetails from './components/WeatherDataDetails.vue'

const { timeRanges, togglePreset, addTimeRange, removeTimeRange } = useTimeRanges()

const { japanWeather, rawWeatherData, initWeather } = useWeatherForecastWithRanges(timeRanges)

// グラフの表示状態
const isChartOpen = ref(false)

const toggleChart = () => {
  isChartOpen.value = !isChartOpen.value
}

// timeRangesが変更されたら自動的にデータを再取得
watchEffect(async () => {
  await initWeather()
})

// 統計データの計算
const rangeStats = computed(() => {
  if (!rawWeatherData.value || timeRanges.value.length === 0) {
    return []
  }

  return calculateStatsForRanges(rawWeatherData.value, timeRanges.value, (data, start, end) => {
    // filterBySelectedTime の簡易実装
    const filteredTime: Date[] = []
    const filteredTemperature: number[] = []

    if (!data.hourly.temperature_2m) return data

    data.hourly.time.forEach((time, index) => {
      if (time >= start && time <= end) {
        filteredTime.push(time)
        filteredTemperature.push(data.hourly.temperature_2m![index] ?? 0)
      }
    })

    return {
      hourly: {
        time: filteredTime,
        temperature_2m: new Float32Array(filteredTemperature),
      },
    }
  })
})

// 選択した全時間帯の統計を計算
const overallStats = computed(() => {
  if (!japanWeather.value || timeRanges.value.length === 0) {
    return null
  }

  return calculateWeatherStats(japanWeather.value)
})

const handleTogglePreset = (presetName: string) => {
  togglePreset(presetName)
}

const handleAddCustom = (range: Omit<TimeRange, 'id'>) => {
  addTimeRange(range)
}

const handleRemove = (id: string) => {
  removeTimeRange(id)
}

const handleReload = async () => {
  await initWeather()
}
</script>

<style scoped>
/* ============================================
   アプリ全体のレイアウト
   ============================================ */
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #f0f4f8 0%, #e2e8f0 100%);
}

/* ============================================
   ヘッダー
   ============================================ */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.75rem;
}

.reload-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 1.25rem;
}

.reload-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(180deg);
}

.reload-button:active {
  transform: rotate(180deg) scale(0.95);
}

/* ============================================
   メインコンテンツ
   ============================================ */
.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
}

.section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2d3748;
  margin: 0 0 1rem 0;
  padding-left: 0.5rem;
  border-left: 4px solid #667eea;
}

/* ============================================
   全体統計カード
   ============================================ */
.overall-stats {
  margin: 0;
}

.overall-stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.overall-stats-card .stats-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
}

.overall-stats-card .stat-item {
  text-align: center;
}

.overall-stats-card .main-stat {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
}

.overall-stats-card .main-stat .stat-label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  opacity: 0.95;
  font-weight: 500;
}

.overall-stats-card .main-stat .stat-value {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
}

.overall-stats-card .stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.overall-stats-card .stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.overall-stats-card .stat-value.small {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  line-height: 1;
}

.overall-stats-card .data-points {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* ============================================
   個別統計グリッド
   ============================================ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

/* ============================================
   グラフセクション（折りたたみ）
   ============================================ */
.chart-section {
  margin-top: 2rem;
}

.chart-details {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-summary {
  padding: 1rem 1.25rem;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  transition: background 0.2s ease;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  list-style: none;
}

.chart-summary::-webkit-details-marker {
  display: none;
}

.chart-summary:hover {
  background: #f7fafc;
}

.summary-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-icon {
  font-size: 1.25rem;
}

.toggle-icon {
  color: #667eea;
  font-size: 0.875rem;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.chart-content {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* ============================================
   デバッグセクション
   ============================================ */
.debug-section {
  margin-top: 2rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.debug-section:hover {
  opacity: 1;
}

/* ============================================
   フッター
   ============================================ */
.app-footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem;
  text-align: center;
  margin-top: auto;
}

.footer-text {
  margin: 0;
  font-size: 0.875rem;
  color: #718096;
}

/* ============================================
   レスポンシブ対応
   ============================================ */

/* タブレット以下 */
@media (max-width: 768px) {
  .header-content {
    padding: 0.75rem 1rem;
  }

  .app-title {
    font-size: 1.25rem;
  }

  .title-icon {
    font-size: 1.5rem;
  }

  .reload-button {
    width: 40px;
    height: 40px;
    font-size: 1.125rem;
  }

  .main-content {
    padding: 0.75rem;
  }

  .section {
    margin-bottom: 1rem;
  }

  .section-title {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }

  .overall-stats-card .main-stat .stat-value {
    font-size: 2.5rem;
  }

  .overall-stats-card .stat-value.small {
    font-size: 1.75rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .chart-section {
    margin-top: 1.5rem;
  }

  .debug-section {
    margin-top: 1.5rem;
  }
}

/* スマートフォン */
@media (max-width: 480px) {
  .header-content {
    padding: 0.5rem 0.75rem;
  }

  .app-title {
    font-size: 1.125rem;
  }

  .title-icon {
    font-size: 1.375rem;
  }

  .reload-button {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .main-content {
    padding: 0.5rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .overall-stats-card .main-stat {
    padding: 1rem;
  }

  .overall-stats-card .main-stat .stat-value {
    font-size: 2rem;
  }

  .overall-stats-card .stat-value.small {
    font-size: 1.5rem;
  }

  .chart-summary {
    padding: 0.875rem 1rem;
    font-size: 0.9375rem;
  }

  .app-footer {
    padding: 1rem;
  }

  .footer-text {
    font-size: 0.8125rem;
  }
}

/* 大画面用の最適化 */
@media (min-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}
</style>
