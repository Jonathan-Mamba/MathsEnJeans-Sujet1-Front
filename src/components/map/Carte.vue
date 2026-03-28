<script setup lang="ts">
import Legend from './Legend.vue';
import Map from './GameMap.vue';
import {ref, Ref} from 'vue';
import {addRoute} from "@/util";

const selectedFirstSquare: Ref<string> = ref("");
const selectedSecondSquare: Ref<string> = ref("");
const selectedRouteType: Ref<string> = ref("");

const addSelectedSquare = (square: string) => {
  if (selectedFirstSquare.value === "") {
    selectedFirstSquare.value = square;
  } else if (selectedSecondSquare.value === "") {
    selectedSecondSquare.value = square;
  } else {
    selectedFirstSquare.value = square;
    selectedSecondSquare.value = "";
  }
  if (selectedFirstSquare.value !== "" && selectedSecondSquare.value !== "" && selectedRouteType.value !== "") {
    addRoute(selectedFirstSquare.value, selectedSecondSquare.value, selectedRouteType.value);
    selectedFirstSquare.value = "";
    selectedSecondSquare.value = "";
  }
}
</script>

<template>
  <div class="container_map">
    <Legend @select="(routeType) => {selectedFirstSquare = ''; selectedSecondSquare = ''; selectedRouteType = routeType}"></Legend>
    <Map @select="(square) => addSelectedSquare(square)" :selected-square1="selectedFirstSquare" :selected-square2="selectedSecondSquare"></Map>
  </div>
</template>

<style scoped>
div.container_map {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 52%;
  gap: 25px;
  background-color: var(--gray5);
  max-height: 100dvh;
  overflow-y: scroll;
}
</style>