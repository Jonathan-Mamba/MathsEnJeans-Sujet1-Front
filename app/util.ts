export enum EditMode {
  PLAYER = "player",
  SQUARE = "square",
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
  public static from(data: Record<string, any>): Player {
    return new Player(data.name, data.position, data.id, data.color);
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
  public static from(data: Record<string, any>): Route {
    return new Route(data.first_end, data.second_end, data.type);
  }
  public static equals(route1: Route, route2: Route): boolean {
    return ((route1.firstEnd === route2.firstEnd && route1.secondEnd === route2.secondEnd) || (route1.firstEnd === route2.secondEnd && route1.secondEnd === route2.firstEnd)) && route1.type === route2.type;
  }
}

export const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

export const SSEEndpoint = new URL("/events", backendOrigin + "/").href;
