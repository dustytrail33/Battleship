import { players } from '../store';
import { IExtendedWebSocket } from '../types';
// import { WSMessage } from '../types';
import sendMessage from '../utils/sendMessage';
import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';

const handleReg = (ws: WebSocket, msg: string) => {
  const data = JSON.parse(msg || '');
  const { name, password } = data as { name: string; password: string };

  if (!name || !password) {
    return sendMessage(ws, 'reg', { name, error: true, errorText: 'Недостаточно данных' });
  }
    let player = Object.values(players).find((p) => p.name === name);
    if (!player) {
      const id = uuidv4();
      player = { name, password, id };
      players[id] = player;
      (ws as unknown as IExtendedWebSocket).playerStoreId = id;
    } else if (player.password !== password) {
      return sendMessage(ws, 'reg', { name, error: true, errorText: 'Неверный пароль' });
    }
    sendMessage(ws, 'reg', { name: player.name, index: player.id, error: false });
};

export default handleReg;
