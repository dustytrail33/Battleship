import WebSocket from 'ws';

const sendMessage = (ws: WebSocket, type: string, data: unknown) => {
  const jsonData = JSON.stringify(data)
  ws.send(JSON.stringify({ type, data: jsonData, id: 0 }));
};

export default sendMessage;
