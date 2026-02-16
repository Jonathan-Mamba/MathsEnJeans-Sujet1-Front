<script setup lang="ts">
  import {EditMode, backendOrigin} from "@/util";
  import MapOption from "@/components/options/MapOption.vue";
  import RouteOption from "@/components/options/RouteOption.vue";
  import CalendarOption from "@/components/options/CalendarOption.vue";
  import PlayerOption from "@/components/options/PlayerOption.vue";
  import GameOption from "@/components/options/GameOption.vue";
  import Dialog from "@/components/Dialog.vue";
  import axios from "axios";
  import {onMounted, ref} from "vue";

  const props = defineProps<{
    mode: EditMode
  }>();

  const connection = ref(false);
  const connect = () => {
    axios.get(backendOrigin)
        .then((res) => {console.log(res.data); connection.value = (res.status === 200);})
        .catch((err) => {console.log(err);})
  }

  onMounted(() => {
    connect();
  })
</script>

<template>
<div class="centered">
  <Dialog :is_open="!connection" title="Erreur de connection" confirm_text="Resayer" @confirm="connect()">
    <p>Impossible de se connecter au serveur. Veuillez actualiser la page pour ressasyer.</p>
  </Dialog>
  <div v-if="!connection" class="option_menu v">La connection avec le serveur n'a pas pu être établie.</div>
  <div v-else-if="mode === EditMode.NONE" class="option_menu v">Pas de mode sélectionné</div>
  <MapOption v-else-if="mode === EditMode.MAP"/>
  <RouteOption v-else-if="mode === EditMode.ROUTE"/>
  <CalendarOption v-else-if="mode === EditMode.CALENDAR"/>
  <PlayerOption v-else-if="mode === EditMode.PLAYER"/>
  <GameOption v-else-if="mode === EditMode.GAME"/>
</div>
</template>

<style scoped lang="scss">
@import "@/components/options/option_menu";
div.centered {
  width: 40%;
  height: 100dvh;
}
div.v {
  font-size: $rfsize;
  justify-content: center;
  font-style: italic;
  text-decoration: underline;
}
</style>