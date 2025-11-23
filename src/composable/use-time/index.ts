import { computed } from 'vue'
import { ref } from 'vue'

export const useTime = () => {
  const today = new Date()

  // 今日の24時を計算
  const todayEnd = computed(() => new Date(today))
  todayEnd.value.setHours(23, 59, 59, 999)

  const selectedTime = ref<[Date, Date]>([today, todayEnd.value])

  return { selectedTime }
}
