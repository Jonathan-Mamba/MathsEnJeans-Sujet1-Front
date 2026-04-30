import { Route, commonGetter, commonPoster, commonPutter, commonDeleter, Player } from '~/util';
import { 
  dayTypes, 
  routeTypes, 
  routeTypeAll, 
  squares, 
  players, 
  routes, 
  calendar, 
  gameHistory, 
  gameStatus, 
  gameNotStarted, 
  gameRunning, 
  gameCompleted
} from '~/refs';


export const useGameStatus = () => {
  const getGameStatus = async () => {
    await commonGetter("/game/status", gameStatus, "Erreur lors de la récupération du statut du jeu");
  }

  return { gameStatus, gameNotStarted, gameRunning, gameCompleted, getGameStatus };
}


export const useCalendar = () => {
  const getCalendar = async () => {
    await commonGetter("/calendar", calendar, "Erreur lors de la récupération du calendrier");
  }
  const addDay = async (addedDayType: string) => {
    await commonPoster("/calendar", { day_type: addedDayType }, "Erreur lors de l'ajout du jour", getCalendar);
  }
  const removeDay = async (dayNumber: number) => {
    await commonDeleter(`/calendar/${dayNumber}`, {}, "Erreur lors de la suppression du jour", getCalendar);
  }
  const modifyDay = async (modifiedDay: number, modifiedDayType: string) => {
    await commonPutter("/calendar", { day_number: modifiedDay, day_type: modifiedDayType }, "Erreur lors de la modification du jour", getCalendar);
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
  const addSquare = async (name: string) => {
    await commonPoster("/squares", { name }, "Erreur lors de l'ajout de la case", () => (squares.value.push(name)));
  }
  const deleteSquare = async (name: string) => {
    await commonDeleter(`/squares/`, { name }, "Erreur lors de la suppression de la case", async () => {
      squares.value = squares.value.filter(s => s !== name);
    });
  }
  return { squares, getSquares, addSquare, deleteSquare };
}


export const useDayTypes = () => {
  return { dayTypes };
}


export const useRouteTypes = () => {
  const getRouteTypes = async () => {
    await commonGetter("/routes/types", routeTypes, "Erreur lors de la récupération des types de routes");
  }
  const addRouteType = async (name: string) => {
    await commonPoster("/routes/types", { name }, "Erreur lors de l'ajout du type de route", getRouteTypes);
  }
  const deleteRouteType = async (name: string) => {
    await commonDeleter(`/routes/types/`, { name }, "Erreur lors de la suppression du type de route", async () => {
      routeTypes.value = Object.fromEntries(Object.entries(routeTypes.value).filter(([key]) => key !== name));
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
  const addPlayer = async (name: string, position: string) => {
    await commonPoster("/players", { name, position }, "Erreur lors de l'ajout du joueur", getPlayers);
  }
  const modifyPlayer = async (id: string, name: string, position: string) => {
    await commonPutter("/players", { id, name, position}, "Erreur lors de la modification du joueur", getPlayers);
  }
  const deletePlayer = async (id: string) => {
    await commonDeleter(`/players/`, { id }, "Erreur lors de la suppression du joueur", getPlayers);
  }

  return { players, getPlayers, addPlayer, modifyPlayer, deletePlayer };
}


export const useRoutes = () => {
  const getRoutes = async () => {
    await commonGetter(
      "/routes", 
      routes, 
      "Erreur lors de la récupération des routes", 
      (data) => data.map((r: any) => new Route(r.first_end, r.second_end, r.type)));
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
      getRoutes
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
    useRouteTypes().getRouteTypes(),
    useRouteTypes().getRouteTypeAll(),
    usePlayers().getPlayers(),
    useRoutes().getRoutes(),
    useCalendar().getCalendar(),
    useGameStatus().getGameStatus(),
    useGameHistory().getGameHistory()
  ]);
}