<script setup lang="ts">
import {EditMode} from '@/util.js'
const emit = defineEmits(['modechange'])
</script>

<template>
<div class="c">
  <button @click="emit('modechange', EditMode.MAP)">Editer la carte</button>
  <button @click="emit('modechange', EditMode.ROUTE)">Editer les routes</button>
  <button @click="emit('modechange', EditMode.CALENDAR)">Editer le calendrier</button>
  <button @click="emit('modechange', EditMode.PLAYER)">Gérer les joueurs</button>
  <button @click="emit('modechange', EditMode.GAME)" class="play">Jouer</button>
</div>
</template>

<style scoped lang="scss">
div.c {
  display: flex;
  flex-direction: column;
  width: 10%;
  background-color: $gray1;
  border-style: none solid none none;
  border-color: $partborder;
  border-width: 2px;
  border-radius: 0;
  z-index: 1001;
}
button {
  height: 20%;
  margin-top: 5px;
  margin-right: 10px;
  margin-left: 10px;
  color: white;
  background-color: $gray3;
  border-radius: $radius;
  border: none;
  font-family: $tfont;
  font-size: $tfsize;
  :hover {
    background-color: $gray4;
    border: $blue solid 2px;
  }
  :active {
    background-color: $gray2;
  }
  &.play {
    margin-bottom: 5px;
    background-color: $blue;
    font-style: italic;
    &:hover {
      background-color: $lightblue;
      border: $blue solid 2px;
    }
    &:active {
      background-color: $darkblue;
    }
  }
}
</style>