import { Route, commonGetter, commonPoster, commonPutter, commonDeleter, Player } from '@/util';
import { 
  dayTypes, 
  routeTypes,
  routeTypeAll, 
  squares, 
  players, 
  routes, 
  gameStatus,
  gameNotStarted, 
  gameRunning, 
  gameCompleted,
  gameHistory,
  calendar
} from '@/refs';


export const useGameStatus = () => {
  const getGameStatus = async () => {
    await commonGetter("/game/status", gameStatus, "Erreur lors de la récupération du statut du jeu");
  }

  return { gameStatus, gameNotStarted, gameRunning, gameCompleted, getGameStatus};
}


export const useCalendar = () => {
  async function getCalendar() {
    await commonGetter("/calendar", calendar, "Erreur lors de la récupération du calendrier");
  }
  const addDay = async (addedDayType: string) => {
    await commonPoster("/calendar", { day_type: addedDayType }, "Erreur lors de l'ajout du jour", getCalendar);
  }
  const removeDay = async (day_number: number) => {
    await commonDeleter(`/calendar/${day_number}`, {}, "Erreur lors de la suppression du jour", getCalendar);
  }
  const modifyDay = async (modifiedDay: number, modifiedDayType: string) => {
    await commonPutter("/calendar", { day_number: modifiedDay, new_day: modifiedDayType }, "Erreur lors de la modification du jour", getCalendar);
  }

  return { calendar, getCalendar, addDay, removeDay, modifyDay };
}


export const useGameHistory = () => {
  const getGameHistory = async () => {
    await commonGetter("/game/history", gameHistory, "Erreur lors de la récupération de l'historique du jeu");
  }

  return { gameHistory, getGameHistory };
}


export const useSquares = () => {
  const getSquares = async () => {
    await commonGetter("/squares", squares, "Erreur lors de la récupération des cases");
  }
  const addSquare = async (square: string) => {
    await commonPoster("/squares", { square_name: square }, "Erreur lors de l'ajout de la case", () => (squares.value.push(square)));
  }
  const deleteSquare = async (square: string) => {
    await commonDeleter(`/squares/${square}`, {}, "Erreur lors de la suppression de la case", async () => {
      squares.value = squares.value.filter(s => s !== square);
    });
  }
  return { squares, getSquares, addSquare, deleteSquare };
}


export const useDayTypes = () => {
  const getDayTypes = async () => {
    await commonGetter("/calendar/day_types", dayTypes, "Erreur lors de la récupération des types de jours");
  }

  return { dayTypes, getDayTypes };
}


export const useRouteTypes = () => {
  const getRouteTypes = async () => {
    await commonGetter("/routes/types", routeTypes, "Erreur lors de la récupération des types de routes");
  }
  const addRouteType = async (routeType: string) => {
    await commonPoster("/routes/types", { route_type: routeType }, "Erreur lors de l'ajout du type de route", getRouteTypes);
  }
  const deleteRouteType = async (routeType: string) => {
    await commonDeleter(`/routes/types/${routeType}`, {}, "Erreur lors de la suppression du type de route", async () => {
      routeTypes.value = Object.fromEntries(Object.entries(routeTypes.value).filter(([key]) => key !== routeType));
    });
  }
  const getRouteTypeAll = async () => {
    await commonGetter("/routes/types/all", routeTypeAll, "Erreur lors de la récupération de tous les types de routes");
  }

  return { routeTypes, routeTypeAll, getRouteTypes, addRouteType, deleteRouteType, getRouteTypeAll };
}


export const usePlayers = () => {
  const getPlayers = async () => {
    await commonGetter("/players", players, "Erreur lors de la récupération des joueurs", (data) => data.map((p: any) => new Player(p.name, p.position, p.id, p.color)));
  }
  const addPlayer = async (new_name: string, new_position: string) => {
    await commonPoster("/players", { name: new_name, position: new_position }, "Erreur lors de l'ajout du joueur", getPlayers);
  }
  const modifyPlayer = async (player_id: string, new_name: string, new_position: string) => {
    await commonPutter("/players", { player_id, new_name, new_position }, "Erreur lors de la modification du joueur", getPlayers);
  }
  const deletePlayer = async (player_id: string) => {
    await commonDeleter(`/players/${player_id}`, {}, "Erreur lors de la suppression du joueur", getPlayers);
  }

  return { players, getPlayers, addPlayer, modifyPlayer, deletePlayer };
}


export const useRoutes = () => {
  const getRoutes = async () => {
    console.log("Fetching routes...");
    await commonGetter("/routes", routes, "Erreur lors de la récupération des routes" , (data) => data.map((r: any) => new Route(r.first_end, r.second_end, r.type)));
    console.log("Routes fetched:", routes.value);
  }
  const addRoute = async (firstEnd: string, secondEnd: string, routeType: string) => {
    await commonPoster(
      "/routes", 
      { first_end: firstEnd, second_end: secondEnd, route_type: routeType }, 
      "Erreur lors de l'ajout de la route", 
      getRoutes
    );
  }
  const deleteRoute = async (route: Route) => {
    await commonDeleter(
      "/routes", 
      { first_end: route.firstEnd, second_end: route.secondEnd, route_type: route.type }, 
      "Erreur lors de la suppression de la route", 
      async () => {
        routes.value = routes.value.filter(r => !(r.firstEnd === route.firstEnd && r.secondEnd === route.secondEnd && r.type === route.type));
      }
    );
  }
  return { routes, getRoutes, addRoute, deleteRoute };
}


export const useGameControl = () => {
  const { getGameStatus } = useGameStatus();
  const { getPlayers } = usePlayers();
  const startGame = async () => {
    await commonPoster("/game/start", {}, "Erreur lors du démarrage de la partie", getGameStatus);
  }
  const simulateGame = async () => {
    await commonPoster("/game/simulate", {}, "Erreur lors de la simulation de la partie", async () => {
      await getGameStatus();
      await getPlayers();
    });
  }
  const stopGame = async () => {
    await commonPoster("/game/end", {}, "Erreur lors de l'arrêt de la partie", getGameStatus);    
  }
  const movePlayer = async (new_position: string, player_id: string) => {
    await commonPoster("/game/move_player", { new_position, player_id }, "Erreur lors du déplacement du joueur", async () => {
      await getGameStatus();
      await getPlayers();
    });
  }
  return { startGame, simulateGame, stopGame, movePlayer };
}

export const loadInitialData = async () => {
  await Promise.all([
    useSquares().getSquares(),
    useDayTypes().getDayTypes(),
    useRouteTypes().getRouteTypes(),
    useRouteTypes().getRouteTypeAll(),
    usePlayers().getPlayers(),
    useRoutes().getRoutes(),
    useCalendar().getCalendar(),
    useGameStatus().getGameStatus(),
    useGameHistory().getGameHistory()
  ]);
}