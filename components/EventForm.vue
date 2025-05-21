<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <div class="flex justify-between mb-4">
        <h3 class="text-xl font-semibold">{{ isEdit ? 'Termin bearbeiten' : 'Neuer Termin' }}</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Titel</label>
          <input 
            v-model="formData.title" 
            type="text" 
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
          >
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Datum</label>
            <input 
              v-model="formData.date" 
              type="date" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Zeit</label>
            <input 
              v-model="formData.time" 
              type="time" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Dauer (Minuten)</label>
          <input 
            v-model="formData.duration" 
            type="number" 
            min="15"
            step="15"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Beschreibung</label>
          <textarea 
            v-model="formData.description" 
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button 
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
          >
            {{ isEdit ? 'Aktualisieren' : 'Erstellen' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  event?: any;
  isEdit?: boolean;
}>()

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  title: '',
  date: '',
  time: '',
  duration: 60,
  description: ''
})

onMounted(() => {
  if (props.event) {
    const eventDate = new Date(props.event.start)
    formData.value = {
      title: props.event.title,
      date: eventDate.toISOString().split('T')[0],
      time: eventDate.toTimeString().slice(0, 5),
      duration: Math.round((props.event.end - props.event.start) / (1000 * 60)),
      description: props.event.description || ''
    }
  }
})

const handleSubmit = () => {
  const startDate = new Date(`${formData.value.date}T${formData.value.time}`)
  const endDate = new Date(startDate.getTime() + formData.value.duration * 60000)

  const eventData = {
    title: formData.value.title,
    start: startDate,
    end: endDate,
    description: formData.value.description
  }

  emit('submit', eventData)
}
</script>
