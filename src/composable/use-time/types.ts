export interface TimeRange {
  id: string // 一意識別子
  label: string // 表示名 ("🌅 朝", "カスタム" など)
  start: Date
  end: Date
  isPreset: boolean // プリセットかカスタムか
  presetName?: string // プリセットの場合の名前
}

export interface TimePreset {
  name: string // 'morning', 'noon' など
  label: string // '朝', '昼' など
  emoji: string // '🌅', '☀️' など
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
}
