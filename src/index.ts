import WebSocket from 'ws';
import http from 'http';
import { WSMessage } from './types';
import handleReg from './handlers/handleReg';
import handleCreateRoom from './handlers/handleCreateRoom';

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New connection');
  ws.on('message', (msg) => handleMessage(ws, msg.toString()));
  ws.on('close', () => console.log('Connection closed'));
});

export function broadcastMessage(type: string, data: unknown) {
  const jsonData = JSON.stringify(data);
  const msg = JSON.stringify({ type, data: jsonData, id: 0 });

  wss.clients.forEach((c) => {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  });
}

function handleMessage(ws: WebSocket, raw: string) {
  const msg: WSMessage = JSON.parse(raw || '');
  console.log('message', msg);
  switch (msg.type) {
    case 'reg':
      return handleReg(ws, msg.data as string);
    case 'create_room':
      return handleCreateRoom(ws);
    default:
      console.warn('Unknown type', msg.type);
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
