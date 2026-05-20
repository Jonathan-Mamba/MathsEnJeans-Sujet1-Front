<script setup lang="ts">
import { GameRoute, clamp, MenuEditMode } from "~/util";
import { useElementSize } from "@vueuse/core";
import diagramStyle from "~/assets/map_diagram.json";

const { squares } = useGameSquares();
const { routes, routeTypes, routeTypeAll } = useGameRoutes();
const { players } = useGamePlayers();
const { editMode } = useLayout()
const { gameRunning, gameStatus } = useGameState()

const mapSVG: Ref<SVGSVGElement | null> = ref(null);
const openDropdown = ref<string>("")
const { width, height } = useElementSize(mapSVG);

const emit = defineEmits(["select"])
const props = defineProps<{
  selectedSquare1: string,
  selectedSquare2: string,
  disableGrayRoutes: boolean
}>();

const isRouteGray = (route: DrawnRoute): boolean => {
  if (!gameRunning.value) return false
  if ([route.regularRoute.firstEnd, route.regularRoute.secondEnd].every((end) => end !== gameStatus.value.current_player!.position)) {
    return true
  }
  return [gameStatus.value.current_day_type ?? "", routeTypeAll.value].every((t) => t !== route.regularRoute.type)
}


const getPlayersInSquare = (squareName: string) => (players.value.filter((p) => p.position === squareName));

const toggleDropdown = (squareName: string) => {
  openDropdown.value = openDropdown.value === squareName ? "" : squareName;
};

class Vector2 {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  public add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  } 
  public sub(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y)
  }
  public rotate(angle: number): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }
  public copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
class DrawnRoute {
  firstEnd: Vector2;
  secondEnd: Vector2;
  color: string;
  curved: boolean = false;
  circleCenter: Vector2 = new Vector2();
  circleRadius: number = 0;
  id: string;
  regularRoute: GameRoute
  constructor(firstEnd: Vector2, secondEnd: Vector2, color: string, curved: boolean = false, id: string, regularRoute: GameRoute) {
    this.firstEnd = firstEnd;
    this.secondEnd = secondEnd;
    this.color = color;
    this.curved = curved;
    this.id = id
    this.regularRoute = regularRoute
  }
  public static fromRoute(route: GameRoute, squarePositions: Vector2[]): DrawnRoute {
    const firstEnd = squarePositions[squares.value.indexOf(route.firstEnd)];
    const secondEnd = squarePositions[squares.value.indexOf(route.secondEnd)];
    const color = routeTypes.value[route.type];
    const curved = route.firstEnd === route.secondEnd;
    const id = `${route.firstEnd}:::${route.secondEnd}:::${route.type}`
    return new DrawnRoute(firstEnd!.copy(), secondEnd!.copy(), color!, curved, id, route);
  }
  public setCircleCenter(mapCenter: Vector2, circleRadius: number, squareSize: Vector2, offset: number = 0): Vector2 {
    if (!this.curved) {
      throw Error("route is not curved");
    }
    const dx = this.firstEnd.x - mapCenter.x;
    const dy = this.firstEnd.y - mapCenter.y;
    const circleVector = new Vector2();
    if (dx > 0 && dx > dy) { // right
      circleVector.x = squareSize.x / 2 + circleRadius + offset;
    } else if (dx < 0 && dx < dy) { // left
      circleVector.x = -squareSize.x / 2 - circleRadius - offset;
    } else if (dy < 0 && dy < dx) { // up
      circleVector.y = -squareSize.y / 2 - circleRadius - offset;
    } else { // down
      circleVector.y = squareSize.y / 2 + circleRadius + offset;
    }
    this.circleCenter = this.firstEnd.add(circleVector);
    this.circleRadius = circleRadius;
    return this.firstEnd.add(circleVector);
  }
}

