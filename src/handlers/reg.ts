import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { players } from '../storage';
import { send, broadcast } from '../utils/messaging';
import { createRoomList } from '../storage';
import { IExtendedWebSocket } from '../types';

export function handleReg(ws: WebSocket, wss: WebSocketServer, data: string) {
  const { name, password } = JSON.parse(data);
  if (!name || !password) {
    return send(ws, 'reg', { error: true, errorText: 'Недостаточно данных' });
  }
  let player = Object.values(players).find((p) => p.name === name);
  if (!player) {
    const id = uuidv4();
    player = { name, password, id, wins: 0 };
    players[id] = player;
  } else if (player.password !== password) {
    return send(ws, 'reg', { error: true, errorText: 'Неверный пароль' });
  }

  (ws as unknown as IExtendedWebSocket).playerStoreId = player.id;
  send(ws, 'reg', { name: player.name, index: player.id, error: false });

  broadcast(wss, 'update_room', createRoomList());
}
