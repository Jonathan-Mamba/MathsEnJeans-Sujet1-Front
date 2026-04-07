<script setup lang="ts">
import Menu from "@/components/menu/Menu.vue";
import Carte from "@/components/map/Carte.vue";
import {EditMode} from "@/util";
import { loadInitialData } from "./composables";
import {ref, onMounted} from "vue";
import OptionContainer from "@/components/options/OptionContainer.vue";

const mode = ref(EditMode.NONE);
onMounted(() => {
  loadInitialData();
});
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
  display: grid;
  grid-template-columns: 10% 40% 50%;
}
</style>
