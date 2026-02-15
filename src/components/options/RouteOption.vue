<script setup lang="ts">
  import axios from "axios";
  import {backendOrigin, routeTypes, squares, Route} from "@/util";
  import {Ref, ref} from "vue";

  const routes: Ref<Array<Route>> = ref([])
  const addedRouteFirstEnd: Ref<string> = ref("");
  const addedRouteSecondEnd: Ref<string> = ref("");
  const addedRouteType: Ref<string> = ref("");

  async function getRoutes() {
    try {
      const res = await axios.get(`${backendOrigin}/routes`);
      routes.value = res.data.map((r: any) => new Route(r.first_end, r.second_end, r.type));
    } catch (err) {
      console.log(err);
    }
  }
  async function addRoute() {
    try {
      await axios.post(`${backendOrigin}/routes?first_end=${addedRouteFirstEnd.value}&second_end=${addedRouteSecondEnd.value}&route_type=${addedRouteType.value}`);
      getRoutes();
    } catch (err) {
      console.log(err);
    }
  }
  async function deleteRoute(route: Route) {
    try {
      await axios.delete(`${backendOrigin}/routes?first_end=${route.first_end}&second_end=${route.second_end}&route_type=${route.type}`);
      getRoutes();
    } catch (err) {
      console.log(err);
    }
  }
  getRoutes()
</script>

<template>
  <div class="option_menu">
    <p class="title">Routes</p>
    <ul class="data_list">
      <p class="empty" v-if="routes.length === 0">Aucun itinéraire n'est défini pour le moment</p>
      <li v-else v-for="route in routes" :key="route.first_end + route.second_end + route.type">
        <span>
          <label>{{route.first_end}}</label>
          <label>{{route.second_end}}</label>
          <label>{{route.type}}</label>
        </span>
        <button @click="deleteRoute(route)"><img src="/icons/trash-bin-red.png" class="delete"></button>
      </li>
    </ul>
    <form @submit.prevent="addRoute()" class="centered">
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
          <option v-for="type in routeTypes" :value="type">{{type}}</option>
        </select>
      </div>
      <button type="submit">Ajouter la nouvelle route</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
  @import "@/components/options/option_menu.scss";
  div.option_menu {
    justify-content: center;
  }
  ul.data_list {
    overflow-x: scroll;
    span {
      display: flex;
      flex-direction: row;
      align-items:flex-start;
      width: fit-content;
      label {
        padding: 3px 5px 3px 5px;
        margin: 2px 2px 2px 2px;
        flex:1;
        text-align: center;
        width: 200px;
        background-color: $gray7;
        border-radius: $radius;
      }
    }
  }
  form {
    display: flex;
    flex-direction: column;
    width: 90%;
    background-color: transparent;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-top: 15px;
    border-radius: $radius;
    & .input_form_container {
      margin-bottom: 5px;
      min-width: 55%;
    }
    button {
      width: 70%;
    }
  }
</style>