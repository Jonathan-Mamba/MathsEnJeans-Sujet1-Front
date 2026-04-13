<script setup lang="ts">
  import { squares, routes, routeTypes, players } from "~/composables/refs";
  import { Route } from "~/utils/helpers";
  import { ref, computed } from "vue";
  import { useElementSize } from "@vueuse/core";


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
    public toString(): string {
      return `(${this.x}, ${this.y})`;
    }
    public rotate(angle: number): Vector2 {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return new Vector2(
        this.x * cos - this.y * sin,
        this.x * sin + this.y * cos
      );
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
    public static fromRoute(route: Route, squarePositions: Vector2[]): DrawnRoute {
      const first_end = squarePositions[squares.value.indexOf(route.firstEnd)];
      const second_end = squarePositions[squares.value.indexOf(route.secondEnd)];
      const color = routeTypes.value[route.type];
      const curved = route.firstEnd === route.secondEnd;
      return new DrawnRoute(first_end!, second_end!, color!, curved);
    }
    public getCircleCenter(mapCenter: Vector2, circleRadius: number, squareSize: Vector2, offset: number = 0, bannerHeight: number = 0): Vector2 {
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
        circleVector.y = -squareSize.y / 2 - circleRadius - offset - bannerHeight;
      } else { // down
        circleVector.y = squareSize.y / 2 + circleRadius + offset;
      }
      this.circleCenter = this.firstEnd.add(circleVector);
      this.circleRadius = circleRadius;
      return this.firstEnd.add(circleVector);
    }
  }
  const mapSVG: Ref<SVGSVGElement | null> = ref(null);
  const mapParent: Ref<HTMLDivElement | null> = ref(null);
  const { width, height } = useElementSize(mapSVG);
  const mapParentSize  = useElementSize(mapParent);
  const lineWidth: Ref<number> = ref(5);
  const mapRadiusMultiplier: Ref<number> = ref(0.3)
  
  const emit = defineEmits(["select"])
  const props = defineProps<{
    selectedSquare1: string,
    selectedSquare2: string,
  }>();

  const squareSize: Ref<Vector2> = computed(() => {
    return new Vector2(0.3 * width.value,  0.12 * height.value);
  });
  const topleft: Ref<Vector2> = computed(() => {
    return new Vector2(( mapParentSize.width.value - width.value) / 2, (mapParentSize.height.value - height.value) / 2);
  });
  const center = computed(() => (new Vector2(width.value / 2, height.value / 2)));

  const squarePositions: Ref<Vector2[]> = computed(() => {
    const result: Vector2[] = [];
    const radiusVector = new Vector2(0, -mapRadiusMultiplier.value * height.value);
    const angle = 2 * Math.PI / squares.value.length;

    for (let i = 0; i < squares.value.length; i++) {
      const position = center.value.add(radiusVector.rotate(angle * i));
      result.push(position);
    }
    return result;
  });
  const drawnRoutes: Ref<DrawnRoute[]> = computed(() => {
    const result: DrawnRoute[] = [];
    const routeMap: Map<string, Route[]> = new Map();
    const lineOffset = 2 * lineWidth.value;
    const circleRadius = 20;
    const circleCenterOffset = -5;
    let diff_vector: Vector2;

    for (const route of routes.value) {
      const key = [route.firstEnd, route.secondEnd].sort().join(":::");
      if (!routeMap.has(key)) {
        routeMap.set(key, []);
      }
      routeMap.get(key)!.push(route);
    }
    for (const routeGroup of Array.from(routeMap.values())) {
      for (let i = 0; i < routeGroup.length; i++) {
        const drawnRoute = DrawnRoute.fromRoute(routeGroup[i]!, squarePositions.value);
        diff_vector = drawnRoute.firstEnd.sub(drawnRoute.secondEnd);
        if (drawnRoute.curved) {
          drawnRoute.getCircleCenter(center.value, circleRadius, squareSize.value, circleCenterOffset, bannerHeight.value);
          drawnRoute.circleRadius = circleRadius + lineOffset * i;
        } else if (-1 < diff_vector.y / diff_vector.x && diff_vector.y / diff_vector.x < 1) {
          drawnRoute.firstEnd = drawnRoute.firstEnd.add(new Vector2(0, lineOffset * i));
          drawnRoute.secondEnd = drawnRoute.secondEnd.add(new Vector2(0, lineOffset * i));
        } else {
          drawnRoute.firstEnd = drawnRoute.firstEnd.add(new Vector2(lineOffset * i, 0));
          drawnRoute.secondEnd = drawnRoute.secondEnd.add(new Vector2(lineOffset * i, 0));
        }
        result.push(drawnRoute);
      }
    }
    return result;
  });

  const bannerHeight: Ref<number> = computed(() => {
    return squareSize.value.y * 0.25;
  });

  const getPlayersInSquare = (squareName: string) => {
    return players.value.filter((p: { position: string; }) => p.position === squareName);
  };
