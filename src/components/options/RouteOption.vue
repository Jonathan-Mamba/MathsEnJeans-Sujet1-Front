<script setup lang="ts">
import axios from "axios";
import {backendOrigin, routeTypes, squares, Route, routes, getRoutes, addRoute} from "@/util";
import {Ref, ref} from "vue";
import { AxiosError } from 'axios';

const addedRouteFirstEnd: Ref<string> = ref("");
const addedRouteSecondEnd: Ref<string> = ref("");
const addedRouteType: Ref<string> = ref("");

function sortRoutes(route1: Route, route2: Route): number {
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

async function deleteRoute(route: Route) {
  try {
    await axios.delete(`${backendOrigin}/routes?first_end=${route.firstEnd}&second_end=${route.secondEnd}&route_type=${route.type}`);
    await getRoutes();
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      alert(`Erreur lors de la suppression de la route: ${err.response.data.detail}`);
    }
  }
}
getRoutes()
</script>

<template>
  <div class="option_menu">
    <p class="title">Routes</p>
    <ul class="data_list dashboard">
      <li>
        <span>
          <label class="first_row">Premier point</label>
          <label class="first_row">Deuxième point</label>
          <label class="first_row">Type de route</label>
        </span>
      </li>
      <p class="empty" v-if="routes.length === 0">Aucune route n'est définie pour le moment</p>
      <li v-for="route in routes.sort(sortRoutes)" :key="route.firstEnd + route.secondEnd + route.type">
        <span>
          <label >{{route.firstEnd}}</label>
          <label >{{route.secondEnd}}</label>
          <label >{{route.type}}</label>
        </span>
        <button @click="deleteRoute(route)"><img src="/icons/trash-bin-red.png" class="delete"></button>
      </li>
    </ul>
    <form @submit.prevent="addRoute(addedRouteFirstEnd, addedRouteSecondEnd, addedRouteType)" class="centered">
      <div class="input_form_container centered">
        <label for="premier_point">Premier point</label>
        <select name="premier_point" id="premier_point" v-model="addedRouteFirstEnd">
          <option v-for="square in squares" :value="square">{{square}}</option>
        </select>
      </div>
      <div class="input_form_container centered">
        <label for="deuxieme_point">Deuxième point</label>
        <select name="deuxieme_point" id="deuxieme_point" v-model="addedRouteSecondEnd">
          <option v-for="square in squares" :value="square">{{square}}</option>
        </select>
      </div>
      <div class="input_form_container centered">
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
@import "@/components/options/option_menu.css";
form {
  display: flex;
  flex-direction: column;
  width: 90%;
  background-color: var(--gray2);
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 15px;
  border-radius: var(--radius);
}

form .input_form_container {
  margin-bottom: 5px;
  min-width: 55%;
}

form button {
  width: 70%;
}
</style>