<template>
  <v-container class="py-10 px-6">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6 rounded-xl" elevation="6">
          <h2 class="text-h5 font-weight-bold mb-4">Edit Event</h2>

          <v-form @submit.prevent="updateEvent">
            <v-text-field
              v-model="event.Title"
              label="Event Title"
              required
            />

            <v-textarea
              v-model="event.Description"
              label="Description"
              rows="4"
            />

            <v-text-field
              v-model="event.VenueName"
              label="Venue"
            />

            <v-text-field
              v-model="event.Date"
              label="Date & Time"
              type="datetime-local"
            />

            <v-text-field
              v-model="event.TotalTickets"
              label="Total Tickets"
              type="number"
            />

            <v-btn
              color="primary"
              class="mt-4"
              type="submit"
              :loading="loading"
            >
              Save Changes
            </v-btn>

            <v-btn
              variant="text"
              class="mt-4 ml-2"
              @click="navigateTo('/dashboard')"
            >
              Cancel
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

const strapiUrl =
  config.public.strapiUrl || 'http://localhost:1337'

const eventId = route.query.id

const loading = ref(false)

const event = ref({
  Title: '',
  Description: '',
  VenueName: '',
  Date: '',
  TotalTickets: 0
})

/* =========================
   FETCH EVENT
========================= */
const fetchEvent = async () => {
  if (!eventId) {
    alert('Invalid event ID')
    return navigateTo('/dashboard')
  }

  try {
    const response = await $fetch(
      `${strapiUrl}/api/events/${eventId}?populate=*`
    )

    const data = response.data.attributes || response.data

    const venueData =
      data.venue?.data?.attributes ||
      data.venue?.attributes ||
      data.venue

    event.value = {
      Title: data.Title || '',
      Description: data.Description || '',
      VenueName:
        venueData?.VenueName ||
        venueData?.Name ||
        '',
      Date: formatDateForInput(data.Date),
      TotalTickets: data.AvailableTickets || 0
    }

  } catch (error) {
    console.error('Failed to fetch event:', error)
    alert('Failed to load event')
    navigateTo('/dashboard')
  }
}

/* =========================
   UPDATE EVENT
========================= */
const updateEvent = async () => {
  if (!event.value.Title) {
    return alert('Title is required')
  }

  loading.value = true

  try {
    await $fetch(`${strapiUrl}/api/events/${eventId}`, {
      method: 'PUT',
      body: {
        data: {
          Title: event.value.Title,
          Description: event.value.Description,
          Date: event.value.Date,
          AvailableTickets: event.value.TotalTickets
        }
      }
    })

    alert('Event updated successfully!')
    navigateTo('/dashboard')

  } catch (error) {
    console.error(error)
    alert('Update failed.')
  } finally {
    loading.value = false
  }
}

/* =========================
   FORMAT DATE
========================= */
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

onMounted(fetchEvent)
</script>
