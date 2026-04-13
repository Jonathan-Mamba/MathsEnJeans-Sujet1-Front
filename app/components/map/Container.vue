<script setup lang="ts">
import { Route } from "~/utils/helpers";
const { addRoute, deleteRoute } = useRoutes();

const selectedFirstSquare: Ref<string> = ref("");
const selectedSecondSquare: Ref<string> = ref("");
const selectedRouteType: Ref<string> = ref("");
const mode: Ref<string> = ref("add");

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
    if (mode.value === "add") {
      console.debug("adding route")
      addRoute(selectedFirstSquare.value, selectedSecondSquare.value, selectedRouteType.value);
    } else if (mode.value === "delete") {
      deleteRoute(new Route(selectedFirstSquare.value, selectedSecondSquare.value, selectedRouteType.value));
      console.debug("deleting route")
    } else {
      alert("Mode inconnu");
    }
    selectedFirstSquare.value = "";
    selectedSecondSquare.value = "";
  }
}
</script>

<template>
  <div class="map-container">
    <MapLegend 
    @select="(routeType) => {selectedFirstSquare = ''; selectedSecondSquare = ''; selectedRouteType = routeType}" 
    @modechange="(m) => {mode = m}"
    />
    <MapDiagram 
    @select="(square) => addSelectedSquare(square)" 
    :selected-square1="selectedFirstSquare" 
    :selected-square2="selectedSecondSquare"
    />
  </div>

</template>

<style scoped>
div.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  background-color: var(--gray5);
  max-height: 100dvh;
  overflow-y: scroll;
}
</style>