<script setup lang="ts">
  import {EditMode, backendOrigin} from "@/util.ts";
  import MapOption from "@/components/options/MapOption.vue";
  import RouteOption from "@/components/options/RouteOption.vue";
  import CalendarOption from "@/components/options/CalendarOption.vue";
  import PlayerOption from "@/components/options/PlayerOption.vue";
  import GameOption from "@/components/options/GameOption.vue";
  import axios from "axios";
  import {onMounted, ref} from "vue";

  const props = defineProps<{
    mode: EditMode
  }>();

  const connection = ref(0);

  onMounted(() => {
    axios.get(backendOrigin)
        .then((res) => {console.log(res.data); connection.value = (res.status === 200);})
        .catch((err) => {console.log(err);})
  })
</script>

<template>
<div class="centered">
  <div v-if="!connection">La connection avec le serveur n'a pas pu etre etablie.</div>
  <div v-else-if="mode === EditMode.NONE">Pas de mode sélectionné</div>
  <MapOption v-else-if="mode === EditMode.MAP"/>
  <RouteOption v-else-if="mode === EditMode.ROUTE"/>
  <CalendarOption v-else-if="mode === EditMode.CALENDAR"/>
  <PlayerOption v-else-if="mode === EditMode.PLAYER"/>
  <GameOption v-else-if="mode === EditMode.GAME"/>
</div>
</template>

<style scoped>
div.centered {
  width: 40%;
  height: 100%;
}
</style>