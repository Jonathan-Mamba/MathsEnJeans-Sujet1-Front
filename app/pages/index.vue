<script setup lang="ts">
import { EditMode, SSEEndpoint } from "~/util";
import { setupSSE } from "~/sseHandlers";

useHead({
  title: "Math en Jeans - Conception d'un jeu de role diabolique (éditeur de jeu)",
  meta: [
    {
      name: "description",
      content: "Editeur de jeu pour le projet de Math en Jeans - Conception d'un jeu de rôle diabolique"
    }
  ]
})

const mode = ref(EditMode.NONE);
useAsyncData(async () => {
    await loadInitialData(); 
    return {loaded: true}; 
});
onMounted(async () => {
  await loadInitialData();
  const sse = new EventSource(SSEEndpoint)
  setupSSE(sse, "1");
})

</script>

<template>
  <div class="container">
    <GameMenu @modechange="newMode => (mode = newMode)"/>
    <OptionContainer :mode="mode"/>
    <MapContainer/>
  </div>
</template>

<style scoped>
div.container {
  display: grid;
  grid-template-columns: 10% 40% 50%;
}
</style>