<script setup lang="ts">
const { gameHistory } = useGameHistory()
const { players } = useGamePlayers()

const getPlayerNameById = (id: string): string => {
  return players.value.filter((p) => p.id === id)[0]?.name ?? ""
}

const renderedHistory = computed<string[][]>(() => {
  const result: string[][] = []
  
  for (const [index, entry] of gameHistory.value.entries()) {
    for (const move of entry.moves) {
      result.push([String(index + 1), entry.day_type, getPlayerNameById(move[0]), move[1], move[2]])
    }
  }

  return result
}) 
</script>

<template>
<div class="option-menu">
  <p class="title">Historique</p>
  <OptionDataList :items="renderedHistory" empty-text="L'historique est vide." :get-key="(item) => item.join(':::')">
    <template #header>
      <label v-for="value in ['Numéro du jour', 'Type de jour', 'Nom du joueur', 'Case initiale', 'Case finale']">{{ value }}</label>
    </template>
    <template #row="{ item }">
      <label v-for="column in item">{{ column }}</label>
    </template>
  </OptionDataList>
</div>
</template>

<style scoped>
@import "~/assets/option_menu.css";
</style> 