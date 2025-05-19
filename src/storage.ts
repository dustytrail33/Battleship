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

export function createWinnersList() {
  return Object.values(players)
    .filter((p) => (p.wins ?? 0) > 0)
    .map((p) => ({
      name: p.name,
      wins: p.wins ?? 0,
    }));
}
