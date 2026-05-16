import vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3Toastify, {
    autoClose: 3000,
    position: 'bottom-right',
    theme: 'dark',
  } as ToastContainerOptions);
});