<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <ProfileHeader />
    </div>

    <div class="bg-white rounded-lg shadow-xl overflow-hidden">
      <div class="relative h-64 sm:h-96">
        <img :src="event.coverImage" :alt="event.title" class="w-full h-full object-cover">
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <h1 class="text-3xl font-bold text-white">{{ event.title }}</h1>
          <p class="text-white/90">{{ formatDate(event.start) }} | {{ formatTime(event.start) }}</p>
        </div>
      </div>

      <div class="p-6">
        <div class="grid md:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <h2 class="text-2xl font-semibold mb-4">Über das Event</h2>
            <p class="text-gray-600 whitespace-pre-line">{{ event.description }}</p>
            
            <div class="mt-8" v-if="event.images?.length">
              <h3 class="text-xl font-semibold mb-4">Galerie</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <img v-for="img in event.images" 
                     :key="img" 
                     :src="img" 
                     class="rounded-lg hover:opacity-75 transition cursor-pointer"
                     @click="openImage(img)">
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-4">Event Details</h3>
            <div class="space-y-4">
              <div>
                <p class="text-gray-600">Datum</p>
                <p class="font-semibold">{{ formatDate(event.start) }}</p>
              </div>
              <div>
                <p class="text-gray-600">Uhrzeit</p>
                <p class="font-semibold">{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</p>
              </div>
              <div v-if="event.location">
                <p class="text-gray-600">Location</p>
                <p class="font-semibold">{{ event.location }}</p>
              </div>
              <div v-if="event.price">
                <p class="text-gray-600">Preis</p>
                <p class="font-semibold">{{ event.price }}</p>
              </div>

              <div class="pt-4 space-y-3" v-if="event.links?.length">
                <a v-for="link in event.links" 
                   :key="link.url"
                   :href="link.url"
                   target="_blank"
                   class="block w-full bg-rose-600 text-white text-center py-3 px-4 rounded-lg hover:bg-rose-700 transition">
                  {{ link.title }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const event = ref<any>(null)

onMounted(async () => {
  // Beispiel-Event-Daten (später durch API-Call ersetzen)
  event.value = {
    id: route.params.id,
    title: "Live-Konzert",
    coverImage: "/images/event-cover.jpg",
    start: new Date("2024-05-15T20:00:00"),
    end: new Date("2024-05-15T23:00:00"),
    description: "Ausführliche Beschreibung des Events...",
    location: "Konzerthalle XYZ, Stadt",
    price: "Ab 29,99 €",
    images: [
      "/images/gallery-1.jpg",
      "/images/gallery-2.jpg",
      "/images/gallery-3.jpg",
    ],
    links: [
      { title: "Tickets kaufen", url: "https://ticketshop.example.com" },
      { title: "Merch Shop", url: "https://shop.example.com" },
    ]
  }
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('de-DE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('de-DE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const openImage = (img: string) => {
  window.open(img, '_blank')
}
</script>
