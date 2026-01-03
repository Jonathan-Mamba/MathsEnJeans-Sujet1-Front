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
  <button @click="emit('modechange', EditMode.GAME)">Jouer</button>
</div>
</template>

<style scoped>
div.c {
  display: flex;
  flex-direction: column;
  width: 10%;
}
button {
  height: 20%;
  margin: 5px;
}
</style>