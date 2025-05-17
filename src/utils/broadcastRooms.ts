import { broadcastMessage } from '..';
import { players, rooms } from '../store';


const broadcastRooms = () => {
  const list = Object.values(rooms)
    .filter((r) => r.players.length === 1)
    .map((r) => ({ roomId: r.id, roomUsers: r.players.map((id) => ({ name: players[id].name, index: id })) }));
  broadcastMessage('update_room', list);
};

export default broadcastRooms;
