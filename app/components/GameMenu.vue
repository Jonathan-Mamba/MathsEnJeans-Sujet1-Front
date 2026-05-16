<script setup lang="ts">
import { MenuEditMode, commonUploader } from "~/util";
import { toast } from 'vue3-toastify'

// --- New Imports & Refs for Import ---
const fileInput = ref<HTMLInputElement | null>(null);

const navItems = [
  { id: MenuEditMode.SQUARE, icon: 'lucide:layers', label: 'Configurer les cases' },
  { id: MenuEditMode.ROUTE, icon: 'lucide:route', label: 'Configurer les routes' },
  { id: MenuEditMode.CALENDAR, icon: 'lucide:calendar', label: 'Configurer le calendrier' },
  { id: MenuEditMode.PLAYER, icon: 'lucide:user', label: 'Gérer les joueurs' },
  { id: MenuEditMode.HISTORY, icon: 'lucide:history', label: 'Voir l\'historique de jeu'},
  { id: MenuEditMode.MATRICES, icon: 'lucide:calculator', label: 'Tester des matrices'},
  { id: MenuEditMode.MAP, icon: 'lucide:map', label: 'Voir la carte'},
  { id: MenuEditMode.GAME, icon: 'lucide:play', label: 'Jouer' },
];

const selectItem = (itemId: MenuEditMode) => {
  useLayout().editMode.value = itemId;
};

// --- Updated Import Logic ---
const triggerImport = () => {
  fileInput.value?.click();
};

const handleImport = async (event: Event) => {
const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const jsonData = JSON.parse(await file.text());

    const response = await commonUploader("/import", "POST", jsonData, "Erreur lors de l'import des données");
    if (response) {
      toast.success("Données importées avec succès.")
    }
  } catch (error) {
    console.error("Erreur de lecture :", error);
    toast.error("Le fichier n'est pas un JSON valide.")
  } finally {
    if (fileInput.value) fileInput.value.value = '';
  }
};

const exportData = async () => {
    const response = await commonUploader("/export", "GET", {}, "Erreur lors de l'export des données");
    if (response === null) return;
    
    const jsonString = JSON.stringify(response, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = 'game-data.json';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
</script>

<template>
  <aside class="menu-container">
    <input type="file" ref="fileInput" accept=".json" style="display: none;" @change="handleImport"/>
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

    <div class="nav-item centered bottom" @click="triggerImport">
      <Icon name="lucide:upload" />
      <div class="label">Importer les données de jeu</div>
    </div>

    <div class="nav-item centered bottom" @click="exportData">
      <Icon name="lucide:download" />
      <div class="label">Exporter les données de jeu</div>
    </div>
  </aside>
</template>

<style scoped>
div.spacer {
  height: 1px;
  background-color: white;
  margin: 5px 0;
  width: 80%;
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
  display: flex; /* Ensure centered works */
  justify-content: center;
  align-items: center;
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
  &.active, &.bottom:active {
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