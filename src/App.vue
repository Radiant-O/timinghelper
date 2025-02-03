<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import TimeCard from './components/timeCard.vue'
import TimeSearch from './components/timeSearch.vue'
import TimeComparator from './components/timeComparator.vue'

interface TimezoneConfig {
  label: string
  zone: string
  code: string
}

// State Management
const timezones = ref<TimezoneConfig[]>([])
const darkMode = ref(false)
const clockStyle = ref<'analog' | 'digital'>('digital')
const showComparator = ref(false)

// Initial Timezones
const defaultTimezones: TimezoneConfig[] = [
{ label: 'New York', zone: 'America/New_York', code: 'US' },
  { label: 'Los Angeles', zone: 'America/Los_Angeles', code: 'US' },
  { label: 'Chicago', zone: 'America/Chicago', code: 'US' },
  { label: 'Denver', zone: 'America/Denver', code: 'US' },
  { label: 'Phoenix', zone: 'America/Phoenix', code: 'US' },
  { label: 'Anchorage', zone: 'America/Anchorage', code: 'US' },
  { label: 'Honolulu', zone: 'Pacific/Honolulu', code: 'US' },
  
  // International
  { label: 'London', zone: 'Europe/London', code: 'UK' },
  { label: 'Beijing', zone: 'Asia/Shanghai', code: 'CN' },
  { label: 'Lagos', zone: 'Africa/Lagos', code: 'NG' },
  { label: 'Tokyo', zone: 'Asia/Tokyo', code: 'JP' },
  { label: 'Berlin', zone: 'Europe/Berlin', code: 'DE' },
  { label: 'Paris', zone: 'Europe/Paris', code: 'FR' },
  { label: 'Sydney', zone: 'Australia/Sydney', code: 'AU' }
]

// Message handling
const messageListener = (message: any) => {
  if (message.action === 'focusSearch') {
    const searchInput = document.querySelector<HTMLInputElement>(
      'input[placeholder="Add timezone..."]'
    )
    searchInput?.focus()
  }
  if (message.action === 'darkModeChange') {
    darkMode.value = message.value
    document.documentElement.classList.toggle('dark', message.value)
  }
  if (message.action === 'clockStyleChange') {
    clockStyle.value = message.value
  }
}

// Storage handling
const loadStorage = async () => {
  try {
    const storage = await chrome.storage.local.get([
      'timezoneOrder', 
      'darkMode', 
      'clockStyle'
    ])
    
    timezones.value = storage.timezoneOrder?.length 
      ? storage.timezoneOrder.map((zone: string) => 
          defaultTimezones.find(t => t.zone === zone) || 
          { label: zone.split('/')[1], zone, code: '?' }
        )
      : defaultTimezones

    darkMode.value = storage.darkMode ?? false
    clockStyle.value = storage.clockStyle ?? 'digital'
    document.documentElement.classList.toggle('dark', darkMode.value)
  } catch (error) {
    console.error('Storage load error:', error)
    timezones.value = defaultTimezones
  }
}

// Lifecycle hooks
onMounted(() => {
  if (chrome?.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener(messageListener)
  }
  if (chrome?.storage?.local) {
    loadStorage()
  } else {
    timezones.value = defaultTimezones
  }
})

onUnmounted(() => {
  if (chrome?.runtime?.onMessage) {
    chrome.runtime.onMessage.removeListener(messageListener)
  }
})

const handleDragEnd = () => {
  if (chrome?.storage?.local) {
    chrome.storage.local.set({ 
      timezoneOrder: timezones.value.map(t => t.zone) 
    })
  }
}

// Toggle dark mode
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
  if (chrome?.storage?.local) {
    chrome.storage.local.set({ darkMode: darkMode.value })
  }
}

// Toggle clock style
const toggleClockStyle = () => {
  clockStyle.value = clockStyle.value === 'analog' ? 'digital' : 'analog'
  if (chrome?.storage?.local) {
    chrome.storage.local.set({ clockStyle: clockStyle.value })
  }
}

</script>

<template>
   <div class="min-w-[320px] p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 min-h-[400px]">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <span class="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Global Time
        </span>
        <span class="text-sm text-gray-400">⏱️</span>
      </h1>
      <div class="flex gap-2">
        <button @click="toggleDarkMode" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="darkMode" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        <button @click="toggleClockStyle" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="clockStyle === 'analog'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Search & Comparator Toggle -->
    <div class="mb-4 space-y-3">
      <TimeSearch 
        :all-timezones="defaultTimezones" 
        :selected-timezones="timezones.map(t => t.zone)"
        @select="(tz) => timezones.push(tz)"
      />
      <button 
        @click="showComparator = !showComparator"
        class="w-full text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-colors"
      >
        {{ showComparator ? 'Hide' : 'Show' }} Time Comparator
      </button>
    </div>

    <!-- Comparator View -->
    <TimeComparator 
      v-if="showComparator"
      :base-timezone="timezones[0]?.zone"
      :compare-timezone="timezones[1]?.zone"
      class="mb-4"
    />

    <!-- Draggable Timezones -->
  <draggable
      v-model="timezones" 
      item-key="zone"
      @end="handleDragEnd"
      class="space-y-3"
    >
      <template #item="{ element }">
        <TimeCard 
          :timezone="element.zone"
          :label="element.label"
          :clock-style="clockStyle"
          class="cursor-move active:cursor-grabbing"
        />
      </template>
  </draggable>
  </div>
</template>