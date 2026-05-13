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
    <ul class="data-list dashboard">
      <li>
        <span class="first-row">
          <label>Premier point</label>
          <label>Deuxième point</label>
          <label>Type de route</label>
        </span>
        <button class="delete" style="visibility: hidden;"><Icon name="lucide:trash-2"/></button>
      </li> 
      <p class="empty" v-if="routes.length === 0">Aucune route n'est définie pour le moment</p>
      <li v-for="route in routes.sort(sortRoutes)" :key="route.firstEnd + route.secondEnd + route.type">
        <span>
          <label>{{route.firstEnd}}</label>
          <label>{{route.secondEnd}}</label>
          <label>{{route.type}}</label>
        </span>
        <button @click="deleteRoute(route)" class="delete"><Icon name="lucide:trash-2"/></button>
      </li>
    </ul>
    <form @submit.prevent="addRoute(addedRouteFirstEnd, addedRouteSecondEnd, addedRouteType)" class="centered">
      <div class="input-form-container centered">
        <label for="premier_point">Premier point</label>
        <select name="premier_point" id="premier_point" v-model="addedRouteFirstEnd">
          <option v-for="square in squares" :value="square">{{square}}</option>
        </select>
      </div>
      <div class="input-form-container centered">
        <label for="deuxieme_point">Deuxième point</label>
        <select name="deuxieme_point" id="deuxieme_point" v-model="addedRouteSecondEnd">
          <option v-for="square in squares" :value="square">{{square}}</option>
        </select>
      </div>
      <div class="input-form-container centered">
        <label for="route_type">Type de route</label>
        <select name="route_type" id="route_type" v-model="addedRouteType">
          <option v-for="type in Object.keys(routeTypes)" :value="type">{{type}}</option>
        </select>
      </div>
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