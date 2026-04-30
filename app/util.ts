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
    return (this.firstEnd === other.firstEnd && this.secondEnd === other.secondEnd) || (this.firstEnd === other.secondEnd && this.secondEnd === other.firstEnd) && this.type === other.type;
  }
}

export const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

export const SSEEndpoint = new URL("/events", backendOrigin + "/").href;


export const commonGetter = async (endpoint: string, refVar: any, errorMessage: string, formatResponse: (data: any) => any = (data) => data) => {
  try {
    const res = await axios.get(new URL(endpoint, backendOrigin + "/").href);
    refVar.value = formatResponse(res.data);
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

const commonUploader = async (method: string, endpoint: string, payload: any, errorMessage: string, callback: () => void) => {
  try {
    if (method === "post") {
      await axios.post(new URL(endpoint, backendOrigin + "/").href, payload);
    } else if (method === "put") {
      await axios.put(new URL(endpoint, backendOrigin + "/").href, payload);
    } else if (method === "delete") {
      await axios.delete(new URL(endpoint, backendOrigin + "/").href, { data: payload });
    }
    await callback();
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

export const commonPoster = async (endpoint: string, payload: any, errorMessage: string, callback: () => void) => {
  await commonUploader("post", endpoint, payload, errorMessage, callback);
}

export const commonPutter = async (endpoint: string, payload: any, errorMessage: string, callback: () => void) => {
  await commonUploader("put", endpoint, payload, errorMessage, callback);
}

export const commonDeleter = async (endpoint: string, payload: any, errorMessage: string, callback: () => void) => {
  await commonUploader("delete", endpoint, payload, errorMessage, callback); 
}


