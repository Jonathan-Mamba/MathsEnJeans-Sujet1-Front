<script setup lang="ts">
import { MenuEditMode } from "~/util";
const emit = defineEmits(['modechange'])
</script>

<template>
<div class="menu-container">
  <button @click="emit('modechange', MenuEditMode.SQUARE)">Editer la carte</button>
  <button @click="emit('modechange', MenuEditMode.ROUTE)">Editer les routes</button>
  <button @click="emit('modechange', MenuEditMode.CALENDAR)">Editer le calendrier</button>
  <button @click="emit('modechange', MenuEditMode.PLAYER)">Gérer les joueurs</button>
  <button @click="emit('modechange', MenuEditMode.GAME)" class="play">Jouer</button>
</div>
</template>

<style scoped>
div.menu-container {
  display: flex;
  flex-direction: column;
  background-color: var(--gray1);
  overflow: scroll;
  height: 100vh;
}

button {
  height: 20vh;
  margin: 5px 10px 0px 10px;
  color: white;
  background-color: var(--gray3);
  border-radius: var(--radius);
  border: transparent solid 2px;
  font-family: var(--tfont);
  font-size: var(--tfsize);
  aspect-ratio: 4 / 5;
  overflow: hidden;
  text-overflow: ellipsis;
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