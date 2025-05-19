import WebSocket, { Server } from 'ws';

export type Position = {
  x: number;
  y: number;
};
export type Player = { name: string; password: string; id: string; wins?: number };
export type Room = { id: string; players: string[] };
export type Ship = {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: string;
  damages: number;
};
export type GamePlayer = {
  ws: WebSocket;
  sessionId: string;
  playerStoreId: string;
  ships?: Ship[];
  hits: Set<string>;
  shots?: Position[];
};
export type Game = { id: string; players: GamePlayer[]; turnIndex: number };

export interface IExtendedWebSocket extends WebSocket {
  playerStoreId: string;
  server: Server;
}
