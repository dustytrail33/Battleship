import { WebSocket, WebSocketServer } from 'ws';
import { games } from '../storage';
import { send } from '../utils/messaging';
import { Ship } from '../types';

export function handleAddShips(ws: WebSocket, wss: WebSocketServer, data: string) {
  const { gameId, ships, indexPlayer } = JSON.parse(data);
  const game = games[gameId];
  if (!game) return;

  const gp = game.players.find((p) => p.sessionId === indexPlayer);
  if (!gp) return;

  const totalLength = (ships as Ship[]).reduce((sum, s) => sum + s.length, 0);
  if (ships.length !== 10 || totalLength !== 20) {
    return send(ws, 'add_ships', {
      error: true,
      errorText: 'Incorrect set of ships',
    });
  }

  gp.ships = ships;
  gp.hits = new Set<string>();

  if (game.players.every((p) => p.ships && p.ships.length === 10)) {
    const firstSession = game.players[game.turnIndex].sessionId;

    game.players.forEach((p) => {
      send(p.ws, 'start_game', {
        ships: p.ships,
        currentPlayerIndex: firstSession,
      });
    });
  }
  console.log('[COMMAND] add_ships', JSON.stringify({ player: indexPlayer, ships: ships }, null, 2));
}
