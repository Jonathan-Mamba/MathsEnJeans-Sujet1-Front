<script setup lang="ts">
import { MenuEditMode } from "~/util";


const navItems = [
  { id: MenuEditMode.SQUARE, icon: 'lucide:layers', label: 'Configurer les cases' },
  { id: MenuEditMode.ROUTE, icon: 'lucide:route', label: 'Configurer les routes' },
  { id: MenuEditMode.CALENDAR, icon: 'lucide:calendar', label: 'Configurer le calendrier' },
  { id: MenuEditMode.PLAYER, icon: 'lucide:user', label: 'Gérer les joueurs' },
  { id: MenuEditMode.GAME, icon: 'lucide:play', label: 'Jouer' },
  { id: MenuEditMode.MAP, icon: 'lucide:map', label: 'Voir la carte'}
];
const bottomItems = [
  { icon: 'lucide:upload', label: "Importer des données de jeu", callback: async () => {} },
  { icon: 'lucide:download', label: "Exporter les données de jeu", callback: async () => {} },
  { icon: 'lucide:upload', label: "Importer des données de jeu", callback: async () => {} },
]

const selectItem = (itemId: MenuEditMode) => {
  useLayout().editMode.value = itemId;
};
</script>

<template>
  <aside class="menu-container">
    <div 
      v-for="item in navItems" 
      :key="item.id"
      class="nav-item centered"
      :class="{ active: useLayout().editMode.value === item.id, map: item.id === MenuEditMode.MAP }"
      @click="selectItem(item.id)"
    >
      <Icon :name="item.icon" class="icon"/>
      <div class="label">{{ item.label }}</div>
    </div>
    <div class="spacer"></div>
    <div 
    class="nav-item centered bottom"></div>
  </aside>
</template>

<style scoped>
div.spacer {
  flex: 1
}

aside.menu-container {
  width: var(--menu-width);
  height: 100vh;
  background-color: var(--gray2);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  overflow-x: visible; 
  position: relative;
}

div.nav-item {
  width: 90%;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: var(--radius);
  &:hover {
    border: 1px solid var(--blue);
    & .label {
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
    }
  }
  &.active {
    background-color: var(--gray1);
  }
  &.bottom:active {
    background-color: var(--gray1);
  }
  &.map {
    display: none;
  }
}

@media (max-width: 800px) {
  div.nav-item.map {
    display: flex;
  }
}

div.label {
  position: absolute;
  left: calc(100% + 5px);
  background-color: #252526;
  color: #cccccc;
  padding: 4px 12px;
  white-space: nowrap;
  font-size: calc(var(--rfsize) * 0.9);
  font-family: var(--rfont);
  border-radius: var(--radius);

  opacity: 0;
  visibility: hidden;
  transform: translateX(-5px);
  transition: all 0.15s ease-in-out;
  z-index: 10000;
}
</style>