<template>
  <div class="preset-buttons">
    <h3>プリセット選択</h3>
    <div class="button-group">
      <el-button
        v-for="preset in TIME_PRESETS"
        :key="preset.name"
        :type="isSelected(preset.name) ? 'primary' : 'default'"
        @click="$emit('toggle', preset.name)"
        class="preset-btn"
      >
        <span class="emoji">{{ preset.emoji }}</span>
        {{ preset.label }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TIME_PRESETS } from '../composable/use-time/presets'

interface Props {
  selectedPresets: string[]
}

const props = defineProps<Props>()

defineEmits<{
  toggle: [presetName: string]
}>()

const isSelected = (name: string) => {
  return props.selectedPresets.includes(name)
}
</script>

<style scoped>
.preset-buttons {
  margin-bottom: 1.25rem;
}

h3 {
  font-size: 0.9375rem;
  margin-bottom: 0.75rem;
  color: #334155;
  font-weight: 600;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.preset-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.9375rem;
}

.emoji {
  font-size: 1.125rem;
}

@media (max-width: 480px) {
  h3 {
    font-size: 0.875rem;
    margin-bottom: 0.625rem;
  }

  .button-group {
    gap: 0.5rem;
  }

  .preset-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
    flex: 1 1 calc(50% - 0.25rem);
    min-width: 0;
    justify-content: center;
  }

  .emoji {
    font-size: 1rem;
  }
}
</style>
