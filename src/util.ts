import { Ref, ref } from "vue";
import axios from "axios";

export enum EditMode {
  PLAYER = "player",
  MAP = "map",
  ROUTE = "route",
  CALENDAR = "calendar",
  GAME = "game",
  NONE = "null",
}

export class Player {
  name: string;
  position: string;
  id: string;
  color: string;
  constructor(name: string, position: string, id: string, color: string) {
    this.name = name;
    this.position = position;
    this.id = id;
    this.color = color;
  }
}

export class Route {
  firstEnd: string;
  secondEnd: string;
  type: string;
  constructor(first_end: string, second_end: string, type: string) {
    this.firstEnd = first_end;
    this.secondEnd = second_end;
    this.type = type;
  }
}

export class Vector2 {
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

export class DrawnRoute {
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
    const curved = route.firstEnd === route.secondEnd
    return new DrawnRoute(first_end, second_end, color, curved);
  }
  public getCircleCenter(mapCenter: Vector2, circleRadius: number, squareSize: Vector2): Vector2 {
    if (!this.curved) {
      throw Error("route is not curved");
    }
    const dx = this.firstEnd.x - mapCenter.x;
    const dy = this.firstEnd.y - mapCenter.y;
    const circleVector = new Vector2();
    if (dx > 0 && dx > dy) { // right
      circleVector.x = squareSize.x / 2 + circleRadius 
    } else if (dx < 0 && dx < dy) { // left
      circleVector.x = -squareSize.x / 2 - circleRadius
    } else if (dy < 0 && dy < dx) { // up
      circleVector.y = -squareSize.y / 2 - circleRadius
    } else { // down
      circleVector.y = squareSize.y / 2 + circleRadius
    }
    this.circleCenter = this.firstEnd.add(circleVector)
    this.circleRadius = circleRadius
    return this.firstEnd.add(circleVector)
  }
}

export const backendOrigin = "http://localhost:8000";

export const dayTypes: Ref<Array<string>> = ref([]);
export const routeTypes: Ref<Object> = ref({});
export const squares: Ref<Array<string>> = ref([]);

export async function getDayTypes() {
  const response = await axios.get(backendOrigin + "/calendar/day_types");
  dayTypes.value = response.data;
  return response.data;
}

export async function getSquares() {
  const response = await axios.get(backendOrigin + "/squares");
  squares.value = response.data;
  return response.data;
}

export async function getRouteTypes() {
  const response = await axios.get(backendOrigin + "/routes/types");
  console.log(response.data);
  routeTypes.value = response.data;
  return response.data;
}

export async function getData() {
  await getDayTypes();
  await getSquares();
  await getRouteTypes();
}

export const players = ref<Player[]>([]);
export async function getPlayers() {
    try {
      const res = await axios.get(`${backendOrigin}/players`);
      players.value = res.data;
    } catch (err) {
      console.log(err);
    }
  } 

export const routes: Ref<Array<Route>> = ref([])
export async function getRoutes() {
  try {
    const res = await axios.get(`${backendOrigin}/routes`);
    routes.value = res.data.map((r: any) => new Route(r.first_end, r.second_end, r.type));
  } catch (err) {
    console.log(err);
  }
}
getData();