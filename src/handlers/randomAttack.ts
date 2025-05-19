import { WebSocket, WebSocketServer } from 'ws';
import { handleAttack } from './attack';

export function handleRandomAttack(ws: WebSocket, wss: WebSocketServer, data: string) {
  const { gameId, indexPlayer } = JSON.parse(data);
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  handleAttack(ws, wss, JSON.stringify({ gameId: gameId, x, y, indexPlayer: indexPlayer }));
  console.log('[COMMAND] random attack', JSON.stringify({ position: { x, y } }, null, 2));
}
