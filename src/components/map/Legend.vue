<script lang="ts" setup>
import {routeTypes} from "@/util";
import {ref} from "vue";
const emit = defineEmits(["select"]);
const selectedRouteType = ref("")

</script>

<template>
  <div class="legend">
    <div 
      class="legend-element" 
      v-for="[routeType, color] in Object.entries(routeTypes)" 
      @click="emit('select', routeType); selectedRouteType = routeType" 
      :class="{selected: routeType === selectedRouteType}"  
    >
      <hr :style="{'background-color': color, border:0}">
      <label>{{routeType}}</label>
    </div>
  </div>
</template>

<style scoped>
* {
  color: white;
}

div.legend {
  margin-top: 25px;
  width: 90%;
  flex: 1;
  background-color: var(--gray1);
  border-radius: 30px;
  min-height: 200px;
  padding-top: 20px;
  gap: 3px;
  display: flex;
  flex-direction: column;
}
div.selected {
  background-color: var(--gray3);
}
div.legend-element {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 5%;
  width: fit-content;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: var(--radius);
  cursor: pointer;
  & hr {
    width: 3.5em;
    flex-grow: 0;
    height: 8px;
    border-radius: var(--radius);
  }
  & label {
    flex-grow: 1;
    font-family: var(--rfont);
    font-size: var(--rfsize);
    margin-left: 0.3em;
  }
}
</style>