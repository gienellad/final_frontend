<template>
  <v-container class="py-10 px-6">
    <v-row class="mb-10 align-center">
      <v-col cols="12" sm="7">
        <div class="brand-wrapper animate__animated animate__fadeInLeft">
          <h1 class="brand-text">PH Event Hub</h1>
          <div class="brand-underline"></div>
          <p class="text-subtitle-1 text-grey-darken-1 mt-3 font-weight-medium">
            Discover and manage the most exciting events in the Philippines.
          </p>
        </div>
      </v-col>
      <v-col cols="12" sm="5" class="text-sm-right">
        
      </v-col>
    </v-row>

    <v-row class="mb-12 justify-center">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="0" rounded="xl" class="search-container pa-2 border">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="Search for events, artists, or venues..."
            variant="solo"
            flat
            hide-details
            clearable
            rounded="xl"
            bg-color="white"
            class="search-input"
          >
            <template v-slot:append-inner>
              <v-fade-transition>
                <v-progress-circular v-if="loading" size="24" width="3" color="primary" indeterminate></v-progress-circular>
              </v-fade-transition>
            </template>
          </v-text-field>
        </v-card>
        
        <div class="mt-4 d-flex justify-center gap-3 flex-wrap align-center">
          <span class="text-caption font-weight-bold text-grey-darken-1 text-uppercase">Trending:</span>
          <v-chip size="small" variant="flat" color="blue-lighten-5" class="text-primary font-weight-bold" @click="searchQuery = 'Arena'" link>#Arena</v-chip>
          <v-chip size="small" variant="flat" color="blue-lighten-5" class="text-primary font-weight-bold" @click="searchQuery = 'BINI'" link>#BINI</v-chip>
          <v-chip size="small" variant="flat" color="blue-lighten-5" class="text-primary font-weight-bold" @click="searchQuery = 'Concert'" link>#Concert</v-chip>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col v-for="n in 3" :key="n" cols="12" md="4">
        <v-skeleton-loader type="card, list-item-two-line" rounded="xl"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else-if="filteredEvents.length">
      <v-col v-for="event in filteredEvents" :key="event.id" cols="12" md="4">
        <v-card class="event-card rounded-xl h-100 d-flex flex-column overflow-hidden" elevation="4">
          <v-img 
            :src="event.ImageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'" 
            height="240" 
            cover
            class="align-start"
          >
            <div class="d-flex justify-space-between w-100 pa-3">
              <v-chip
                v-if="event.Remaining === 0"
                color="error"
                class="font-weight-black px-4"
                label
                size="small"
              >SOLD OUT</v-chip>
              <v-spacer v-else></v-spacer>
              
              <div class="d-flex gap-2">
                <!-- Edit Button -->
                <v-btn
                  icon="mdi-pencil"
                  color="blue-lighten-5"
                  size="small"
                  variant="flat"
                  class="edit-btn text-primary"
                  @click.stop="editEvent(event.id)"
                ></v-btn>

                <!-- Delete Button -->
                <v-btn
                  icon="mdi-trash-can"
                  color="red-lighten-5"
                  size="small"
                  variant="flat"
                  class="delete-btn text-error"
                  @click.stop="deleteEvent(event.id)"
                ></v-btn>
              </div>
            </div>
          </v-img>

          <v-card-text class="pt-6 px-6 flex-grow-1">
            <h2 class="text-h6 font-weight-bold mb-3 text-grey-darken-4 line-clamp-1">{{ event.Title }}</h2>
            <p class="text-body-2 text-grey-darken-2 line-clamp-3">{{ event.Description }}</p>
            
            <div class="info-grid mt-4">
              <div class="d-flex align-center mb-2">
                <v-icon size="18" color="primary" class="me-3">mdi-calendar-clock</v-icon>
                <span class="text-body-2 text-grey-darken-3 font-weight-bold">{{ event.Date }}</span>
              </div>

              <div class="d-flex align-center mb-4">
                <v-icon size="18" color="error" class="me-3">mdi-map-marker-radius</v-icon>
                <span class="text-body-2 text-grey-darken-2">{{ event.VenueName }}</span>
              </div>
            </div>

            <v-divider class="mb-4 opacity-30"></v-divider>

            <div class="d-flex justify-space-between align-center">
              <div class="d-flex flex-column">
                <span class="text-caption text-grey">Availability</span>
                <span :class="['text-subtitle-2 font-weight-black', event.Remaining > 0 ? 'text-success' : 'text-error']">
                  {{ event.Remaining }} / {{ event.TotalTickets }} Seats
                </span>
              </div>
              <v-progress-circular
                :model-value="(event.Remaining / event.TotalTickets) * 100"
                :color="event.Remaining > 0 ? 'primary' : 'grey'"
                size="32"
                width="4"
              ></v-progress-circular>
            </div>
          </v-card-text>

          <v-card-actions class="pa-6 pt-0">
            <v-btn 
              block
              :color="event.Remaining > 0 ? 'primary' : 'grey-lighten-2'" 
              variant="flat" 
              rounded="xl"
              size="large"
              class="text-none font-weight-black py-4"
              :disabled="event.Remaining === 0"
              @click="openBooking(event)"
            >
              {{ event.Remaining > 0 ? 'Reserve Spot' : 'Waitlist Full' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else class="justify-center mt-12">
      <v-col cols="auto" class="text-center">
        <v-icon size="120" color="grey-lighten-3">mdi-folder-open-outline</v-icon>
        <h3 class="text-h5 font-weight-bold text-grey mt-4">No results for "{{ searchQuery }}"</h3>
        <v-btn variant="text" color="primary" class="mt-2" @click="searchQuery = ''">Clear Filters</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl || 'http://localhost:1337'
const events = ref([])
const loading = ref(false)
const searchQuery = ref('')

const filteredEvents = computed(() => {
  if (!searchQuery.value) return events.value
  const query = searchQuery.value.toLowerCase()
  return events.value.filter(event => 
    event.Title.toLowerCase().includes(query) || 
    event.VenueName.toLowerCase().includes(query)
  )
})

const fetchEvents = async () => {
  loading.value = true
  try {
    const response = await $fetch(`${strapiUrl}/api/events?populate=*&sort=Date:asc`)
    if (response?.data) {
      events.value = response.data.map(item => {
        const data = item.attributes || item;
        const total = data.AvailableTickets || 0; 
        const reserved = data.tickets?.length || data.tickets?.data?.length || 0; 
        const remaining = total - reserved;
        const venueData = data.venue?.data?.attributes || data.venue?.attributes || data.venue;

        return {
          id: item.documentId || item.id, 
          Title: data.Title || "Untitled Event",
          TotalTickets: total,
          Price: data.Price || 0,
          Date: data.Date ? new Date(data.Date).toLocaleString('en-PH', { 
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }) : 'Date TBA',
          VenueName: venueData?.VenueName || venueData?.Name || 'TBA',
          ImageUrl: data.Image?.url ? `${strapiUrl}${data.Image.url}` : null,
          Remaining: remaining > 0 ? remaining : 0,
          Description: data.Description || 'No description available',
        }
      })
    }
  } catch (e) {
    console.error("Fetch error:", e)
  } finally {
    setTimeout(() => { loading.value = false }, 500)
  }
}

const deleteEvent = async (id) => {
  if (!confirm("Remove this event from the hub?")) return
  try {
    await $fetch(`${strapiUrl}/api/events/${id}`, { method: 'DELETE' })
    await fetchEvents()
  } catch (e) { alert("Delete failed. Check permissions.") }
}

const editEvent = (id) => {
  // Direct path sa edit folder at edit-event file
  navigateTo(`/edit/edit-event?id=${id}`) 
}


const openBooking = (event) => {
  // Direct path sa reserve folder at reservations file
  navigateTo(`/reserve/reservations?title=${encodeURIComponent(event.Title)}&id=${event.id}&price=${event.Price}`)
}

onMounted(fetchEvents)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

.v-container {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.brand-text {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -2px;
  background: linear-gradient(135deg, #0D47A1 0%, #42A5F5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-underline {
  width: 80px;
  height: 8px;
  background: #1976D2;
  border-radius: 4px;
}

.search-container {
  background: #F5F7FA;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-container:focus-within {
  background: white;
  box-shadow: 0 12px 24px rgba(0,0,0,0.06);
}

.event-card {
  transition: all 0.4s ease;
  border: 1px solid rgba(0,0,0,0.05);
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15) !important;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.delete-btn, .edit-btn {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
}

.event-card:hover .delete-btn,
.event-card:hover .edit-btn {
  opacity: 1;
  transform: translateX(0);
}

.create-btn {
  transition: transform 0.2s ease;
}

.create-btn:hover {
  transform: scale(1.03);
}
</style>
