import WebSocket from 'ws';

export function send(ws: WebSocket, type: string, data: unknown) {
  const jsonData = JSON.stringify(data);
  ws.send(JSON.stringify({ type, data: jsonData, id: 0 }));
}

export function broadcast(wss: WebSocket.Server, type: string, data: unknown) {
  const jsonData = JSON.stringify(data);
  const msg = JSON.stringify({ type, data: jsonData, id: 0 });
  wss.clients.forEach((c) => {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  });
}
