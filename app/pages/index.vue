<template>
  <v-container fluid class="fill-height login-bg d-flex align-center justify-center">
    <v-card 
      class="mx-auto pa-10 glass-card" 
      elevation="24" 
      rounded="xl" 
      width="450"
    >
      <div class="text-center">
        <v-avatar size="150" class="mb-4 elevation-4 bg-white">
          <v-img
            src="https://upload.wikimedia.org/wikipedia/en/6/6f/MainEvent2014.png"
            alt="Logo"
          ></v-img>
        </v-avatar>
        
        <h1 class="text-h4 font-weight-black primary--text mb-2">PH Event Hub</h1>
        <p class="text-subtitle-1 text-medium-emphasis mb-8">Welcome back, Employee!</p>
      </div>

      <v-form @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="Email address"
          prepend-inner-icon="mdi-email-fast-outline"
          variant="solo-filled"
          flat
          rounded="lg"
          class="mb-2"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          :type="visible ? 'text' : 'password'"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="visible = !visible"
          prepend-inner-icon="mdi-lock-open-outline"
          variant="solo-filled"
          flat
          rounded="lg"
          class="mb-4"
        ></v-text-field>

        <v-fade-transition>
          <v-alert
            v-if="errorMsg"
            type="error"
            variant="tonal"
            density="compact"
            icon="mdi-alert-circle-outline"
            class="mb-4 rounded-lg"
          >
            {{ errorMsg }}
          </v-alert>
        </v-fade-transition>

        <v-btn
          block
          color="primary"
          size="x-large"
          variant="elevated"
          class="login-btn font-weight-bold"
          rounded="lg"
          @click="handleLogin"
          :loading="loading"
          elevation="4"
        >
          LOG IN
          <v-icon end icon="mdi-chevron-right"></v-icon>
        </v-btn>
      </v-form>
      
      <div class="text-center mt-6">
        <span class="text-caption text-medium-emphasis">© 2026 Ticketing System Support</span>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ layout: false })

const email = ref('admin')
const password = ref('')
const visible = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const token = useCookie('auth_token') //

const handleLogin = () => {
  loading.value = true
  
  // Mock login delay para mas realistic
  setTimeout(() => {
    token.value = 'authorized_user_token' //
    navigateTo('/dashboard') //
    loading.value = false
  }, 1000)
}
</script>

<style scoped>
/* Gradient background na swak sa PH Event Hub theme */
.login-bg {
  background: linear-gradient(135deg, #1867C0 0%, #5CBBF6 100%);
  background-attachment: fixed;
}

/* Glassmorphism effect */
.glass-card {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Hover animation para sa button */
.login-btn {
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.2) !important;
}
</style>