const squareSize: Ref<Vector2> = computed(() => {
  const stepRange = diagramStyle.maxSizeThreshold - diagramStyle.minSizeThreshold;
  
  const widthFactor = (diagramStyle.maxSquareFactor[0]! - diagramStyle.minSquareFactor[0]!) / stepRange;
  const widthB = diagramStyle.maxSquareFactor[0]! - widthFactor * diagramStyle.maxSizeThreshold
  const widthValue = widthB + widthFactor * squares.value.length;
  
  const heightFactor = (diagramStyle.maxSquareFactor[1]! - diagramStyle.minSquareFactor[1]!) / stepRange;
  const heightB = diagramStyle.maxSquareFactor[1]! - heightFactor * diagramStyle.maxSizeThreshold
  const heightValue = heightB + heightFactor * squares.value.length;

  return new Vector2(
    clamp(widthValue * width.value, diagramStyle.minSquareFactor[0]! * width.value, diagramStyle.maxSquareFactor[0]! * width.value),  
    clamp(heightValue * height.value, diagramStyle.minSquareFactor[1]! * height.value, diagramStyle.maxSquareFactor[1]! * height.value)
  );
});

const squareFontSize = computed(() => diagramStyle.squareFontSize * Math.hypot(squareSize.value.x, squareSize.value.y))
const center = computed(() => (new Vector2(width.value * 0.5, height.value * 0.5)));

const squarePositions: Ref<Vector2[]> = computed(() => {
  const result: Vector2[] = [];
  const radiusVector = new Vector2(0, -diagramStyle.diagramRadius * height.value);
  const angle = 2 * Math.PI / squares.value.length;

  if (squares.value.length === 1) {
    return [center.value];
  }

  for (let i = 0; i < squares.value.length; i++) {
    const position = center.value.add(radiusVector.rotate(angle * i));
    result.push(position);
  }
  return result;
});

const drawnRoutes: Ref<DrawnRoute[]> = computed(() => {
  const result: DrawnRoute[] = [];
  const routeMap: Map<string, GameRoute[]> = new Map();
  const lineOffset = diagramStyle.lineWidth * 2;
  const circleRadius = diagramStyle.circleRouteRadius;

  for (const route of routes.value) {
    const key = [route.firstEnd, route.secondEnd].sort().join(":::");
    if (!routeMap.has(key)) {
      routeMap.set(key, []);
    }
    routeMap.get(key)!.push(route);
  }
  for (const routeGroup of routeMap.values()) {
    for (let i = 0; i < routeGroup.length; i++) {
      const drawnRoute = DrawnRoute.fromRoute(routeGroup[i]!, squarePositions.value);
      let { x: dx, y: dy } = drawnRoute.firstEnd.sub(drawnRoute.secondEnd);
      if (drawnRoute.curved) {
        drawnRoute.setCircleCenter(center.value, circleRadius, squareSize.value, diagramStyle.circleCenterOffset);
        drawnRoute.circleRadius = circleRadius + lineOffset * i;
      } else if (-1 < dy / dx && dy / dx < 1) { // vertical
        drawnRoute.firstEnd.y += lineOffset * i;
        drawnRoute.secondEnd.y += lineOffset * i;
      } else { // horizontal
        drawnRoute.firstEnd.x += lineOffset * i;
        drawnRoute.secondEnd.x += lineOffset * i;
      }
      result.push(drawnRoute);
    }
  }
  return result;
});

const getDropdownStyle = (index: number) => {
  const pos = squarePositions.value[index]!;
  const sqW = squareSize.value.x;
  const sqH = squareSize.value.y;

  // Estimate dropdown size
  const dropdownW = diagramStyle.dropdownSize[0]! * width.value;
  const dropdownH = diagramStyle.dropdownSize[1]! * height.value;

  const nearBottom = pos.y + sqH / 2 + dropdownH > height.value;
  const nearRight  = pos.x + sqW / 2 + dropdownW > width.value;

  return {
    width: Math.round(dropdownW) + 'px',
    height: Math.round(dropdownH) + 'px',
    // Horizontal: align to left edge of square, flip to right-align if near right edge
    left:  nearRight ? 'auto' : Math.round(pos.x - sqW / 2) + 'px',
    right: nearRight ? Math.round(width.value - (pos.x + sqW / 2)) + 'px' : 'auto',
    // Vertical: open below square, flip above if near bottom
    top:    nearBottom ? 'auto' : Math.round(pos.y + sqH / 2) + 'px',
    bottom: nearBottom ? Math.round(height.value - (pos.y - sqH / 2)) + 'px' : 'auto',
    'font-size': Math.round(squareFontSize.value * 0.8) + 'px'
  };
};
</script>

