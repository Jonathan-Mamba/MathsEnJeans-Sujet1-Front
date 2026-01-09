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

<style scoped lang="scss">
div.container {
  display: flex;
  flex-direction: row;
  min-height: 100dvh;
  flex: 1
}
</style>
