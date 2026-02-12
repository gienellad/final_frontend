<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      elevation="0"
      border="0"
      class="bg-grey-lighten-5 px-3 py-4"
      width="280"
    >
      <v-list-item class="mb-6 px-2">
        <template v-slot:prepend>
          <v-avatar color="primary" rounded="lg" size="100">
            <v-img src="https://upload.wikimedia.org/wikipedia/en/6/6f/MainEvent2014.png"></v-img>
          </v-avatar>
        </template>
        <v-list-item-title class="text-h6 font-weight-black text-primary">
          PH EVENT HUB
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption">giezen Intig 2.0</v-list-item-subtitle>
      </v-list-item>

      <v-divider class="mb-6 opacity-50"></v-divider>

      <v-list density="comfortable" nav class="pa-0">
        <v-list-item
          to="/dashboard"
          prepend-icon="mdi-view-dashboard-outline"
          title="Dashboard"
          rounded="xl"
          active-class="bg-primary-lighten-5 text-primary font-weight-bold"
          class="mb-2 py-3"
        ></v-list-item>

        <v-list-item
          to="/reserve/reservations"
          prepend-icon="mdi-ticket-confirmation-outline"
          title="Reservations"
          rounded="xl"
          active-class="bg-primary-lighten-5 text-primary font-weight-bold"
          class="mb-2 py-3"
        ></v-list-item>

        <v-list-item
          to="/attendance/attendance"
          prepend-icon="mdi-account-group-outline"
          title="Attendance"
          rounded="xl"
          active-class="bg-primary-lighten-5 text-primary font-weight-bold"
          class="mb-2 py-3"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-card variant="flat" color="grey-lighten-4" rounded="xl" class="pa-4 mb-2">
          <div class="d-flex align-center mb-4">
            <v-avatar size="36" color="primary-lighten-4" class="me-3">
              <v-icon color="primary" size="20">mdi-account-circle</v-icon>
            </v-avatar>
            <div style="overflow: hidden">
              <div class="text-caption font-weight-bold text-truncate">Administrator</div>
              <div class="text-caption text-grey text-truncate">admin@phub.com</div>
            </div>
          </div>
          <v-btn
            color="red-lighten-5"
            variant="flat"
            block
            rounded="lg"
            to="/login"
            class="text-none text-red-darken-1 font-weight-bold"
            prepend-icon="mdi-logout-variant"
          >
            Log out
          </v-btn>
        </v-card>
      </template>
    </v-navigation-drawer>

    <v-app-bar 
      elevation="0" 
      class="border-b px-4 bg-white"
    >
      <v-app-bar-nav-icon 
        variant="text" 
        @click.stop="drawer = !drawer"
        class="text-grey-darken-1"
      ></v-app-bar-nav-icon>
      
      <v-app-bar-title class="text-subtitle-1 font-weight-bold text-grey-darken-2">
        Ph Event Hub Management System
      </v-app-bar-title>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main class="bg-grey-lighten-5">
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(true);
</script>

<style scoped>
/* Para sa active navigation effect */
:deep(.v-list-item--active) .v-list-item__prepend .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
  opacity: 1;
}

/* Swabeng transition sa sidebar */
.v-navigation-drawer {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
</style>