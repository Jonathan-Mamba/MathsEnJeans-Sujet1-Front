import axios from "axios";
import { AxiosError } from "axios";

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
  public equals(other: Route): boolean {
    return ((this.firstEnd === other.firstEnd && this.secondEnd === other.secondEnd) || (this.firstEnd === other.secondEnd && this.secondEnd === other.firstEnd)) && this.type === other.type;
  }
}

export const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

export const SSEEndpoint = new URL("/events", backendOrigin + "/").href;


export const commonUploader = async (method: string, endpoint: string, errorMessage: string, payload: any, refVar: Ref | null = null, formatter: (data: any) => any = (data) => data) => {
  try {
    if (method === "post") {
      const res = await axios.post(new URL(endpoint, backendOrigin + "/").href, payload);
      if (refVar) refVar.value = formatter(res.data);
    } else if (method === "put") {
      const res = await axios.put(new URL(endpoint, backendOrigin + "/").href, payload);
      if (refVar) refVar.value = formatter(res.data);
    } else if (method === "delete") {
      const res = await axios.delete(new URL(endpoint, backendOrigin + "/").href, { data: payload });
      if (refVar) refVar.value = formatter(res.data);
    } else if (method === "get") {
      const res = await axios.get(new URL(endpoint, backendOrigin + "/").href, { data: payload });
      if (refVar) refVar.value = formatter(res.data);
    }
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      if (import.meta.client) {
        alert(`${errorMessage}: ${err.response.data.detail}`);
      } else {
        console.error(`${errorMessage}: ${err.response.data.detail}`);
      }
    }
  }
}

export const commonGetter = async (endpoint: string, refVar: Ref, errorMessage: string, formatter: (data: any) => any = (data) => data) => {
  await commonUploader("get", endpoint, errorMessage, {}, refVar, formatter);
}

export const commonPoster = async (endpoint: string, payload: any, errorMessage: string) => {
  await commonUploader("post", endpoint, errorMessage, payload);
}

export const commonPutter = async (endpoint: string, payload: any, errorMessage: string) => {
  await commonUploader("put", endpoint, errorMessage, payload);
}

export const commonDeleter = async (endpoint: string, payload: any, errorMessage: string) => {
  await commonUploader("delete", endpoint, errorMessage, payload);
}


