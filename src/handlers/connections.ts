import { WebSocket, WebSocketServer } from 'ws';
import { handleReg } from './reg';
import { handleAddUser } from './addUser';
import { handleCreateRoom } from './createRoom';
import { handleAddShips } from './addShips';
import { handleAttack } from './attack';
import { handleRandomAttack } from './randomAttack';

type WSMessage = { type: string; data: unknown; id: number };

export function handleConnection(ws: WebSocket, wss: WebSocketServer) {
  ws.on('message', (raw) => {
    let msg: WSMessage;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }
    switch (msg.type) {
      case 'reg':
        return handleReg(ws, wss, msg.data as string);
      case 'create_room':
        return handleCreateRoom(ws, wss);
      case 'add_user_to_room':
        return handleAddUser(ws, wss, msg.data as string);
      case 'add_ships':
        return handleAddShips(ws, wss, msg.data as string);
      case 'attack':
        return handleAttack(ws, wss, msg.data as string);
      case 'randomAttack':
        return handleRandomAttack(ws, wss, msg.data as string);
      default:
        console.warn('Unknown command:', msg.type);
    }
  });
}
