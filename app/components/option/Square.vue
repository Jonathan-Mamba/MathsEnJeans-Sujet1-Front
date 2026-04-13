<script setup lang="ts">
  const { squares } = useSquares();
</script>

<template>
  <div class="option-menu">
    <p class="title">Carte</p>
    <ul class="data-list">
      <p class="empty" v-if="squares.length === 0">Aucune carte n'est définie pour le moment</p>
      <li v-for="square in squares" :key="square"><span>{{square}}</span></li>
    </ul>
  </div>
</template>

<style scoped>
@import "~/assets/option_menu.css";
span {
  padding: 3px 0px 2px 0px;
  flex: 1;
}
</style>