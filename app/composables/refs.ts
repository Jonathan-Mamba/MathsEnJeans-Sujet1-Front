import { Player, Route } from "~/utils/helpers";

export const dayTypes = ref<string[]>([]);
export const routeTypes = ref<Record<string, string>>({});
export const routeTypeAll = ref<string>("");
export const squares = ref<Array<string>>([]);
export const players = ref<Array<Player>>([]);
export const routes = ref<Array<Route>>([]);
export const calendar = ref<Array<string>>([]);

export const gameHistory = ref<Object[]>([]);
export const gameStatus = ref<{
    status: string;
    current_player: Player;
    day_count: number;
    current_day_type: string | null;
}>({
    status: "null",
    current_player: new Player("null", "null", "null", "null"),
    day_count: 0,
    current_day_type: null
});

export const gameNotStarted = computed(() => gameStatus.value.status === "not_started");
export const gameRunning = computed(() => gameStatus.value.status === "in_progress");
export const gameCompleted = computed(() => gameStatus.value.status === "completed");