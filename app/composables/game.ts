import { GamePlayer, GameRoute, backendOrigin, commonUploader, type GameStatus } from "~/util";


type ExportData = {
  players: any[];
  squares: string[];
  routes: any[];
  route_colors: Record<string, string>;
  route_type_all: string;
  calendar: string[];
  game_status: any;
  game_history: any[];
};

type GameHistoryEntry = {
  day_type: string
  moves: [string, string, string][] // player id, from square, to square
}


export const useGameState = () => {
  const players = useState<GamePlayer[]>("gs-players", () => []);
  const squares = useState<string[]>("gs-squares", () => []);
  const routes = useState<GameRoute[]>("gs-routes", () => []);
  const routeTypeAll = useState<string>("gs-route-type-all", () => "Tout");
  const calendar = useState<{type: string, id: number}[]>("gs-calendar", () => []);
  const routeTypes = useState<Record<string, string>>("gs-route-types", () => ({
    "Livraison": "#FF1F5B",
    "Doléances": "#0071FF", 
    "Marchands": "#FFC61E", 
    "Labeur": "#00D34E", 
    "Tout": "#AF58BA"
  }));
  const gameStatus = useState<GameStatus>("gs-game-status", () => ({
    status: "not_started",
    current_player: null,
    day_count: 0,
    current_day_type: null,
  }));
  const gameHistory = useState<GameHistoryEntry[]>("gs-game-history", () => []);

  const dayTypes = computed(() =>
    Object.keys(routeTypes.value).filter((key) => key !== routeTypeAll.value)
  );
  const gameNotStarted = computed(() => gameStatus.value.status === "not_started");
  const gameRunning = computed(() => gameStatus.value.status === "in_progress");
  const gameCompleted = computed(() => gameStatus.value.status === "completed");

  const { data, pending, error, refresh: refreshData } = useFetch<ExportData>(new URL("/export", backendOrigin).href, {
    immediate: false,
  });

  const loadInitialData = async () => {
    await refreshData();
    if (data.value) {
      players.value = data.value.players.map((p) => GamePlayer.from(p));
      squares.value = data.value.squares;
      routes.value = data.value.routes.map((r) => GameRoute.from(r));
      routeTypeAll.value = data.value.route_type_all;
      calendar.value = data.value.calendar.map((day) => ({type: day, id: Math.random()}));
      gameStatus.value = data.value.game_status;
      gameHistory.value = data.value.game_history;
    }
  };

  return {
    players,
    squares,
    routes,
    routeTypes,
    routeTypeAll,
    calendar,
    gameStatus,
    gameHistory,
    dayTypes,
    gameNotStarted,
    gameRunning,
    gameCompleted,
    pending,
    error,
    loadInitialData
  };
};

export const useGameStatus = () => {
  const state = useGameState();

  return {
    gameStatus: state.gameStatus,
    gameNotStarted: state.gameNotStarted,
    gameRunning: state.gameRunning,
    gameCompleted: state.gameCompleted,
  };
};

export const useGameCalendar = () => {
  const state = useGameState();

  const addDay = async (addedDayType: string) => {
    await commonUploader("/calendar", "POST", { day_type: addedDayType }, "Erreur lors de l'ajout du jour");
  };

  const removeDay = async (dayNumber: number) => {
    await commonUploader("/calendar", "DELETE", { day_number: dayNumber }, "Erreur lors de la suppression du jour");
  };

  const modifyDay = async (modifiedDay: number, modifiedDayType: string) => {
    await commonUploader("/calendar", "PUT", { day_number: modifiedDay, day_type: modifiedDayType }, "Erreur lors de la modification du jour");
  };

  return { calendar: state.calendar, addDay, removeDay, modifyDay};
};

export const useGameHistory = () => {
  const state = useGameState();
  return { gameHistory: state.gameHistory };
};

export const useGameSquares = () => {
  const state = useGameState();

  const addSquare = async (name: string) => {
    await commonUploader("/squares", "POST", { name }, "Erreur lors de l'ajout de la case");
  };

  const modifySquare = async (oldName: string, newName: string) => {
    await commonUploader("/squares", "PUT", { old_name: oldName, new_name: newName }, "Erreur lors de la modification de la case");
  };

  const deleteSquare = async (name: string) => {
    await commonUploader("/squares", "DELETE", { name }, "Erreur lors de la suppression de la case");
  };

  return { squares: state.squares, addSquare, modifySquare, deleteSquare };
};

export const useGameDayTypes = () => {
  const state = useGameState();
  return { dayTypes: state.dayTypes };
};


export const useGamePlayers = () => {
  const state = useGameState();

  const addPlayer = async (name: string, position: string) => {
    await commonUploader("/players", "POST", { name, position }, "Erreur lors de l'ajout du joueur");
  };

  const modifyPlayer = async (id: string, name: string, position: string) => {
    await commonUploader("/players", "PUT", { id, name, position }, "Erreur lors de la modification du joueur");
  };

  const deletePlayer = async (id: string) => {
    await commonUploader("/players", "DELETE", { id }, "Erreur lors de la suppression du joueur");
  };

  return { players: state.players, addPlayer, modifyPlayer, deletePlayer };
};

export const useGameRoutes = () => {
  const state = useGameState();

  const addRoute = async (firstEnd: string, secondEnd: string, routeType: string) => {
    await commonUploader(
      "/routes", 
      "POST", 
      { first_end: firstEnd, second_end: secondEnd, route_type: routeType }, 
      "Erreur lors de l'ajout de la route"
    );
  };

  const deleteRoute = async (route: GameRoute) => {
    await commonUploader(
      "/routes", 
      "DELETE", 
      { first_end: route.firstEnd, second_end: route.secondEnd, route_type: route.type }, 
      "Erreur lors de la suppression de la route"
    );
  };

  return { routes: state.routes, addRoute, deleteRoute, routeTypes: state.routeTypes, routeTypeAll: state.routeTypeAll };
};

export const useGameControl = () => {
  
  const startGame = async () => {
    await commonUploader("/game/start", "POST", {}, "Erreur lors du démarrage de la partie");
  };

  const stopGame = async () => {
    await commonUploader("/game/end", "POST", {}, "Erreur lors de l'arrêt de la partie");
  };

  const simulateGame = async () => {
    await commonUploader("/game/simulate", "POST", {}, "Erreur lors de la simulation de la partie");
  };

  const movePlayer = async (new_position: string, player_id: string) => {
    await commonUploader("/game/move_player", "POST", { new_position, player_id }, "Erreur lors du déplacement du joueur");
  };
  return { startGame, simulateGame, stopGame, movePlayer };
};
