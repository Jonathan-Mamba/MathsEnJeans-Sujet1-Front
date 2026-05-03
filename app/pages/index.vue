<script setup lang="ts">
import { EditMode, backendOrigin } from "~/util";
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

const { pending, error, loadInitialData } = useGameState();

await loadInitialData();

onMounted(() => {
  setupSSE(new EventSource(new URL("/events", backendOrigin).href), "1");
})
</script>

<template>
  <div class="app-container">
    <GameMenu @modechange="newMode => (mode = newMode)"/>
    <OptionContainer :mode="mode"/>
    <MapContainer/>
  </div>
</template>

<style scoped>
div.app-container {
  display: grid;
  grid-template-columns: 10% 40% 50%;
}
</style>
