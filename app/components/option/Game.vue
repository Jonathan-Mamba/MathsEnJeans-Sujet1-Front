<script setup lang="ts">

const { gameStatus, gameNotStarted, gameRunning } = useGameStatus();
const { startGame, stopGame, simulateGame, movePlayer } = useGameControl();
const { squares } = useGameSquares();

const newPlayerPosition = ref<string>("");

</script>

<template>
<div class="option-menu">
  <p class="title" v-if="gameNotStarted">Partie - En attente</p>
  <p class="title" v-else-if="gameRunning">Partie - En cours</p>
  <p class="title" v-else>Partie - Terminée</p>

  <form v-if="!gameRunning" class="centered" @submit.prevent="">
    <button @click="startGame()" class="start blue">Jouer la partie</button>
    <button @click="(async () => {await startGame(); await simulateGame()})()" class="start blue">Simuler la partie</button>  
  </form>

  <form v-else class="centered" @submit.prevent="movePlayer(newPlayerPosition, gameStatus.current_player!.id)">
    <OptionFormEntry type="info" label="Tour numéro" :data="gameStatus.day_count"/>
    <OptionFormEntry type="info" label="Type de jour" :data="gameStatus.current_day_type"/>
    <OptionFormEntry type="info" label="Nom du joueur" :data="gameStatus.current_player!.name"/>
    <OptionFormEntry type="info" label="Position du joueur" :data="gameStatus.current_player!.position"/>
    <hr>
    <OptionFormEntry type="select" label="Nouvelle position" :options="squares" v-model="newPlayerPosition"/>
    <button type="submit" class="blue">Déplacer le joueur</button>
  </form>
  <button v-if="gameRunning" @click="stopGame()" class="red">Arrêter la partie</button>
</div>
</template>
 
<style scoped>
@import "~/assets/option_menu.css";
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
hr {
  width: 75%;
  margin-bottom: 5px;
}
</style>