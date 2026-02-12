<template>
  <v-container class="fill-height bg-grey-lighten-4 py-10">
    <v-card class="mx-auto rounded-xl overflow-hidden" max-width="550" elevation="6">
      <v-sheet color="primary" height="8"></v-sheet>

      <div class="pa-8">
        <div class="text-center mb-8">
          <v-avatar color="primary-lighten-5" size="72" class="mb-4">
            <v-icon icon="mdi-ticket-confirmation" color="primary" size="36"></v-icon>
          </v-avatar>
          <h1 class="text-h4 font-weight-bold text-grey-darken-3">
            Secure Your Spot
          </h1>
          <p class="text-body-2 text-grey">
            Fill in your details to reserve your ticket
          </p>
        </div>

        <!-- SUCCESS ALERT -->
        <v-expand-transition>
          <v-alert
            v-if="success"
            type="success"
            variant="flat"
            class="mb-6 rounded-lg"
            icon="mdi-check-decagram"
          >
            <div class="text-subtitle-1 font-weight-bold">
              Reservation Successful!
            </div>
            <div class="text-caption">
              Redirecting you back to the dashboard...
            </div>
          </v-alert>
        </v-expand-transition>

        <!-- EVENT CARD -->
        <v-card
          variant="tonal"
          color="primary"
          class="mb-8 rounded-xl overflow-hidden"
        >
          <div class="d-flex align-center pa-4">
            <div class="me-4">
              <v-icon size="32">mdi-calendar-star</v-icon>
            </div>
            <div>
              <div
                class="text-caption text-uppercase font-weight-black"
                style="letter-spacing: 1px"
              >
                Event Selection
              </div>
              <div class="text-h6 font-weight-bold">
                {{ eventTitle }}
              </div>
            </div>
          </div>
        </v-card>

        <!-- FORM -->
        <v-form @submit.prevent="submitReservation">
          <div class="text-subtitle-2 font-weight-bold mb-2 ml-1">
            Full Name
          </div>

          <v-text-field
            v-model="form.name"
            placeholder="John Doe"
            variant="solo"
            flat
            bg-color="grey-lighten-4"
            rounded="lg"
            class="mb-2"
            prepend-inner-icon="mdi-account-outline"
            required
          />

          <div class="text-subtitle-2 font-weight-bold mb-2 ml-1">
            Email Address
          </div>

          <v-text-field
            v-model="form.email"
            placeholder="john@example.com"
            variant="solo"
            flat
            bg-color="grey-lighten-4"
            rounded="lg"
            class="mb-4"
            prepend-inner-icon="mdi-email-outline"
            type="email"
            required
          />

          <v-sheet
            color="amber-lighten-5"
            class="pa-4 rounded-lg d-flex align-center mb-8"
          >
            <v-icon color="amber-darken-2" class="me-3">
              mdi-clock-outline
            </v-icon>
            <div class="text-caption text-amber-darken-4">
              Note: Your reservation will be set to
              <strong>Pending</strong> for verification.
            </div>
          </v-sheet>

          <div class="d-flex flex-column ga-3">
            <v-btn
              color="primary"
              size="x-large"
              block
              elevation="4"
              :loading="loading"
              type="submit"
              rounded="lg"
              class="text-none font-weight-bold"
            >
              Confirm My Reservation
            </v-btn>

            <v-btn
              variant="text"
              @click="navigateTo('/reserve/reservations')"
              color="grey-darken-1"
              block
              class="text-none mt-2"
            >
              Cancel and Go Back
            </v-btn>
          </div>
        </v-form>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

// ✅ Proteksyon para sa page
definePageMeta({
  middleware: 'auth'
})

const strapiUrl = config.public.strapiUrl || 'http://localhost:1337'

const loading = ref(false)
const success = ref(false)

// ✅ Safe Computed para sa UI
const eventTitle = computed(() => {
  return route.query.title
    ? decodeURIComponent(route.query.title)
    : 'Selected Event'
})

const eventId = computed(() => {
  return route.query.id || null
})

const form = ref({
  name: '',
  email: '',
  tier: route.query.tier || 'General Admission'
})

const submitReservation = async () => {
  if (!form.value.name || !form.value.email) {
    return alert('Please fill up all fields')
  }

  if (!eventId.value) {
    return alert('Invalid event. Please try again.')
  }

  loading.value = true

  try {
    // ✅ Siguraduhing tugma ang endpoint na /api/tickets sa Strapi mo
    await $fetch(`${strapiUrl}/api/tickets`, {
      method: 'POST',
      body: {
        data: {
          Name: form.value.name,
          Email: form.value.email,
          ticket_status: 'Pending',
          event: eventId.value,
          Category: form.value.tier
        }
      }
    })

    success.value = true
    form.value.name = ''
    form.value.email = ''

    setTimeout(() => {
      success.value = false
      // ✅ I-redirect pabalik sa tamang Dashboard path
      navigateTo('/dashboard')
    }, 2000)

  } catch (error) {
    console.error('Error Detail:', error.data || error)
    alert('Failed to save reservation. Please try again.')
  } finally {
    loading.value = false
  }
}

</script>
