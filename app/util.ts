export enum MenuEditMode {
  PLAYER = "player",
  SQUARE = "square",
  ROUTE = "route",
  CALENDAR = "calendar",
  GAME = "game",
  MAP = "map",
}

export class GamePlayer {
  name: string;
  position: string;
  id: string;
  constructor(name: string, position: string, id: string) {
    this.name = name;
    this.position = position;
    this.id = id;
  }
  public static from(data: Record<string, any>): GamePlayer {
    return new GamePlayer(data.name, data.position, data.id);
  }
}

export interface GameStatus {
    status: string,
    current_player: null | GamePlayer,
    day_count: number,
    current_day_type: null | string,
}

export class GameRoute {
  firstEnd: string;
  secondEnd: string;
  type: string;
  constructor(first_end: string, second_end: string, type: string) {
    this.firstEnd = first_end;
    this.secondEnd = second_end;
    this.type = type;
  }
  public static from(data: Record<string, any>): GameRoute {
    return new GameRoute(data.first_end, data.second_end, data.type);
  }
  public static equals(route1: GameRoute, route2: GameRoute): boolean {
    return ((route1.firstEnd === route2.firstEnd && route1.secondEnd === route2.secondEnd) || (route1.firstEnd === route2.secondEnd && route1.secondEnd === route2.firstEnd)) && route1.type === route2.type;
  }
}

export const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

export const SSEEndpoint = new URL("/events", backendOrigin + "/").href;


type HTTPMethod = "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";

export const commonUploader = async (endpoint: string, method: HTTPMethod | typeof undefined = undefined, body: Record<string, any> = {}, errorMessage: string = "Erreur"): Promise<any | null> => {
  const toast = useToast();
  try {
    return await $fetch(new URL(endpoint, backendOrigin).href, { method, body });
  } catch (err) {
    const detail = err?.data?.detail || err?.response?.data?.detail || errorMessage;
    toast.add({ title: errorMessage, description: String(detail), color: "error", id: String(detail) });
    return null;
  }
};

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
