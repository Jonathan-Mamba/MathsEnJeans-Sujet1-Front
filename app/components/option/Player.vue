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
            <label>Nom</label>
            <label>Position</label>
          </span>
          <button style="visibility: hidden;" class="edit"><Icon name="lucide:edit"/></button>
          <button style="visibility: hidden;" class="delete"><Icon name="lucide:trash-2"/></button>
        </li>
        <p class="empty" v-if="players.length === 0">Aucun joueur n'est défini pour le moment</p>
        <li v-for="player in players" :key="player.id">
          <span>
            <label>{{player.name}}</label>
            <label>{{player.position}}</label>
          </span>
          <button @click="setModifiedPlayer(player)" class="edit"><Icon name="lucide:edit"/></button>
          <button @click="deletePlayer(player.id)" class="delete"><Icon name="lucide:trash-2"/></button>
        </li>
      </ul>
      <form class="centered" @submit.prevent="addPlayer(newPlayerName, newPlayerPosition); newPlayerName = ''; newPlayerPosition = ''">
        <OptionFormEntry type="input" label="Nom du joueur" v-model="newPlayerName"/>
        <OptionFormEntry type="select" label="Position du joueur" v-model="newPlayerPosition" :options="squares"/>
        <button type="submit" class="blue">Ajouter un joueur</button>
      </form>
    </div>
    <Dialog 
      v-if="modifiedPlayerId !== null"
      title="Modifier le joueur" 
      @confirm="modifyPlayer(modifiedPlayerId, modifiedPlayerName, modifiedPlayerPosition); modifiedPlayerId = null" 
      @cancel="modifiedPlayerId = null" 
    >
      <OptionFormEntry type="input" label="Nom du joueur" v-model="modifiedPlayerName"/>
      <OptionFormEntry type="select" label="Position du joueur" v-model="modifiedPlayerPosition" :options="squares"/>
    </Dialog>
  </div>
</template>

<style scoped>
@import "~/assets/option_menu.css";
</style> 