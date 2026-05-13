import { GameRoute, GamePlayer } from "~/util";

export const setupSSE = (source: EventSource, gameId: string | null) => {
  const state = useGameState();

  const gameListeners: Record<string, (data: Record<string, any>) => void> = {
    "game.calendar.added": async (data: Record<string, any>) => {
      state.calendar.value.push(data.type);
    },
    "game.calendar.removed": async (data: Record<string, any>) => {
      state.calendar.value = state.calendar.value.filter((item, index) => index + 1 !== data.number);
    }, 
    "game.calendar.modified": async (data: Record<string, any>) => {
      state.calendar.value[data.number - 1] = data.type;
    },

    "game.route.added": async (data: Record<string, any>) => {
      const addedRoute = GameRoute.from(data.route)
      state.routes.value.push(GameRoute.from(data.route));
      const routesOfSameEnds = state.routes.value.filter((route) => {
        return route.firstEnd == addedRoute.firstEnd && route.secondEnd == addedRoute.secondEnd
      })
      if (routesOfSameEnds.length === state.dayTypes.value.length) {
        state.routes.value = state.routes.value.filter((route) => {
          return route.firstEnd !== addedRoute.firstEnd || route.secondEnd !== addedRoute.secondEnd
        })
        addedRoute.type = state.routeTypeAll.value
        state.routes.value.push(addedRoute)
      }
    },
    "game.route.removed": async (data: Record<string, any>) => {
      const routeToRemove = GameRoute.from(data.route);
      state.routes.value = state.routes.value.filter((route) => !GameRoute.equals(route, routeToRemove));
    },

    "game.square.added": async (data: Record<string, any>) => {
      state.squares.value.push(data.name);
    },
    "game.square.modified": async (data: Record<string, any>) => {
      state.squares.value = state.squares.value.map((square) =>
        square === data.old_name ? data.new_name : square
      );
      state.routes.value.forEach((route) => {
        route.firstEnd = route.firstEnd === data.old_name ? data.new_name : route.firstEnd;
        route.secondEnd = route.secondEnd === data.old_name ? data.new_name : route.secondEnd;
      });
      state.players.value = state.players.value.map((player) =>
        player.position === data.old_name ? { ...player, position: data.new_name } : player
      );
    },
    "game.square.removed": async (data: Record<string, any>) => {
      state.squares.value = state.squares.value.filter((square) => square !== data.name);
      state.routes.value = data.routes.map((routeData: Record<string, any>) => GameRoute.from(routeData));
    },

    "game.player.added": async (data: Record<string, any>) => {
      state.players.value.push(GamePlayer.from(data.player));
    },
    "game.player.removed": async (data: Record<string, any>) => {
      state.players.value = state.players.value.filter((player) => player.id !== data.id);
    },
    "game.player.modified": async (data: Record<string, any>) => {
      const playerIndex = state.players.value.findIndex((player) => player.id === data.player.id);
      if (playerIndex !== -1) {
        state.players.value[playerIndex] = GamePlayer.from(data.player);
      }
    },
    "game.player.moved": async (data: Record<string, any>) => {
      const playerIndex = state.players.value.findIndex((player) => player.id === data.id);
      if (playerIndex !== -1) {
        state.players.value[playerIndex]!.position = data.position;
      }
      state.gameStatus.value = data.status;
      state.gameHistory.value = data.history;
    },

    "game.started": async (data: Record<string, any>) => {
      state.gameStatus.value = data.status;
      state.gameHistory.value = data.history;
    },
    "game.ended": async (data: Record<string, any>) => {
      state.gameStatus.value = data.status;
      state.gameHistory.value = data.history;
    },
    "game.simulated": async (data: Record<string, any>) => {
      state.gameStatus.value = data.status;
      state.gameHistory.value = data.history;
    },
    "game.data.import": async (data: Record<string, any>) => {
      await state.loadInitialData()
    }
  };

  if (gameId) {
    for (const [eventName, listener] of Object.entries(gameListeners)) {
      source.addEventListener(eventName, async (event: MessageEvent) => {
        await listener(JSON.parse(event.data));
      });
    }
  }
};