<template>
  <div class="map">
    <svg ref="mapSVG" class="map-svg">
      <TransitionGroup name="fade-in">
        <path
        v-for="route in drawnRoutes.filter(r => !r.curved)"
        :key="route.id"
        :d="`M ${Math.round(route.firstEnd.x)} ${Math.round(route.firstEnd.y)} L ${Math.round(route.secondEnd.x)} ${Math.round(route.secondEnd.y)}`"
        :stroke="route.color"
        :stroke-width="diagramStyle.lineWidth"
        :class="{ gray: disableGrayRoutes ? false : isRouteGray(route) }"
        />
        <circle 
        v-for="route in drawnRoutes.filter(r => r.curved)"
        :cx="Math.round(route.circleCenter.x)" 
        :cy="Math.round(route.circleCenter.y)" 
        :r="Math.round(route.circleRadius)" 
        :stroke="route.color" 
        :stroke-width="diagramStyle.lineWidth"
        :class="{ gray: disableGrayRoutes ? false : isRouteGray(route) }"
        :key="route.id"
        fill="none"
        />
      </TransitionGroup>
    </svg>
    <div class="text-overlay">
      <TransitionGroup name="fade-in">
        <div 
        v-for="[index, square] in squares.entries()" 
        class="square-text-rect centered"
        :class="{
          selected: props.selectedSquare1 === square || props.selectedSquare2 === square, 
          outlined: gameStatus.current_player?.position === square
        }"
        @click="!gameRunning ? emit('select', square) : null"
        :key="'text-' + index"
        :style="{
          left: Math.round(squarePositions[index]!.x - squareSize.x / 2) + 'px',
          top: Math.round(squarePositions[index]!.y - squareSize.y / 2) + 'px',
          width: Math.round(squareSize.x) + 'px',
          height: Math.round(squareSize.y) + 'px',
          'font-size': Math.round(squareFontSize) + 'px' 
        }"
        >
          <span >{{ square }}</span>
          <button :style="{'font-size': Math.round(squareFontSize) + 'px'}" @click.stop="toggleDropdown(square)">
            <Icon name="lucide:users" class="icon"/>
            {{ getPlayersInSquare(square).length }}
          </button>
        </div>
      </TransitionGroup>
      <Transition name="slide-in">
        <ul v-if="openDropdown" :style="getDropdownStyle(squares.indexOf(openDropdown))">
          <li v-for="player in getPlayersInSquare(openDropdown)">⦁ {{ player.name }}</li>
          <li v-if="getPlayersInSquare(openDropdown).length === 0">Aucun joueur présent.</li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
div.map {
  width: 90%;
  aspect-ratio: 1 / 1;
  background-color: white;
  border-radius: var(--radius4);
  margin-bottom: 25px;
  position: relative;
  overflow: visible;
}

div.text-overlay, svg.map-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}
path, circle, div.square-text-rect, ul {
  transition: all ease-in-out 0.3s;
}
path.gray, circle.gray {
  stroke: #555;
  opacity: 0.7;
  stroke-dashoffset: 2px;
  stroke-dasharray: 10px;
}
div.square-text-rect {
  flex-direction: row;
  position: absolute;
  color: #000;
  background-color: var(--gray12);
  border: #000 solid 2px;
  pointer-events: auto;
  cursor: pointer;
  border-radius: var(--radius2);
  overflow: hidden;
  box-sizing: border-box;
  &.selected {
    border-color: var(--darkblue);
  }
  &.outlined {
    border-color: var(--red);
    & span {
      color: var(--red);
      text-decoration: underline var(--red);
    }
  }
  & span {
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: var(--rfont);
    width: 90%;
  }
  & button {
    display: flex;
    flex-direction: column;
    height: 70%;
    margin-right: 2%;
    flex: 1 0 auto;
  }
  & .icon {
    width: 1.2em;
    height: 1.2em;
    flex-shrink: 0;
  }
}
ul {
  position: absolute;
  background-color: var(--gray5);
  border: 1px solid var(--gray3);
  border-radius: var(--radius);
  padding: 4px 0;
  margin: 0;
  list-style: none;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
  & li {
    color: white;
    font-family: var(--rfont);
    padding: 5px 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      background-color: var(--gray4);
      color: #fff;
    }
  }
}
</style>