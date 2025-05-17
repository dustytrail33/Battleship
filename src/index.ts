import WebSocket from 'ws';
import http from 'http';
import { WSMessage } from './types';
import handleReg from './handlers/handleReg';

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New connection');
  ws.on('message', (msg) => handleMessage(ws, msg.toString()));
  ws.on('close', () => console.log('Connection closed'));
});

function handleMessage(ws: WebSocket, raw: string) {
  const msg: WSMessage = JSON.parse(raw || '');
  switch (msg.type) {
    case 'reg':
      return handleReg(ws, msg.data as string);
    default:
      console.warn('Unknown type', msg.type);
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
