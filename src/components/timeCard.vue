<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { format, getTimezoneOffset } from 'date-fns-tz'

const props = defineProps({
  timezone: { type: String, required: true },
  label: { type: String, required: true },
  clockStyle: { type: String as () => 'analog' | 'digital', default: 'digital' }
})

// Time calculations
const currentTime = ref(new Date())
const interval = ref<number>()

const formattedTime = computed(() => format(currentTime.value, 'HH:mm:ss', { timeZone: props.timezone }))
const formattedDate = computed(() => format(currentTime.value, 'EEEE, MMM d, yyyy', { timeZone: props.timezone }))

// Analog clock calculations
const hoursRotation = computed(() => {
  const hours = currentTime.value.getHours() % 12
  return (hours * 30) + (currentTime.value.getMinutes() * 0.5)
})

const minutesRotation = computed(() => currentTime.value.getMinutes() * 6)
const secondsRotation = computed(() => currentTime.value.getSeconds() * 6)

// Time difference calculation
const timeDifference = computed(() => {
  const localOffset = new Date().getTimezoneOffset()
  const targetOffset = getTimezoneOffset(props.timezone, currentTime.value) / 60 / 1000
  const diffMinutes = (targetOffset * 60) - localOffset
  const hours = Math.floor(Math.abs(diffMinutes) / 60)
  const minutes = Math.abs(diffMinutes) % 60
  return `${diffMinutes >= 0 ? '+' : '-'}${hours}h${minutes > 0 ? `${minutes}m` : ''}`
})

// Lifecycle hooks
onMounted(() => {
  interval.value = window.setInterval(() => currentTime.value = new Date(), 1000)
})

onBeforeUnmount(() => {
  clearInterval(interval.value)
})
</script>

<template>
  <div class="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg hover:shadow-xl transition-all">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ label }}</h3>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ timeDifference }}</span>
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400"></div>
      </div>
    </div>

    <!-- Clock Display -->
    <div v-if="clockStyle === 'digital'" class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
      {{ formattedTime }}
    </div>
    
    <div v-else class="relative w-full h-24 mb-1">
      <svg class="w-24 h-24" viewBox="0 0 100 100">
        <!-- Analog clock SVG elements -->
      </svg>
    </div>

    <!-- Date -->
    <div class="text-sm text-gray-600 dark:text-gray-400">{{ formattedDate }}</div>
  </div>
</template>