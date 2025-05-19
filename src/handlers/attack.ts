import { WebSocket, WebSocketServer } from 'ws';
import { games } from '../storage';
import { broadcast } from '../utils/messaging';
import { Position, Ship } from '../types';

export function handleAttack(ws: WebSocket, wss: WebSocketServer, data: string) {
  const { gameId, x, y, indexPlayer } = JSON.parse(data);
  const game = games[gameId];
  if (!game) return;

  const attackerIdx = game.players.findIndex((p) => p.sessionId === indexPlayer);
  if (attackerIdx !== game.turnIndex) return;
  // console.log( game.players, attackerIdx )
  const defender = game.players[1 - attackerIdx];
  const player = game.players[attackerIdx];

  let status;

  let damagedShip: Ship | null = null;
  for (const ship of defender.ships as Ship[]) {
    if (
      (!ship.direction && x >= ship.position.x && x < ship.position.x + ship.length && y === ship.position.y) ||
      (ship.direction && y >= ship.position.y && y < ship.position.y + ship.length && x === ship.position.x)
    ) {
      damagedShip = ship;
      break;
    }
  }

  if (!damagedShip) {
    game.turnIndex ^= 1;
    status = 'miss';
    broadcast(wss, 'attack', { position: { x, y }, currentPlayer: player.sessionId, status });
    broadcast(wss, 'turn', { currentPlayer: game.players[game.turnIndex].sessionId });
    return;
  }

  if (!damagedShip.damages) {
    damagedShip.damages = 1;
  } else {
    damagedShip.damages += 1;
  }

  if (damagedShip.damages === damagedShip.length) {
    status = 'killed';
  } else {
    status = 'shot';
  }

  const aroundCells: Position[] = [];
  if (status === 'killed') {
    for (
      let x = damagedShip.position.x - 1;
      x < damagedShip.position.x + 1 + (!damagedShip.direction ? damagedShip.length : 1);
      x += 1
    ) {
      for (
        let y = damagedShip.position.y - 1;
        y < damagedShip.position.y + 1 + (damagedShip.direction ? damagedShip.length : 1);
        y += 1
      ) {
        if (
          x < 0 ||
          x > 9 ||
          y < 0 ||
          y > 9 ||
          (player.shots as Position[]).some((shot) => shot.x === x && shot.y === y)
        ) {
          continue;
        }

        aroundCells.push({ x, y });
      }
    }
  }

  aroundCells.forEach((cell) => (player.shots as Position[]).push(cell));
  broadcast(wss, 'attack', { position: { x, y }, currentPlayer: player.sessionId, status });
}
