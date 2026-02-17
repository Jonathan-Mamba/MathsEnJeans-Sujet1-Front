<script setup lang="ts">
  import axios from 'axios';
  import {backendOrigin, Player, squares} from "@/util";
  import {ref} from "vue";
  import Dialog from '@/components/Dialog.vue';

  const players = ref<Player[]>([]);
  const newPlayerName = ref<string>("");
  const newPlayerPosition = ref<string>("");
  const modifiedPlayerId = ref<string | null>(null);
  const modifiedPlayerName = ref<string>("");
  const modifiedPlayerPosition = ref<string>("");

  async function getPlayers() {
    try {
      const res = await axios.get(`${backendOrigin}/players`);
      players.value = res.data;
    } catch (err) {
      console.log(err);
    }
  }
  async function addPlayer() {
    try {
      await axios.post(`${backendOrigin}/players?name=${newPlayerName.value}&position=${newPlayerPosition.value}`);
      getPlayers();
    } catch (err) {
      console.log(err);
    }
  }
  async function deletePlayer(player_id: string) {
    try {
      await axios.delete(`${backendOrigin}/players?player_id=${player_id}`);
      getPlayers();
    } catch (err) {
      console.log(err);
    }
  }
  async function modifyPlayer() {
    try {
      await axios.put(`${backendOrigin}/players?player_id=${modifiedPlayerId.value}&new_name=${modifiedPlayerName.value}&new_position=${modifiedPlayerPosition.value}`);
      getPlayers();
    } catch (err) {
      console.log(err);
    }
  }
  getPlayers()  
</script>

<template>
  <div :class="{dialog_parent: true}">
    <div :class="{blurred: modifiedPlayerId !== null, content: true, option_menu: true}">
      <p class="title">Joueurs</p>
      <ul class="data_list dashboard">
         <li>
          <span>
            <label class="first_row">Nom du joueur</label>
            <label class="first_row">Position du joueur</label>
            <label class="first_row">Couleur du joueur</label>
          </span>
        </li>
        <p class="empty" v-if="players.length === 0">Aucun joueur n'est défini pour le moment</p>
        <li v-for="player in players" :key="player.id">
          <span>
            <label>{{player.name}}</label>
            <label>{{player.position}}</label>
            <label :style="{backgroundColor: player.color}">{{ player.color }}</label>
          </span>
          <button @click="modifiedPlayerId = player.id">Modifier</button>
          <button @click="deletePlayer(player.id)"><img src="/icons/trash-bin-red.png" class="delete"></button>
        </li>
      </ul>
      <form class="centered">
        <div class="input_form_container centered">
          <label for="name">Nom du joueur </label>
          <input id="name" v-model="newPlayerName" type="text" required>
        </div>
        <div class="input_form_container centered">
          <label for="position">Position du joueur</label>
          <select id="position" v-model="newPlayerPosition">
            <option v-for="value in squares" :key="value">{{ value }}</option>
          </select>
        </div>
        <button type="submit" @click.prevent="addPlayer()">Ajouter un joueur</button>
      </form>
    </div>
    <Dialog title="Modifier le joueur" :is_open="modifiedPlayerId !== null" @confirm="modifyPlayer(); modifiedPlayerId = null" @cancel="modifiedPlayerId = null">
      <div class="input_form_container centered" style="margin-bottom: 5px;">
        <label for="name">Nom du joueur </label>
        <input id="name" v-model="modifiedPlayerName" type="text" required>
      </div>
      <div class="input_form_container centered">
        <label for="position">Position du joueur</label>
        <select id="position" v-model="modifiedPlayerPosition">
          <option v-for="value in squares" :key="value">{{ value }}</option>
        </select>
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
@import "@/components/options/option_menu.scss";
ul.data_list {
  span {
    display: flex;
    flex-direction: row;
    label {
      text-align: center;
      overflow-x: hidden;
      text-overflow: ellipsis;
      width: 50%;
      border-radius: 5px;
      background-color: $gray7;
      margin: 5px;
    }
  }
}
</style>