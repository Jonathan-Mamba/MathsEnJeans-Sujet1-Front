import {ref, Ref, computed} from "vue";
import { Player, Route } from "./util";

export const dayTypes: Ref<Array<string>> = ref([]);
export const routeTypes: Ref<Record<string, string>> = ref({});
export const routeTypeAll: Ref<string> = ref("");
export const squares: Ref<Array<string>> = ref([]);
export const players: Ref<Array<Player>> = ref([]);
export const routes: Ref<Array<Route>> = ref([]);
export const calendar: Ref<Array<string>> = ref([]);

export const gameHistory: Ref<Object[]> = ref([]);
export const gameStatus: Ref<{status: string, current_player: Player, day_count: number, current_day_type: string | null}> = ref({
    status: "null", 
    current_player: new Player("null", "null", "null", "null"), 
    day_count: 0, 
    current_day_type: null
});

export const gameNotStarted: Ref<Boolean> = computed(() => gameStatus.value.status === "not_started");
export const gameRunning: Ref<Boolean> = computed(() => gameStatus.value.status === "in_progress");
export const gameCompleted: Ref<Boolean> = computed(() => gameStatus.value.status === "completed");