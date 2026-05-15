// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/m.css', '~/assets/style.css'],
  modules: ['@nuxt/ui'],
  ssr: false,
  icon: {
    mode: 'svg',
  }
})
