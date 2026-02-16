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
  constructor(name: string, position: string, id: string) {
    this.name = name;
    this.position = position;
    this.id = id;
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

export const backendOrigin = "http://localhost:8000";

export const dayTypes: Ref<Array<string>> = ref([])
export const routeTypes: Ref<Array<string>> = ref([])
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
  routeTypes.value = response.data;
  return response.data;
}

export async function getData() {
  await getDayTypes();
  await getSquares();
  await getRouteTypes();
}
getData();