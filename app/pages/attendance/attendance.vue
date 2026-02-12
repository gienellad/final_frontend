<template>
  <v-container class="py-8 px-6">
    <!-- Header Card -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card class="pa-6 rounded-xl elevation-4 branding-gradient text-white overflow-hidden position-relative">
          <div class="d-flex align-center position-relative" style="z-index: 2">
            <v-avatar color="white" variant="tonal" size="64" class="me-5 rounded-lg">
              <v-icon size="36" color="white">mdi-account-group-outline</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-black mb-1 brand-font">Guest Attendance</h1>
              <p class="text-subtitle-2 opacity-80 font-weight-medium">
                Real-time management of guest arrivals and reservations
              </p>
            </div>
          </div>
          <v-icon class="position-absolute decoration-icon">mdi-ticket-percent-outline</v-icon>
        </v-card>
      </v-col>
    </v-row>

    <!-- Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6">
        <v-card
          @click="filterStatus = 'all'"
          :class="{ 'active-card-total': filterStatus === 'all' }"
          elevation="2"
          rounded="xl"
          class="pa-6 h-100 cursor-pointer clickable-card"
        >
          <div class="text-overline text-grey-darken-1 font-weight-bold mb-1">Total Guests</div>
          <div class="text-h3 font-weight-black text-primary">{{ totalGuests }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card
          @click="filterStatus = 'Confirmed'"
          :class="{ 'active-card-confirmed': filterStatus === 'Confirmed' }"
          elevation="2"
          rounded="xl"
          class="pa-6 h-100 cursor-pointer clickable-card"
        >
          <div class="text-overline text-grey-darken-1 font-weight-bold mb-1">Confirmed Arrival</div>
          <div class="text-h3 font-weight-black text-success">{{ confirmedArrivals }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Table Card -->
    <v-card rounded="xl" elevation="3" class="border overflow-hidden">
      <v-card-title class="d-flex align-center pa-6 bg-white">
        <div class="d-flex flex-column">
          <span class="text-h6 font-weight-bold text-grey-darken-3">Guest Records</span>
          <span class="text-caption text-grey">All-time reservation history</span>
        </div>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Quick Search..."
          single-line
          hide-details
          density="comfortable"
          variant="solo"
          flat
          bg-color="grey-lighten-4"
          rounded="lg"
          max-width="350"
          class="search-input"
        ></v-text-field>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="filteredAttendance"
        :search="search"
        class="attendance-table"
        hover
      >
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar color="primary-lighten-5" size="36" class="me-3">
              <span class="text-primary font-weight-bold text-caption">{{ item.name.charAt(0) }}</span>
            </v-avatar>
            <div class="d-flex flex-column">
              <span class="font-weight-bold text-grey-darken-3">{{ item.name }}</span>
              <span class="text-caption text-grey">{{ item.email }}</span>
            </div>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="x-small"
            variant="flat"
            class="text-uppercase font-weight-black px-4"
            rounded="pill"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end">
            <v-btn
              v-if="item.status !== 'Confirmed'"
              icon="mdi-check-circle-outline"
              variant="text"
              color="success"
              size="small"
              class="hover-scale"
              @click="updateStatus(item.id, 'Confirmed')"
            ></v-btn>
            <v-btn
              icon="mdi-trash-can-outline"
              variant="text"
              color="grey-lighten-1"
              size="small"
              class="hover-scale-red"
              @click="deleteTicket(item.id)"
            ></v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="pa-15 text-center">
            <v-avatar color="grey-lighten-4" size="100" class="mb-4">
              <v-icon size="48" color="grey-lighten-1">mdi-account-off-outline</v-icon>
            </v-avatar>
            <h3 class="text-h6 text-grey-darken-1 font-weight-bold">No Guest Entries</h3>
            <p class="text-grey text-caption">Guests will appear here once they book an event.</p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl || 'http://localhost:1337'

const attendance = ref([])
const search = ref('')
const filterStatus = ref('all')

const headers = [
  { title: 'Guest Information', key: 'name', align: 'start' },
  { title: 'Event Booked', key: 'eventTitle', sortable: true },
  { title: 'Reservation Date', key: 'date' },
  { title: 'Status', key: 'status', align: 'center', width: '120px' },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

// Fetch tickets from Strapi
const fetchAttendance = async () => {
  try {
    const res = await $fetch(`${strapiUrl}/api/tickets?populate=event&sort=createdAt:desc`)
    if (res?.data) {
      attendance.value = res.data.map(t => {
        const attr = t.attributes || t
        return {
          id: t.documentId || t.id,
          name: attr.Name || 'Anonymous',
          email: attr.Email || 'No Email',
          eventTitle: attr.event?.Title || 'General Admission',
          date: new Date(attr.createdAt).toLocaleDateString('en-PH', {
            month: 'short', day: 'numeric', year: 'numeric',
          }),
          status: attr.ticket_status || 'Pending',
        }
      })
    }
  } catch (e) {
    console.error('Fetch Error:', e)
  }
}

// Update ticket status
const updateStatus = async (id, newStatus) => {
  try {
    await $fetch(`${strapiUrl}/api/tickets/${id}`, {
      method: 'PUT',
      body: { data: { ticket_status: newStatus } },
    })
    await fetchAttendance()
  } catch (e) {
    alert('Error updating status')
  }
}

// Delete ticket
const deleteTicket = async (id) => {
  if (!confirm('Remove this guest record?')) return
  try {
    await $fetch(`${strapiUrl}/api/tickets/${id}`, { method: 'DELETE' })
    await fetchAttendance()
  } catch (e) {
    alert('Error deleting record')
  }
}

// Compute status color
const getStatusColor = (status) => {
  const colors = { Confirmed: 'success', Pending: 'warning', Cancelled: 'error' }
  return colors[status] || 'grey'
}

// Computed for counts
const totalGuests = computed(() => attendance.value.length)
const confirmedArrivals = computed(() => attendance.value.filter(a => a.status === 'Confirmed').length)

// Filtered table items
const filteredAttendance = computed(() =>
  filterStatus.value === 'all'
    ? attendance.value
    : attendance.value.filter(a => a.status === filterStatus.value)
)

onMounted(fetchAttendance)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

.brand-font {
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -1px;
}

.branding-gradient {
  background: linear-gradient(135deg, #1867C0 0%, #5CBBFF 100%);
}

.decoration-icon {
  right: -20px;
  bottom: -20px;
  font-size: 180px;
  opacity: 0.1;
  transform: rotate(-15deg);
}

.search-input {
  transition: all 0.3s ease;
}
.search-input:focus-within {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.attendance-table {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.2);
}

.hover-scale-red:hover {
  transform: scale(1.2);
  color: #F44336 !important;
}

/* Custom table header style */
:deep(.v-data-table-header th) {
  text-transform: uppercase;
  font-size: 0.7rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.5px;
  color: #757575 !important;
  background-color: #F9FAFB !important;
}

/* Active Card Styles */
.active-card-total {
  border: 2px solid #1867C0;
}
.active-card-confirmed {
  border: 2px solid #4CAF50;
}
</style>
