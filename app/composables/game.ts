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


export const useGameCalendar = () => {
  const getCalendar = async () => {
    await commonGetter("/calendar", calendar, "Erreur lors de la récupération du calendrier");
  }
  const addDay = async (addedDayType: string) => {
    await commonPoster("/calendar", { day_type: addedDayType }, "Erreur lors de l'ajout du jour");
  }
  const removeDay = async (dayNumber: number) => {
    await commonDeleter(`/calendar/${dayNumber}`, {}, "Erreur lors de la suppression du jour");
  }
  const modifyDay = async (modifiedDay: number, modifiedDayType: string) => {
    await commonPutter("/calendar", { day_number: modifiedDay, day_type: modifiedDayType }, "Erreur lors de la modification du jour");
  }

  return { calendar, getCalendar, addDay, removeDay, modifyDay };
}


export const useGameHistory = () => {
  const getGameHistory = async () => {
    await commonGetter("/game/history", gameHistory, "Erreur lors de la récupération de l'historique du jeu");
  }

  return { gameHistory, getGameHistory };
}


export const useGameSquares = () => {
  const getSquares = async () => {
    await commonGetter("/squares", squares, "Erreur lors de la récupération des cases");
  }
  const addSquare = async (name: string) => {
    await commonPoster("/squares", { name }, "Erreur lors de l'ajout de la case");
  }
  const modifySquare = async (oldName: string, newName: string) => {
    await commonPutter("/squares", { old_name: oldName, new_name: newName }, "Erreur lors de la modification de la case");
  }
  const deleteSquare = async (name: string) => {
    await commonDeleter(`/squares/`, { name }, "Erreur lors de la suppression de la case");
  }
  return { squares, getSquares, addSquare, modifySquare, deleteSquare };
}


export const useGameDayTypes = () => {
  return { dayTypes };
}


export const useGameRouteTypes = () => {
  const getRouteTypes = async () => {
    await commonGetter("/routes/types", routeTypes, "Erreur lors de la récupération des types de routes");
  }
  const addRouteType = async (name: string) => {
    await commonPoster("/routes/types", { name }, "Erreur lors de l'ajout du type de route");
  }
  const modifyRouteType = async (oldName: string, newName: string) => {
    await commonPutter("/routes/types", { old_name: oldName, new_name: newName }, "Erreur lors de la modification du type de route");
  }
  const deleteRouteType = async (name: string) => {
    await commonDeleter(`/routes/types/`, { name }, "Erreur lors de la suppression du type de route");
  }
  const getRouteTypeAll = async () => {
    await commonGetter("/routes/types/all", routeTypeAll, "Erreur lors de la récupération de tous les types de routes");
  }

  return { routeTypes, routeTypeAll, getRouteTypes, addRouteType, modifyRouteType, deleteRouteType, getRouteTypeAll };
}


export const useGamePlayers = () => {
  const getPlayers = async () => {
    await commonGetter("/players", players, "Erreur lors de la récupération des joueurs", (data) => data.map((p: any) => Player.from(p)));
  }
  const addPlayer = async (name: string, position: string) => {
    await commonPoster("/players", { name, position }, "Erreur lors de l'ajout du joueur");
  }
  const modifyPlayer = async (id: string, name: string, position: string) => {
    await commonPutter("/players", { id, name, position}, "Erreur lors de la modification du joueur");
  }
  const deletePlayer = async (id: string) => {
    await commonDeleter(`/players/`, { id }, "Erreur lors de la suppression du joueur");
  }

  return { players, getPlayers, addPlayer, modifyPlayer, deletePlayer };
}


export const useGameRoutes = () => {
  const getRoutes = async () => {
    await commonGetter(
      "/routes", 
      routes, 
      "Erreur lors de la récupération des routes", 
      (data) => data.map((r: any) => Route.from(r))
    );
  }
  const addRoute = async (firstEnd: string, secondEnd: string, routeType: string) => {
    await commonPoster(
      "/routes", 
      { first_end: firstEnd, second_end: secondEnd, route_type: routeType }, 
      "Erreur lors de l'ajout de la route"
    );
  }
  const deleteRoute = async (route: Route) => {
    await commonDeleter(
      "/routes", 
      { first_end: route.firstEnd, second_end: route.secondEnd, route_type: route.type }, 
      "Erreur lors de la suppression de la route"
    );
  }
  return { routes, getRoutes, addRoute, deleteRoute };
}


export const useGameControl = () => {
  const startGame = async () => {
    await commonPoster("/game/start", {}, "Erreur lors du démarrage de la partie");
  }
  const simulateGame = async () => {
    await commonPoster("/game/simulate", {}, "Erreur lors de la simulation de la partie");
  }
  const stopGame = async () => {
    await commonPoster("/game/end", {}, "Erreur lors de l'arrêt de la partie");    
  }
  const movePlayer = async (new_position: string, player_id: string) => {
    await commonPoster("/game/move_player", { new_position, player_id }, "Erreur lors du déplacement du joueur");
  }
  return { startGame, simulateGame, stopGame, movePlayer };
}

export const loadInitialData = async () => {
  const gameData = ref<Record<string, any>>({});
  await commonGetter("/export", gameData, "Erreur lors de la récupération des données du jeu");
  players.value = gameData.value.players.map((p: any) => Player.from(p));
  calendar.value = gameData.value.calendar;
  routes.value = gameData.value.routes.map((r: any) => Route.from(r));
  routeTypes.value = gameData.value.route_colors;
  routeTypeAll.value = gameData.value.route_type_all;
  gameStatus.value = gameData.value.game_status;
  gameHistory.value = gameData.value.game_history;
  squares.value = gameData.value.squares;
  return gameData.value;
}