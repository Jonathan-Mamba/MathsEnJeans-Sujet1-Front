<script setup lang="ts">
import Legend from './Legend.vue';
import Map from './Map.vue';
</script>

<template>
  <div class="container_map">
    <Legend></Legend>
    <Map></Map>
  </div>
</template>

<style scoped lang="scss">
div.container_map {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  gap: 25px;
  background-color: $gray5;
  max-height: 100dvh;
  overflow-y: scroll;
}
</style>