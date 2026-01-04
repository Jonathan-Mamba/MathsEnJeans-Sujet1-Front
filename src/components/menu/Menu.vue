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
  border-color: $gray10;
  border-width: 2px;
  border-radius: $radius 0 0 $radius;
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
}
button:hover {
  background-color: $gray4;
  border: $blue solid 2px;
}
button:active {
  background-color: $gray2;
}
button.play {
  margin-bottom: 5px;
  background-color: $blue;
  font-style: italic;
}
button.play:hover {
  background-color: $lightblue;
  border: $blue solid 2px;
}
button.play:active {
  background-color: $darkblue;
}
</style>