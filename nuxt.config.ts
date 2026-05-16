// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/style.css'],
  modules: ['@nuxt/icon'],
  ssr: false,
  icon: {
    mode: 'svg',
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vueuse/core',
        'vue3-toastify',
      ]
    }
  }
})
