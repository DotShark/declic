import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    public: {
      url: '',
    },
  },
  css: ['./app/assets/css/main.css'],
  fonts: {
    families: [
      {
        name: 'Inter',
        provider: 'google',
        weights: [400, 500, 600, 700],
      },
      {
        name: 'Poppins',
        provider: 'google',
        weights: [400, 500, 600, 700],
      },
    ],
  },
  vite: {
    plugins: [
      tailwindcss(),
    ]
  }
})