<script setup lang="ts">
  import { EditMode } from "~/util";

  const props = defineProps<{
    mode: EditMode
  }>();

  const { error } = useGameState();
</script>

<template>
<div class="centered option-container">
  <div v-if="error" class="option-menu v">La connection avec le serveur n'a pas pu être établie. Veuillez actualiser la page pour réessayer.</div>
  <div v-else-if="mode === EditMode.NONE" class="option-menu v">Pas de mode sélectionné</div>
  <OptionSquare v-else-if="mode === EditMode.SQUARE"/>
  <OptionRoute v-else-if="mode === EditMode.ROUTE"/>
  <OptionCalendar v-else-if="mode === EditMode.CALENDAR"/>
  <OptionPlayer v-else-if="mode === EditMode.PLAYER"/>
  <OptionGame v-else-if="mode === EditMode.GAME"/>
</div>
</template>

<style scoped>
@import "~/assets/option_menu.css";
div.option-container {
  height: 100dvh;
  border-right: 3px solid #fff;
  border-left: 1px solid #fff;
  box-sizing: border-box;
}
div.v {
  font-size: var(--rfsize);
  justify-content: center;
  font-style: italic;
  text-align: center;
  text-decoration: underline;
}
</style>
