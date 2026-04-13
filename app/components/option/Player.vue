<script setup lang="ts">
  import { ref } from "vue";

  const { squares } = useSquares();
  const { players, addPlayer, modifyPlayer, deletePlayer } = usePlayers();

  const newPlayerName = ref<string>("");
  const newPlayerPosition = ref<string>("");
  const modifiedPlayerId = ref<string | null>(null);
  const modifiedPlayerName = ref<string>("");
  const modifiedPlayerPosition = ref<string>("");

</script>

<template>
  <div class="dialog-parent">
    <div :class="{blurred: modifiedPlayerId !== null, content: true, 'option-menu': true}">
      <p class="title">Joueurs</p>
      <ul class="data-list dashboard">
         <li>
          <span>
            <label class="first-row">Nom du joueur</label>
            <label class="first-row">Position du joueur</label>
            <label class="first-row">Couleur du joueur</label>
          </span>
        </li>
        <p class="empty" v-if="players.length === 0">Aucun joueur n'est défini pour le moment</p>
        <li v-for="player in players" :key="player.id">
          <span>
            <label>{{player.name}}</label>
            <label>{{player.position}}</label>
            <label :style="{backgroundColor: player.color}">{{ player.color }}</label>
          </span>
          <button @click="modifiedPlayerId = player.id; modifiedPlayerName = player.name; modifiedPlayerPosition = player.position">Modifier</button>
          <button @click="deletePlayer(player.id)"><img src="/icons/trash-bin-red.png" class="delete"></button>
        </li>
      </ul>
      <form class="centered">
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
        <button type="submit" @click.prevent="addPlayer(newPlayerName, newPlayerPosition)" class="blue">Ajouter un joueur</button>
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
@import "~/assets/style.css";
ul.data-list span {
  display: flex;
  flex-direction: row;
  & label {
    text-align: center;
    overflow-x: hidden;
    text-overflow: ellipsis;
    width: 50%;
    border-radius: 5px;
    background-color: var(--gray7);
    margin: 5px;
  }
}
</style>