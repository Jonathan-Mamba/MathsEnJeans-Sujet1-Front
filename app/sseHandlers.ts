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
			routes.value.push(Route.from(data));
    },
    "game.route.removed": async (data: Record<string, any>) => {
      const routeToRemove = Route.from(data);
			routes.value = routes.value.filter(route => !route.equals(routeToRemove));
    },
    "game.route.type.added": async (data: Record<string, any>) => {
			routeTypes.value[data.name] = data.color;
    },
    "game.route.type.removed": async (data: Record<string, any>) => {
			delete routeTypes.value[data.name];
    },

    // square events
    "game.square.added": async (data: Record<string, any>) => {
			squares.value.push(data.name);
    },
    "game.square.removed": async (data: Record<string, any>) => {
			squares.value = squares.value.filter(square => square !== data.name);
    },

    // players events
    "game.player.added": async (data: Record<string, any>) => {
			players.value.push(Player.from(data.player));
    },
    "game.player.deleted": async (data: Record<string, any>) => {
			players.value = players.value.filter(player => player.id !== data.id);
    },
    "game.player.modified": async (data: Record<string, any>) => {
			const playerIndex = players.value.findIndex(player => player.id === data.id);
			if (playerIndex !== -1) {
				players.value[playerIndex] = Player.from(data);
			}
    },
    "game.player.moved": async (data: Record<string, any>) => {
      const playerIndex = players.value.findIndex(player => player.id === data.id);
      if (playerIndex !== -1) {
        players.value[playerIndex]!.position = data.position;
      }
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
      source.addEventListener(eventName, async (event) => {
        alert(`Received event: ${eventName}`);
        console.log(`Received event: ${eventName}`, JSON.parse(event.data));
        await listener(JSON.parse(event.data));
      });
    }
  }
}