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
    <div :class="{blurred: modifiedPlayerId !== null}" class="option-menu">
      <p class="title">Joueurs</p>
      <OptionDataList :items="players" empty-text="Aucun joueur présent pour le moment." @edit="setModifiedPlayer" @delete="(player, _) => deletePlayer(player.id)" :get-key="(p) => p.id" has-edit has-delete>
        <template #header>
          <label>Nom</label>
          <label>Position</label>
        </template>
        <template #row="{ item: player }">
          <label>{{ player.name }}</label>
          <label>{{ player.position }}</label>
        </template>
      </OptionDataList>
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