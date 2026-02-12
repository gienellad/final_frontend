// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-04-03',

  modules: ['@nuxtjs/strapi'],

  // ✅ FIX para sa ".css" extension error
  build: {
    transpile: ['vuetify'],
  },

  // ✅ FIX para sa "stringify" at mapping ng dependencies
  vite: {
    optimizeDeps: {
      include: ['qs'],
    },
    resolve: {
      alias: {
        qs: 'qs/lib/index.js',
      },
    },
    // Idagdag ito para sa CSS handling
    ssr: {
      noExternal: ['vuetify'],
    },
  },

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css',
  ],

  strapi: {
    url: process?.env?.STRAPI_URL || 'http://localhost:1337',
    prefix: '/api',
    version: 'v4',
  },
})