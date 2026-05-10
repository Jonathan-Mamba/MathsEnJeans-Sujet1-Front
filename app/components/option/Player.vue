<script setup lang="ts">
  import { GamePlayer } from "~/util";
  const { squares } = useGameSquares();
  const { players, addPlayer, modifyPlayer, deletePlayer } = useGamePlayers();

  const newPlayerName = ref<string>("");
  const newPlayerPosition = ref<string>("");
  const modifiedPlayerId = ref<string | null>(null);
  const modifiedPlayerName = ref<string>("");
  const modifiedPlayerPosition = ref<string>("");

  const setModifiedPlayer = (player: GamePlayer) => {
    modifiedPlayerId.value = player.id;
    modifiedPlayerName.value = player.name;
    modifiedPlayerPosition.value = player.position;
  }
</script>

<template>
  <div class="dialog-parent">
    <div :class="{blurred: modifiedPlayerId !== null, content: true, 'option-menu': true}">
      <p class="title">Joueurs</p>
      <ul class="data-list dashboard">
         <li>
          <span class="first-row">
            <label>Nom du joueur</label>
            <label>Position du joueur</label>
            <label>Couleur du joueur</label>
          </span>
          <button style="visibility: hidden;"><Icon name="lucide:edit"/></button>
          <button style="visibility: hidden;" class="delete"><Icon name="lucide:trash-2"/></button>
        </li>
        <p class="empty" v-if="players.length === 0">Aucun joueur n'est défini pour le moment</p>
        <li v-for="player in players" :key="player.id">
          <span>
            <label>{{player.name}}</label>
            <label>{{player.position}}</label>
            <label :style="{backgroundColor: player.color}">{{ player.color }}</label>
          </span>
          <button @click="setModifiedPlayer(player)"><Icon name="lucide:edit"/></button>
          <button @click="deletePlayer(player.id)" class="delete"><Icon name="lucide:trash-2"/></button>
        </li>
      </ul>
      <form class="centered" @submit.prevent="addPlayer(newPlayerName, newPlayerPosition); newPlayerName = ''; newPlayerPosition = ''">
        <div class="input-form-container centered">
          <label for="name">Nom du joueur </label>
          <input id="name" v-model="newPlayerName" type="text" required>
        </div>
        <div class="input-form-container centered">
          <label for="position">Position du joueur</label>
          <select id="position" v-model="newPlayerPosition">
            <option v-for="value in squares" :key="value">{{ value }}</option>
          </select>
        </div>
        <button type="submit" class="blue">Ajouter un joueur</button>
      </form>
    </div>
    <Dialog 
      v-if="modifiedPlayerId !== null"
      title="Modifier le joueur" 
      @confirm="modifyPlayer(modifiedPlayerId, modifiedPlayerName, modifiedPlayerPosition); modifiedPlayerId = null" 
      @cancel="modifiedPlayerId = null" 
    >
      <div class="input-form-container centered" style="margin-bottom: 5px;">
        <label for="name">Nom du joueur </label>
        <input id="name" v-model="modifiedPlayerName" type="text" required>
      </div>
      <div class="input-form-container centered">
        <label for="position">Position du joueur</label>
        <select id="position" v-model="modifiedPlayerPosition">
          <option v-for="value in squares" :key="value">{{ value }}</option>
        </select>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
@import "~/assets/option_menu.css";
</style> 