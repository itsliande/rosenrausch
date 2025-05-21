<template>
  <div class="container mx-auto px-4">
    <div class="mb-6">
      <ProfileHeader />
    </div>
    
    <h1 class="text-2xl font-bold mb-6">Termine</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink 
        v-for="event in events" 
        :key="event.id"
        :to="`/event/${event.id}`"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img :src="event.coverImage" :alt="event.title" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-rose-600">{{ event.title }}</h3>
          <p class="text-gray-600">{{ formatDate(event.start) }}</p>
          <p class="text-sm text-gray-500">
            {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
          </p>
        </div>
      </NuxtLink>
    </div>

    <CalendarEntryPopup 
      :event="selectedEvent"
      :isVisible="showPopup"
      @close="closePopup"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const events = ref([
  {
    id: 1,
    title: "Live-Konzert",
    coverImage: "/images/event-cover.jpg",
    start: new Date("2024-05-15T20:00:00"),
    end: new Date("2024-05-15T23:00:00"),
    // weitere Event-Details...
  },
  // weitere Events...
])

const showPopup = ref(false)
const selectedEvent = ref(null)

const showEventDetails = (event: any) => {
  selectedEvent.value = event
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('de-DE')
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}
</script>