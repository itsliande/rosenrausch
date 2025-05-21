<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <div class="flex justify-between mb-4">
        <h3 class="text-xl font-semibold">{{ event.title }}</h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
      <div class="mb-4">
        <p class="mb-2"><strong>Datum:</strong> {{ formatDate(event.start) }}</p>
        <p class="mb-2"><strong>Uhrzeit:</strong> {{ formatTime(event.start) }} - {{ formatTime(event.end) }}</p>
        <p class="mb-2"><strong>Beschreibung:</strong> {{ event.description || 'Keine Beschreibung verfügbar' }}</p>
      </div>
      <div class="text-right">
        <button @click="close" class="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600">
          Schließen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  event: any;
  isVisible: boolean;
}>()

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('de-DE')
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}
</script>
