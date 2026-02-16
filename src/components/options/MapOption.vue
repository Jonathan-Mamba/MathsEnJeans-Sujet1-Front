<script setup lang="ts">
  import {squares, getSquares} from "@/util";
  getSquares()
</script>

<template>
  <div class="option_menu">
    <p class="title">Carte</p>
    <ul class="data_list">
      <p class="empty" v-if="squares.length === 0">Aucune carte n'est définie pour le moment</p>
      <li v-for="square in squares" :key="square"><span>{{square}}</span></li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@import "@/components/options/option_menu.scss";
span {
  padding: 3px 0px 2px 0px;
  flex: 1;
}
</style>