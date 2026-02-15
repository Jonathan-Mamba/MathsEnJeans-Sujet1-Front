import { Ref, ref } from "vue";
export enum EditMode {
    PLAYER = "player",
    MAP = "map",
    ROUTE = "route",
    CALENDAR = "calendar",
    GAME = "game",
    NONE = "null",
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
export const dayTypes: Ref<Array<string>> = ref(["livraison", "marchands", "labeur", "doleances"])
export const routeTypes = dayTypes
export const squares: Ref<Array<string>> = ref(["entrepots_royaux", "quartier_artisants", "quartier_marchands", "salle_gardes", "palais"])