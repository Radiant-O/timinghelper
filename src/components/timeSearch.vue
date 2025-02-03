<!-- src/components/TimezoneSearch.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/vue'

interface TimezoneConfig {
  label: string
  zone: string
  code: string
}

const props = defineProps({
  allTimezones: {
    type: Array as () => TimezoneConfig[],
    required: true
  },
  selectedTimezones: {
    type: Array as () => string[],
    required: true
  }
})

const emit = defineEmits(['select'])

const searchQuery = ref('')

const filteredTimezones = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return props.allTimezones.filter(tz => 
    !props.selectedTimezones.includes(tz.zone) &&
    (tz.label.toLowerCase().includes(query) ||
     tz.zone.toLowerCase().includes(query))
  ).slice(0, 8)
})

const handleSelect = (tz: TimezoneConfig) => {
  emit('select', tz)
  searchQuery.value = ''
}
</script>

<template>
  <Combobox as="div" class="relative">
    <div class="flex items-center bg-white/50 dark:bg-gray-700/50 rounded-lg px-3 py-2 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600">
      <svg 
        class="w-5 h-5 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <ComboboxInput
        v-model="searchQuery"
        class="ml-2 flex-1 bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200"
        placeholder="Add timezone..."
        @change="searchQuery = $event.target.value"
      />
    </div>

    <ComboboxOptions 
      v-if="filteredTimezones.length > 0"
      class="absolute mt-1 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg z-10 ring-1 ring-gray-200 dark:ring-gray-700"
    >
      <ComboboxOption
        v-for="tz in filteredTimezones"
        :key="tz.zone"
        :value="tz"
        as="template"
      >
        <li
          class="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center justify-between"
          @click="handleSelect(tz)"
        >
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-800 dark:text-gray-200">
              {{ tz.label }}
            </span>
            <span class="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              {{ tz.code }}
            </span>
          </div>
          <span class="text-gray-500 dark:text-gray-400 text-xs">
            {{ tz.zone }}
          </span>
        </li>
      </ComboboxOption>
    </ComboboxOptions>
  </Combobox>
</template>