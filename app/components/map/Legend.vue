<script lang="ts" setup>
const { gameRunning } = useGameStatus();
const { routeTypes } = useGameRouteTypes();
const emit = defineEmits(["select", "modechange"]);
const selectedRouteType = ref<string>("")
</script>

<template>
  <div class="legend">
    <div 
      class="legend-element" 
      v-for="[routeType, color] in Object.entries(routeTypes)" 
      @click="emit('select', routeType); selectedRouteType = routeType" 
      :class="{selected: routeType === selectedRouteType}"  
    >
      <hr :style="{'background-color': color, border:0}" class="route-color">
      <span>{{routeType}}</span>
    </div>
    <hr class="part-separator" v-if="!gameRunning">
    <div class="legend-element" v-if="!gameRunning">
      <label>
        <input type="radio" name="a" @input="emit('modechange', 'delete')">
        Supprimer une route
      </label>
    </div>
    <div class="legend-element" v-if="!gameRunning">
      <label>
        <input type="radio" name="a" @input="emit('modechange', 'add')" placeholder="true">
        Ajouter une route
      </label>
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
  flex: 1 0 auto;
  background-color: var(--gray1);
  border-radius: 30px;
  min-height: 200px;
  padding-top: 20px;
  padding-bottom: 20px;
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
  & hr.route-color {
    width: 3.5em;
    flex-grow: 0;
    height: 8px;
    border-radius: var(--radius);
  }
  & span {
    flex-grow: 1;
    font-family: var(--rfont);
    font-size: var(--rfsize);
    margin-left: 0.3em;
  }
}
input[type="radio"], label {
  margin-left: 0px;
  font-family: var(--rfont);
  font-size: var(--rfsize);
}
hr.part-separator {
  width: clamp(10%, 20em, 50%);
  display: inline-block;
  margin-left: 5%;

}
</style>