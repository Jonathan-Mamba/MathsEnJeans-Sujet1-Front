<script setup lang="ts">
  import {squares, routes, getRoutes, Route, routeTypes} from "@/util";
  import {Ref, ref, computed} from "vue";
  import { useElementSize } from "@vueuse/core";
  getRoutes();

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
      return new DrawnRoute(first_end, second_end, color, curved);
    }
    public getCircleCenter(mapCenter: Vector2, circleRadius: number, squareSize: Vector2, offset: number = 0): Vector2 {
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
  const mapSVG: Ref<SVGSVGElement | null> = ref(null);
  const { width, height } = useElementSize(mapSVG);
  const lineWidth: Ref<number> = ref(5);

  const squareSize: Ref<Vector2> = computed(() => {
    return new Vector2(0.3 * width.value,  0.12 * height.value);
  });
  const center = computed(() => (new Vector2(width.value / 2, height.value / 2)));

  const squarePositions: Ref<Vector2[]> = computed(() => {
    const result: Vector2[] = [];
    const radiusVector = new Vector2(0, -0.3 * height.value);
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
        const drawnRoute = DrawnRoute.fromRoute(routeGroup[i], squarePositions.value);
        diff_vector = drawnRoute.firstEnd.sub(drawnRoute.secondEnd);
        if (drawnRoute.curved) {
          drawnRoute.getCircleCenter(center.value, circleRadius, squareSize.value, circleCenterOffset);
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
</script>

<template>
  <div class="map centered">
    <svg ref="mapSVG">
      <g v-for="route in drawnRoutes">
        <line v-if="!route.curved" :x1="route.firstEnd.x" :y1="route.firstEnd.y" :x2="route.secondEnd.x" :y2="route.secondEnd.y" :stroke="route.color" :stroke-width="lineWidth"/>
        <circle v-else :cx="route.circleCenter.x" :cy="route.circleCenter.y" :r="route.circleRadius" :stroke="route.color" :stroke-width="lineWidth" fill="none"/>
      </g>
      <g v-for="[index, square] in squares.entries()">
        <rect :x="squarePositions[index].x - squareSize.x / 2" :y="squarePositions[index].y - squareSize.y / 2" :width="squareSize.x" :height="squareSize.y"/>
        <text :x="squarePositions[index].x" :y="squarePositions[index].y">{{ square }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
@import "@/components/options/option_menu.scss";
div.map {
  width: 90%;
  aspect-ratio: 1 / 1;
  background-color: #fff;
  border-radius: 30px;
  margin-bottom: 25px;
}
svg {
  width: 95%;
  height: 95%;
}
rect {
  fill: $gray12;
  stroke: #000;
  stroke-width: 2px;
  border: $radius;
}
text {
  font-size: $rfsize;
  font-family: $rfont;
  text-anchor: middle;
  color: #000;
}
</style>       