</script>

<template>
  <div class="map centered" ref="mapParent">
    <svg ref="mapSVG">
      <g v-for="route in drawnRoutes">
        <line v-if="!route.curved" :x1="route.firstEnd.x" :y1="route.firstEnd.y" :x2="route.secondEnd.x" :y2="route.secondEnd.y" :stroke="route.color" :stroke-width="lineWidth"/>
        <circle v-else :cx="route.circleCenter.x" :cy="route.circleCenter.y" :r="route.circleRadius" :stroke="route.color" :stroke-width="lineWidth" fill="none"/>
      </g>
    </svg>
    <!-- HTML Text Overlay -->
    <div class="text-overlay">

      <div 
        class="square-text-rect centered rect"
        v-for="[index, square] in squares.entries()" 
        :key="'text-' + index"
        @click="emit('select', square)"
        :class="{selected: props.selectedSquare1 === square || props.selectedSquare2 === square}"
        :style="{
          left: (squarePositions[index]!.x + topleft.x) + 'px',
          top: (squarePositions[index]!.y + topleft.y) + 'px',
          width: squareSize.x + 'px',
          height: squareSize.y + 'px'
        }"
      >
        <span>{{ square }}</span>
      </div>

      <div 
      v-for="[index, square] in squares.entries()" 
      :key="'banner-' + index" class="banner-overlay rect"
      :style="{
        width: squareSize.x + 'px', 
        height: bannerHeight + 'px',
        left: (squarePositions[index]!.x + topleft.x) + 'px', 
        top: (squarePositions[index]!.y + topleft.y - squareSize.y / 2) + 'px'
      }">
        <div/> <!-- empty div to create gap between square and banner -->
        <!-- <span v-for="player in getPlayersInSquare(square)" :key="player.id">{{ player.name }}</span> -->
        <hr v-for="player in getPlayersInSquare(square)" :key="player.id" :style="{'background-color': player.color}">
      </div>

    </div>
  </div>
</template>

<style scoped>
div.map {
  width: 90%;
  aspect-ratio: 1 / 1;
  background-color: #fff;
  border-radius: 30px;
  margin-bottom: 25px;
  position: relative;
}
svg {
  width: 100%;
  height: 100%;
}
div.text-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
div.rect {
  position: absolute;
  color: #000;
  background-color: var(--gray12);
  border: #000 solid 2px;
  pointer-events: auto;
  font-size: var(--rfsize);
  font-family: var(--rfont);
}
div.square-text-rect {
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10000001;
}
div.square-text-rect.selected {
  border-color: var(--red);
}
div.banner-overlay {
  left: 50%;
  transform: translate(-50%, -100%);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-x: scroll;
  gap: 5px;
  align-items: center;
  &::-webkit-scrollbar {
    display: none;
  }
  & hr {
    width: 20%;
    height: 75%;
    border: none;
    margin: 0;
    border-radius: 9999vh;
  }
}
</style>