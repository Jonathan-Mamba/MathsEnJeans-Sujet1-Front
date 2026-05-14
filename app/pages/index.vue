<script setup lang="ts">
import { MenuEditMode, backendOrigin, clamp } from "~/util";
import { setupSSE } from "~/sseHandlers";
import { useElementSize, useWindowSize, useEventListener } from "@vueuse/core";

useHead({
  title: "Math en Jeans - Conception d'un jeu de role diabolique (éditeur de jeu)",
  meta: [
    {
      name: "description",
      content: "Editeur de jeu pour le projet de Math en Jeans - Conception d'un jeu de rôle diabolique"
    }
  ]
})

const { pending, error, loadInitialData } = useGameState();

await loadInitialData();

onMounted(() => {
  setupSSE(new EventSource(new URL("/events", backendOrigin).href), "1");
})

const optionWidth = ref(40);
const isResizing = ref(false);
const resizeStartX = ref(0);
const resizeStartWidth = ref(0);
const appContainerRef = ref<HTMLElement | null>(null);
const gameMenuRef = ref<HTMLElement | null>(null)
const splitterRef = ref<HTMLElement | null>(null)
const { width: containerWidth } = useElementSize(appContainerRef)
const { width: menuWidth } = useElementSize(gameMenuRef);
const { width: splitterWidth } = useElementSize(splitterRef);

function startResize(e: MouseEvent) {
  isResizing.value = true;
  resizeStartX.value = e.clientX;
  resizeStartWidth.value = optionWidth.value;
}

const modifyWidth = (e: MouseEvent) => {
  if (!isResizing.value || !containerWidth || !gameMenuRef.value) return;

  const availableWidth = containerWidth.value - menuWidth.value - splitterWidth.value;
  const delta = e.clientX - resizeStartX.value;
  let newWidth = resizeStartWidth.value + (delta / availableWidth) * 100;
  newWidth = clamp(newWidth, 0, availableWidth / containerWidth.value * 100)
  optionWidth.value = newWidth;
}

document.addEventListener("mouseup", () => isResizing.value = false)

const { editMode, tabletLayoutThreshold } = useLayout();
const { width: windowWidth } = useWindowSize();

watchEffect(() => {
  if (editMode.value === MenuEditMode.MAP && windowWidth.value > tabletLayoutThreshold) {
    editMode.value = MenuEditMode.SQUARE
  }
})
</script>

<template>
  <div ref="appContainerRef" class="app-container" :class="{ resizing: isResizing }" @mousemove="modifyWidth">
    <GameMenu class="game-menu" ref="gameMenuRef"/>
    <OptionContainer v-if="editMode !== MenuEditMode.MAP || windowWidth > tabletLayoutThreshold" :style="{ flex: `0 0 ${optionWidth}%` }"/>
    <div class="splitter" @mousedown="startResize" ref="splitterRef"/>
    <MapContainer v-if="editMode === MenuEditMode.MAP || windowWidth > tabletLayoutThreshold" class="map-panel"/>
  </div>
</template>

<style scoped>
div.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}
div.app-container.resizing {
  cursor: col-resize;
  user-select: none;
}
.game-menu {
  flex: 0 0 var(--menu-width);
}
.map-panel {
  flex: 1 1 0;
  min-width: 0;
}
div.splitter {
  width: 4px;
  cursor: col-resize;
  background: white;
  flex-shrink: 0;
}
div.splitter:hover, div.app-container.resizing div.splitter {
  background: #888;
}

@media (max-width: 800px) {
  div.splitter {
    display: none;
  }
  .option-container {
    flex: 1 0 0 !important;
  }
  .map-panel {
    flex: 1 0 0;
  }
}
</style>
