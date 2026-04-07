<script setup lang="ts">
import {ref} from "vue";
import {squares} from "@/refs";
import { useGameStatus, useGameControl } from '@/composables';

const { gameStatus, gameRunning, gameCompleted } = useGameStatus();
const { startGame, stopGame, simulateGame, movePlayer } = useGameControl();

const newPlayerPosition = ref<string>("");

</script>

<template>
<div class="option_menu">
  <p class="title" v-if="(!gameRunning) && (!gameCompleted)">Partie - En attente</p>
  <p class="title" v-else-if="gameRunning">Partie - En cours</p>
  <p class="title" v-else-if="gameCompleted">Partie - Terminée</p>

  <form v-if="!gameRunning" class="centered" @submit.prevent="">
    <button @click="startGame()" class="start blue">Jouer la partie</button>
    <button @click="simulateGame()" class="start blue">Simuler la partie</button>  
  </form>

  <form v-else-if="gameRunning" class="centered" @submit.prevent="">
    <div class="info_form_container">
      <label>Tour numéro</label>
      <span>{{ gameStatus.day_count }}</span>
    </div>
    <div class="info_form_container">
      <label>Type de jour</label>
      <span>{{ gameStatus.current_day_type }}</span>
    </div>
    <div class="info_form_container">
      <label>Nom du joueur</label>
      <span>{{ gameStatus.current_player.name }}</span>
    </div>
    <div class="info_form_container">
      <label>Position du joueur</label>
      <span>{{ gameStatus.current_player.position }}</span>
    </div>
    <hr>
    <div class="input_form_container">
      <label>Nouvelle position</label>
      <select v-model="newPlayerPosition">
        <option v-for="square in squares" :value="square">{{square}}</option>
      </select>
    </div>
    <button @click="movePlayer(newPlayerPosition, gameStatus.current_player.id)" class="blue">Déplacer le joueur</button>
  </form>
  <button v-if="gameRunning" @click="stopGame()" class="red">Arrêter la partie</button>
</div>
</template>
 
<style scoped>
@import "@/components/options/option_menu.css";
div.footer {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    flex: 1;
    margin-top: auto;
    margin-bottom: 5px;
}
button.start {
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 20px;
    margin-bottom: 20px;
}
button.red {
  margin-top: 20px;
  width: 80%;
}
button.blue {
  margin-bottom: 5px;
}
div.info_form_container {
  display: flex;
  flex-direction: row;
  background-color: var(--gray5);
  border-radius: var(--radius);
  overflow: hidden;
  & label {
    border-radius: var(--radius) 0 0 var(--radius);
    background-color: var(--gray3);
    height: 100%;
    flex: 1;
    text-align: center;
    font-size: var(--rfsize);
    text-overflow: ellipsis;
  }
  & span {
    max-width: 50%;
    border-radius: 0 var(--radius) var(--radius) 0;
    border: var(--gray5) solid 1px;
    flex: 1;
    background-color: var(--gray5);
    height: 100%;
    box-sizing: border-box;
    font-size: var(--rfsize);
    margin: 0;
    padding-left: 2px;
    padding-bottom: 5px;
    max-height: 1.15em;
    text-overflow: ellipsis;
    text-align: center;
  }
}
hr {
  width: 75%;
}
</style>