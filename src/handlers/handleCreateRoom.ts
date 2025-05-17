import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { rooms } from '../store';
import { IExtendedWebSocket } from '../types';
import broadcastRooms from '../utils/broadcastRooms';



const handleCreateRoom = (ws: WebSocket) => {

  const pid = (ws as unknown as IExtendedWebSocket).playerStoreId as string;
  console.log( rooms, pid )
  if (!pid) return;
  const roomId = uuidv4();
  rooms[roomId] = { id: roomId, players: [pid] };
  broadcastRooms();
}

export default handleCreateRoom