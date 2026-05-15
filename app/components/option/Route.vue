<script setup lang="ts">
import { GameRoute } from "~/util";
const { squares } = useGameSquares();
const { routes, routeTypes, addRoute, deleteRoute } = useGameRoutes();

const addedRouteFirstEnd: Ref<string> = ref("");
const addedRouteSecondEnd: Ref<string> = ref("");
const addedRouteType: Ref<string> = ref("");

function sortRoutes(route1: GameRoute, route2: GameRoute): number {
  const route1FirstEndIndex = squares.value.indexOf(route1.firstEnd);
  const route1SecondEndIndex = squares.value.indexOf(route1.secondEnd);
  const route2FirstEndIndex = squares.value.indexOf(route2.firstEnd);
  const route2SecondEndIndex = squares.value.indexOf(route2.secondEnd);

  if (route1FirstEndIndex !== route2FirstEndIndex) {
    return route1FirstEndIndex - route2FirstEndIndex;
  } else if (route1SecondEndIndex !== route2SecondEndIndex) {
    return route1SecondEndIndex - route2SecondEndIndex;
  } else {
    return 0;
  }
}
</script>

<template>
  <div class="option-menu">
    <p class="title">Routes</p>
    <OptionDataList empty-text="Aucune route n'est définie pour le moment." :items="routes.sort(sortRoutes)" @delete="deleteRoute">
      <template #header>
        <label>Premier point</label>
        <label>Deuxième point</label>
        <label>Type de route</label>
      </template>
      <template #row="{ item: route }">
          <label>{{route.firstEnd}}</label>
          <label>{{route.secondEnd}}</label>
          <label>{{route.type}}</label>
      </template>
    </OptionDataList>
    <form @submit.prevent="addRoute(addedRouteFirstEnd, addedRouteSecondEnd, addedRouteType)" class="centered">
      <OptionFormEntry type="select" :options="squares" label="Premier point" v-model="addedRouteFirstEnd"/>
      <OptionFormEntry type="select" :options="squares" label="Deuximème point" v-model="addedRouteSecondEnd"/>
      <OptionFormEntry type="select" :options="Object.keys(routeTypes)" label="Type de route" v-model="addedRouteType"/>
      <button type="submit" class="blue">Ajouter la nouvelle route</button>
    </form>
  </div>
</template>

<style scoped>
@import "~/assets/option_menu.css";
form {
  display: flex;
  flex-direction: column;
  width: 90%;
  background-color: var(--gray2);
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 15px;
  border-radius: var(--radius);
  & button {
    width: 70%;
  }
  & .input-form-container {
    margin-bottom: 5px;
    min-width: 55%;
  }
}
</style>