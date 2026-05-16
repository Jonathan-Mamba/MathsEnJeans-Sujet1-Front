<script setup lang="ts">
  import { MenuEditMode } from "~/util";
  const mode = useLayout().editMode;
  const { error } = useGameState();
</script>

<template>
<div class="centered option-container">
  <div v-if="error" class="option-menu error-message">La connection avec le serveur n'a pas pu être établie. Veuillez actualiser la page pour réessayer.</div>
  <OptionSquare v-else-if="mode === MenuEditMode.SQUARE"/>
  <OptionRoute v-else-if="mode === MenuEditMode.ROUTE"/>
  <OptionCalendar v-else-if="mode === MenuEditMode.CALENDAR"/>
  <OptionPlayer v-else-if="mode === MenuEditMode.PLAYER"/>
  <OptionGame v-else-if="mode === MenuEditMode.GAME"/>
  <OptionHistory v-else-if="mode === MenuEditMode.HISTORY"/>
  <OptionMatrices v-else-if="mode === MenuEditMode.MATRICES"/>
</div>
</template>

<style scoped>
@import "~/assets/option_menu.css";
div.option-container {
  height: 100%;
  border-left: 1px solid #fff;
  box-sizing: border-box;
  overflow: auto;
}
div.error-message {
  font-size: var(--rfsize);
  justify-content: center;
  font-style: italic;
  text-align: center;
  text-decoration: underline;
}
</style>
