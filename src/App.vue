<script setup lang="ts">
import Menu from "@/components/menu/Menu.vue";
import Carte from "@/components/map/Carte.vue";
import {EditMode, getData} from "@/util";
import {ref} from "vue";
import OptionContainer from "@/components/options/OptionContainer.vue";

const mode = ref(EditMode.NONE);
getData();
console.log(import.meta.env.VITE_BACKEND_ORIGIN)
</script>

<template>
  <div class="container">
    <Menu @modechange="new_mode => {mode = new_mode;}"/>
    <OptionContainer :mode="mode"/>
    <Carte/>
  </div>
</template>

<style scoped>
div.container {
  display: flex;
  flex-direction: row;
  min-height: 100dvh;
  flex: 1;
  overflow: hidden;
}
</style>
