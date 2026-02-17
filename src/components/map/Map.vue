<script setup lang="ts">
  import {squares} from "@/util";
  import {Ref, ref} from "vue";
  import { useElementSize } from "@vueuse/core";

  const mapSVG: Ref<SVGSVGElement | null> = ref(null);
  const { width, height } = useElementSize(mapSVG);
</script>

<template>
  <div class="map centered">
    <img src="/icons/placeholder.png" alt="Placeholder">
  </div>
</template>

<style scoped lang="scss">
@import "@/components/options/option_menu.scss";
div.map {
  width: 90%;
  aspect-ratio: 1 / 1;
  background-color: #fff;
  border-radius: 30px;
  margin-bottom: 25px;
}
img {
  height: 90%;
  aspect-ratio: 1 / 1;
}
svg {
  width: 95%;
  height: 95%;
  overflow: hidden;
}
</style>       