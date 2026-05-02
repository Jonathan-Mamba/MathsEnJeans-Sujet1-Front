import { 
  routeTypes, 
  squares, 
  players, 
  routes, 
  calendar, 
  gameStatus, 
  gameHistory
} from "~/refs";
import { Route, Player } from "~/util";

export const setupSSE = (source: EventSource, gameId: string | null) => {
  const gameListeners: Record<string, (data: Record<string, any>) => void> = {
    // calendar events
    "game.calendar.added": async (data: Record<string, any>) => {
      calendar.value.push(data.type);
    },
    "game.calendar.removed": async (data: Record<string, any>) => {
			calendar.value = calendar.value.filter((item, index) => index + 1 !== data.number);
    },
    "game.calendar.modified": async (data: Record<string, any>) => {
			calendar.value[data.number - 1] = data.type;
    },

    // route events
    "game.route.added": async (data: Record<string, any>) => {
      console.debug("route added", data.route);
			routes.value.push(Route.from(data.route));
    },
    "game.route.removed": async (data: Record<string, any>) => {
      const routeToRemove = Route.from(data.route);
			routes.value = routes.value.filter(route => !route.equals(routeToRemove));
    },
    "game.route.type.added": async (data: Record<string, any>) => {
			routeTypes.value[data.name] = data.color;
    },
    "game.route.type.removed": async (data: Record<string, any>) => {
			delete routeTypes.value[data.name];
      routes.value = data.routes.map((routeData: Record<string, any>) => Route.from(routeData));
      calendar.value = data.calendar;
    },

    // square events
    "game.square.added": async (data: Record<string, any>) => {
			squares.value.push(data.name);
    },
    "game.square.modified": async (data: Record<string, any>) => {
			squares.value = squares.value.map((square) => square === data.old_name ? data.new_name : square);
      routes.value = routes.value.map((route) => {
        if (route.firstEnd === data.old_name) {
          route.firstEnd = data.new_name;
        }
        if (route.secondEnd === data.old_name) {
          route.secondEnd = data.new_name;
        }
        return route;
      });
      players.value = players.value.map((player) => (player.position === data.old_name ? { ...player, position: data.new_name } : player));
    },
    "game.square.removed": async (data: Record<string, any>) => {
			squares.value = squares.value.filter(square => square !== data.name);
      routes.value = data.routes.map((routeData: Record<string, any>) => Route.from(routeData));
    },

    // players events
    "game.player.added": async (data: Record<string, any>) => {
			players.value.push(Player.from(data.player));
    },
    "game.player.removed": async (data: Record<string, any>) => {
			players.value = players.value.filter(player => player.id !== data.id);
    },
    "game.player.modified": async (data: Record<string, any>) => {
			const playerIndex = players.value.findIndex(player => player.id === data.player.id);
			if (playerIndex !== -1) {
				players.value[playerIndex] = Player.from(data.player);
			}
    },
    "game.player.moved": async (data: Record<string, any>) => {
      const playerIndex = players.value.findIndex(player => player.id === data.player.id);
      if (playerIndex !== -1) {
        players.value[playerIndex]!.position = data.position;
      }
      gameStatus.value = data.status;
      gameHistory.value = data.history;
    },

		// game events
		"game.started": async (data: Record<string, any>) => {
			gameStatus.value = data.status;
      gameHistory.value = data.history;
    },
		"game.ended": async (data: Record<string, any>) => {
			gameStatus.value = data.status;
      gameHistory.value = data.history;
    },
		"game.simulated": async (data: Record<string, any>) => {
			gameStatus.value = data.status;
      gameHistory.value = data.history;			
    },
  };
  
  if (gameId) {
    for (const [eventName, listener] of Object.entries(gameListeners)) {
      source.addEventListener(eventName, async (event: MessageEvent) => {
        console.debug("received event:", eventName + " with data:", event.data);
        await listener(JSON.parse(event.data));
      });
    }
  }
}