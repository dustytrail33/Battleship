import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { rooms, createRoomList } from '../storage';
import { broadcast } from '../utils/messaging';
import { IExtendedWebSocket } from '../types';

export function handleCreateRoom(
  ws: WebSocket,
  wss: WebSocketServer
) {
  const pid = (ws as unknown as IExtendedWebSocket).playerStoreId as string;
  if (!pid) return;
  const roomId = uuidv4();
  rooms[roomId] = { id: roomId, players: [pid] };
  broadcast(wss, 'update_room', createRoomList());
}