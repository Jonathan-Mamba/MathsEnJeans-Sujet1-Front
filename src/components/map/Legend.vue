<script lang="ts" setup>
  import {routeTypes, getRouteTypes} from "@/util";
  import { onMounted } from "vue";
  onMounted(() => {
    getRouteTypes();
  });
</script>

<template>
  <div class="legend">
    <div class="legend-element" v-for="routeType in Object.entries(routeTypes)">
      <hr :style="{'background-color':routeType[1], border:0}"><label>{{routeType[0]}}</label>
    </div>
  </div>
</template>

<style scoped lang="scss">
* {
  color: white;
}
div.legend {
  margin-top: 25px;
  width: 90%;
  flex: 1;
  background-color: $gray1;
  border-radius: 30px;
  min-height: 200px;
  padding-top: 20px;
}
div.legend-element {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 5%;
  hr {
    width: 8%;
    flex-grow: 0;
    height: 8px;
    border-radius: $radius;
  }
  label {
    flex-grow: 1;
    font-family: $rfont;
    font-size: $rfsize;
    margin-left: 3px;
  }
}
img {
  height: 90%;
  aspect-ratio: 1 / 1;
  margin: 8px;
}
</style>