import http from 'http';
import { httpServer } from '../http_server';
import { handleConnection } from './handlers/connections';
import { WebSocketServer } from 'ws';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const PORT = 3000;
const server = http.createServer();

const wss = new WebSocketServer({ server });

wss.on('connection', ws => handleConnection(ws, wss));

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
