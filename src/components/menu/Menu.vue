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

<style scoped>
div.c {
  display: flex;
  flex-direction: column;
  width: 10%;
  background-color: var(--gray1);
  z-index: 1001;
  flex-grow: 0;
  flex-shrink: 0;
}

button {
  height: 20%;
  margin-top: 5px;
  margin-right: 10px;
  margin-left: 10px;
  color: white;
  background-color: var(--gray3);
  border-radius: var(--radius);
  border: none;
  font-family: var(--tfont);
  font-size: var(--tfsize);
  
  &:hover {
    background-color: var(--gray4);
    border: var(--blue) solid 2px;
  }
  
  &:active {
    background-color: var(--gray2);
  }
  
  &.play {
    margin-bottom: 5px;
    background-color: var(--blue);
    font-style: italic;
    
    &:hover {
      background-color: var(--lightblue);
      border: var(--blue) solid 2px;
    }
    
    &:active {
      background-color: var(--darkblue);
    }
  }
}
</style>