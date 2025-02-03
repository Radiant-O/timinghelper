<script setup lang="ts">
import { ref, computed } from 'vue'
import { format, getTimezoneOffset } from 'date-fns-tz'

const props = defineProps({
  baseTimezone: String,
  compareTimezone: String
})

const currentTime = ref(new Date())
setInterval(() => currentTime.value = new Date(), 1000)

const timeData = computed(() => ({
  base: {
    time: format(currentTime.value, 'HH:mm:ss', { timeZone: props.baseTimezone }),
    date: format(currentTime.value, 'EEEE, MMM d', { timeZone: props.baseTimezone })
  },
  compare: {
    time: format(currentTime.value, 'HH:mm:ss', { timeZone: props.compareTimezone }),
    date: format(currentTime.value, 'EEEE, MMM d', { timeZone: props.compareTimezone })
  },
  difference: (() => {
    if (!props.baseTimezone || !props.compareTimezone) return ''
    const baseOffset = getTimezoneOffset(props.baseTimezone, currentTime.value)
    const compareOffset = getTimezoneOffset(props.compareTimezone, currentTime.value)
    const diffHours = (compareOffset - baseOffset) / (1000 * 60 * 60)
    return `${diffHours >= 0 ? '+' : ''}${diffHours.toFixed(1)} hours`
  })()
}))
</script>

<template>
  <div class="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg">
    <div class="grid grid-cols-2 gap-4 mb-3">
      <!-- Base Timezone -->
      <div class="text-center p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
        <div class="text-sm font-medium text-blue-600 dark:text-blue-300 mb-1">
          {{ baseTimezone?.split('/')[1] }}
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ timeData.base.time }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ timeData.base.date }}
        </div>
      </div>

      <!-- Compare Timezone -->
      <div class="text-center p-3 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg">
        <div class="text-sm font-medium text-purple-600 dark:text-purple-300 mb-1">
          {{ compareTimezone?.split('/')[1] }}
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ timeData.compare.time }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ timeData.compare.date }}
        </div>
      </div>
    </div>

    <!-- Difference Display -->
    <div class="text-center text-sm font-semibold text-purple-500 dark:text-purple-400">
      ⏳ Difference: {{ timeData.difference }}
    </div>
  </div>
</template>