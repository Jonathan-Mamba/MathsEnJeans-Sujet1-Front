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
  first_end: string;
  second_end: string;
  type: string;
  constructor(first_end: string, second_end: string, type: string) {
    this.first_end = first_end;
    this.second_end = second_end;
    this.type = type;
  }
}

export class Vector2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
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
  public copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }
  public isEqual(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }
}

export class DrawnRoute {
  first_end: Vector2;
  second_end: Vector2;
  color: string;
  constructor(first_end: Vector2, second_end: Vector2, color: string) {
    this.first_end = first_end;
    this.second_end = second_end;
    this.color = color;
  }
  public static fromRoute(route: Route, squarePositions: Vector2[]): DrawnRoute {
    const first_end = squarePositions[squares.value.indexOf(route.first_end)];
    const second_end = squarePositions[squares.value.indexOf(route.second_end)];
    const color = routeTypes.value[route.type];
    return new DrawnRoute(first_end, second_end, color);
  }
}

export const backendOrigin = "http://localhost:8000";

export const dayTypes: Ref<Array<string>> = ref([])
export const routeTypes: Ref<Object> = ref({})
export const squares: Ref<Array<string>> = ref([])

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