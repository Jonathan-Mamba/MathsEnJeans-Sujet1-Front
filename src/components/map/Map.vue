<script setup lang="ts">
  import {squares, Vector2, DrawnRoute, routes, getRoutes, Route} from "@/util";
  import {Ref, ref, computed} from "vue";
  import { useElementSize } from "@vueuse/core";
  getRoutes();

  const mapSVG: Ref<SVGSVGElement | null> = ref(null);
  const { width, height } = useElementSize(mapSVG);
  const lineWidth: Ref<number> = ref(5)

  const squareSize: Ref<Vector2> = computed(() => {
    return new Vector2(0.25 * width.value,  0.12 * height.value)
  });

  const squarePositions: Ref<Vector2[]> = computed(() => {
    const result: Vector2[] = [];
    const center = new Vector2(width.value / 2, height.value / 2);
    const radiusVector = new Vector2(0, -0.35 * height.value);
    const angle = 2 * Math.PI / squares.value.length;

    for (let i = 0; i < squares.value.length; i++) {
      const position = center.add(radiusVector.rotate(angle * i));
      result.push(position);
    }
    return result;
  });
  const drawnRoutes: Ref<DrawnRoute[]> = computed(() => {
    const result: DrawnRoute[] = [];
    const routeMap: Map<string, Route[]> = new Map();
    const lineOffset = 2 * lineWidth.value;
    let diff_vector: Vector2;

    for (const route of routes.value) {
      const key = [route.first_end, route.second_end].sort().join(":::");
      if (!routeMap.has(key)) {
        routeMap.set(key, []);
      }
      routeMap.get(key)!.push(route);
    }
    for (const routeGroup of Array.from(routeMap.values())) {
      for (let i = 0; i < routeGroup.length; i++) {
        const drawnRoute = DrawnRoute.fromRoute(routeGroup[i], squarePositions.value);
        diff_vector = drawnRoute.first_end.sub(drawnRoute.second_end)
        if (-1 < diff_vector.y / diff_vector.x && diff_vector.y / diff_vector.x < 1) {
          drawnRoute.first_end = drawnRoute.first_end.add(new Vector2(0, lineOffset * i))
          drawnRoute.second_end = drawnRoute.second_end.add(new Vector2(0, lineOffset * i))
        } else {
          drawnRoute.first_end = drawnRoute.first_end.add(new Vector2(lineOffset * i, 0))
          drawnRoute.second_end = drawnRoute.second_end.add(new Vector2(lineOffset * i, 0))
        }
        result.push(drawnRoute)
      }
    }
    return result;
  })
</script>

<template>
  <div class="map centered">
    <svg ref="mapSVG">
      <g v-for="route in drawnRoutes">
        <line :x1="route.first_end.x" :y1="route.first_end.y" :x2="route.second_end.x" :y2="route.second_end.y" :stroke="route.color" :stroke-width="lineWidth"/>
      </g>
      <g v-for="[index, square] in squares.entries()" :key="index">
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
}
</style>       