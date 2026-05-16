<script setup lang="ts">
const { gameHistory } = useGameHistory()
const { players } = useGamePlayers()

const getPlayerNameById = (id: string): string | null => {
  for (const player of players.value) {
    if (player.id === id) {
      return player.name
    }
  }
  return null
}

const renderedHistory = computed<[string, string, string, string, string][]>(() => {
  const result: [string, string, string, string, string][] = []
  
  for (const [index, entry] of gameHistory.value.entries()) {
    for (const move of entry.moves) {
      result.push([String(index + 1), entry.day_type, getPlayerNameById(move[0]) ?? "", move[1], move[2]])
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
    <template #row="{ item: entry }">
      <label v-for="item in entry">{{ item }}</label>
    </template>
  </OptionDataList>
</div>
</template>

<style scoped>
@import "~/assets/option_menu.css";
</style> 