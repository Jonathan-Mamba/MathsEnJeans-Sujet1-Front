<script setup lang="ts">
  import { GameRoute, GamePlayer } from "~/util";
  import { useElementSize } from "@vueuse/core";
  import diagramStyle from "~/assets/map_diagram.json";

  const { squares } = useGameSquares();
  const { routes, routeTypes } = useGameRoutes();
  const { players } = useGamePlayers();

  const mapSVG: Ref<SVGSVGElement | null> = ref(null);
  const { width, height } = useElementSize(mapSVG);
  
  const emit = defineEmits(["select"])
  const props = defineProps<{
    selectedSquare1: string,
    selectedSquare2: string,
  }>();

  const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

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
    constructor(first_end: Vector2, second_end: Vector2, color: string, curved: boolean = false) {
      this.firstEnd = first_end;
      this.secondEnd = second_end;
      this.color = color;
      this.curved = curved;
    }
    public static fromRoute(route: GameRoute, squarePositions: Vector2[]): DrawnRoute {
      const firstEnd = squarePositions[squares.value.indexOf(route.firstEnd)];
      const secondEnd = squarePositions[squares.value.indexOf(route.secondEnd)];
      const color = routeTypes.value[route.type];
      const curved = route.firstEnd === route.secondEnd;
      return new DrawnRoute(firstEnd!.copy(), secondEnd!.copy(), color!, curved);
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

  const getPlayersInSquare = (squareName: string) => {
    return players.value.filter((p) => p.position === squareName);
  };
</script>

<template>
  <div class="map">
    <svg ref="mapSVG" class="map-svg">
      <line 
        v-for="route in drawnRoutes.filter(r => !r.curved)"
        :x1="Math.round(route.firstEnd.x)" 
        :y1="Math.round(route.firstEnd.y)" 
        :x2="Math.round(route.secondEnd.x)" 
        :y2="Math.round(route.secondEnd.y)" 
        :stroke="route.color" 
        :stroke-width="diagramStyle.lineWidth"
      />
      <circle 
        v-for="route in drawnRoutes.filter(r => r.curved)"
        :cx="Math.round(route.circleCenter.x)" 
        :cy="Math.round(route.circleCenter.y)" 
        :r="Math.round(route.circleRadius)" 
        :stroke="route.color" 
        :stroke-width="diagramStyle.lineWidth" 
        fill="none"
      />
    </svg>
    <div class="text-overlay">
      <div 
        class="square-text-rect centered"
        v-for="[index, square] in squares.entries()" 
        :key="'text-' + index"
        :class="{selected: props.selectedSquare1 === square || props.selectedSquare2 === square}"
        :style="{
          left: Math.round(squarePositions[index]!.x - squareSize.x / 2) + 'px',
          top: Math.round(squarePositions[index]!.y - squareSize.y / 2) + 'px',
          width: Math.round(squareSize.x) + 'px',
          height: Math.round(squareSize.y) + 'px',
          'font-size': Math.round(squareFontSize) + 'px' 
        }"
      >
        <span @click="emit('select', square)">{{ square }}</span>
        <button :style="{'font-size': Math.round(squareFontSize) + 'px'}">
          <div style="flex: 1;"/>
          <Icon name="lucide:users" class="icon"/>
          {{ getPlayersInSquare(square).length }}
          <div style="flex: 1;"/>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
div.map {
  width: 90%;
  aspect-ratio: 1 / 1;
  background-color: #fff;
  border-radius: var(--radius4);
  margin-bottom: 25px;
  position: relative;
}
div.text-overlay, svg.map-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
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
  & span {
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: var(--rfont);
    width: 90%;
  }
  & button {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25em;
    height: 70%;
    margin-right: 2%;
    overflow: hidden;
    flex-shrink: 0;
    flex-grow: 1;
  }
  & .icon {
    width: 1.2em;
    height: 1.2em;
    flex-shrink: 0;
  }
}
div.square-text-rect.selected {
  border-color: var(--red);
}
</style>