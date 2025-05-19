import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { rooms, games } from '../storage';
import { send, broadcast } from '../utils/messaging';
import { createRoomList } from '../storage';
import { Game, IExtendedWebSocket } from '../types';

export function handleAddUser(ws: WebSocket, wss: WebSocketServer, data: string) {
  const roomId = JSON.parse(data)?.indexRoom;
  const room = rooms[roomId];
  const pid = (ws as unknown as IExtendedWebSocket).playerStoreId as string;
  if (!room || room.players.length !== 1 || !pid) return;

  room.players.push(pid);
  const gameId = uuidv4();
  const game: Game = { id: gameId, players: [], turnIndex: 0 };

  for (const storeId of room.players) {
    const client = [...wss.clients].find((c) => (c as unknown as IExtendedWebSocket).playerStoreId === storeId)!;
    const sessionId = uuidv4();
    game.players.push({
      ws: client as WebSocket,
      sessionId,
      playerStoreId: storeId,
      hits: new Set(),
      shots: []
    });
    send(client as WebSocket, 'create_game', { idGame: gameId, idPlayer: sessionId });
  }

  games[gameId] = game;
  delete rooms[roomId];
  broadcast(wss, 'update_room', createRoomList());
}
