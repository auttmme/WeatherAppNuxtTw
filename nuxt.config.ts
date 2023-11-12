// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon"],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      API_KEY: process.env.API_KEY
    },
  }
})