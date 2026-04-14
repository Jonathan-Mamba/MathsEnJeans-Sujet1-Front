<script setup lang="ts">
import { EditMode } from "~/util";
import {ref, onMounted} from "vue";

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
useAsyncData(loadInitialData);
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