<script setup lang="ts">
  import Option from "@/components/options/Option.vue";
  import Menu from "@/components/menu/Menu.vue";
  import Carte from "@/components/map/Carte.vue";
  import { EditMode} from "@/util";
  import {ref} from "vue";

  const mode = ref(EditMode.NONE);
</script>

<template>
  <div class="container">
    <Menu @modechange="new_mode => {mode = new_mode;}"/>
    <Option :mode="mode"/>
    <Carte/>
  </div>
</template>

<style scoped>
div.container {
  display: flex;
  flex-direction: row;
  height: 99vh;
  margin-bottom: 10px;
}
</style>

<style>

</style>