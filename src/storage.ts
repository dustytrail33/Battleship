import { Game, Player, Room } from './types';

export const players: Record<string, Player> = {};
export const rooms: Record<string, Room> = {};
export const games: Record<string, Game> = {};

export function createRoomList() {
  return Object.values(rooms)
    .filter((r) => r.players.length === 1)
    .map((r) => ({
      roomId: r.id,
      roomUsers: r.players.map((pid) => ({
        name: players[pid].name,
        index: pid,
      })),
    }));
}
