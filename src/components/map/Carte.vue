<script setup>

</script>

<template>
<div class="container">
<div class="legend centered"><img src="/icons/placeholder.png"></div>
<div class="map centered"><img src="/icons/placeholder.png"></div>
</div>
</template>

<style scoped lang="scss">
div.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 25px;
  background-color: $gray5;
  max-height: 100dvh;
  overflow-y: scroll;
}
div.map {
  width: 90%;
  aspect-ratio: 1 / 1;
  background-color: #fff;
  border-radius: 30px;
  margin-bottom: 25px;
}
div.legend {
  margin-top: 25px;
  width: 90%;
  flex: 1;
  background-color: $gray1;
  border-radius: 30px;
  min-height: 200px;
}
img {
  height: 90%;
  aspect-ratio: 1 / 1;
}
</style>