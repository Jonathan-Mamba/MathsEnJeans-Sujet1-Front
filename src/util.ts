import { Ref, ref, computed } from "vue";
import axios from "axios";
import { AxiosError } from "axios";

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

export const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN;

export const dayTypes: Ref<Array<string>> = ref([]);
export const routeTypes: Ref<Object> = ref({});
export const squares: Ref<Array<string>> = ref([]);

export async function getDayTypes() {
  try {
    const response = await axios.get(backendOrigin + "/calendar/day_types");
    dayTypes.value = response.data;
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      alert(`Erreur lors de la récupération des types de jours: ${err.response.data.detail}`);
    }
  }
}

export async function getSquares() {
  try {
    const response = await axios.get(backendOrigin + "/squares");
    squares.value = response.data;
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      alert(`Erreur lors de la récupération des cases: ${err.response.data.detail}`);
    }
  }
}

export async function getRouteTypes() {
  try {
    const response = await axios.get(backendOrigin + "/routes/types");
    routeTypes.value = response.data;
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      alert(`Erreur lors de la récupération des types de routes: ${err.response.data.detail}`);
    }
  }
}

export async function getData() {
  await getDayTypes();
  await getSquares();
  await getRouteTypes();
  await getPlayers();
  await getRoutes();
  await getGameStatus();
}

export const players = ref<Player[]>([]);
export async function getPlayers() {
  try {
    const res = await axios.get(`${backendOrigin}/players`);
    players.value = res.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      alert(`Erreur lors de la récupération des joueurs: ${err.response.data.detail}`);
    }
  }
} 

export const routes: Ref<Array<Route>> = ref([])
export async function getRoutes() {
  try {
    const res = await axios.get(`${backendOrigin}/routes`);
    routes.value = res.data.map((r: any) => new Route(r.first_end, r.second_end, r.type));
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      alert(`Erreur lors de la récupération des routes: ${err.response.data.detail}`);
    }
  }
}
export async function addRoute(firstEnd: string, secondEnd: string, routeType: string) {
  try {
    await axios.post(`${backendOrigin}/routes?first_end=${firstEnd}&second_end=${secondEnd}&route_type=${routeType}`);
    getRoutes();
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      alert(`Erreur lors de l'ajout de la route: ${err.response.data.detail}`);
    }
  }
}
export const gameStatus: Ref<{status: string, current_player: Player, day_count: number, current_day_type: string | null}> = ref({status: "null", current_player: new Player("null", "null", "null", "null"), day_count: 0, current_day_type: null});
export async function getGameStatus() {
  try {
    const res = await axios.get(`${backendOrigin}/game/status`);
    gameStatus.value = res.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      alert(`Erreur lors de la récupération du statut du jeu: ${err.response.data.detail}`);
    }
  }
}
export const gameRunning: Ref<Boolean> = computed(() => gameStatus.value.status === "in_progress");
export const gameCompleted: Ref<Boolean> = computed(() => gameStatus.value.status === "completed");