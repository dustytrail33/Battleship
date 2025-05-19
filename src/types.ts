import WebSocket, { Server } from 'ws';

export type Player = { name: string; password: string; id: string; wins?: number };
export type Room = { id: string; players: string[] };
export type Ship = { position: { x: number; y: number }; direction: boolean; length: number; type: string };
export type GamePlayer = {
  ws: WebSocket;
  sessionId: string;
  playerStoreId: string;
  ships?: Ship[];
  hits: Set<string>;
};
export type Game = { id: string; players: GamePlayer[]; turnIndex: number };

export interface IExtendedWebSocket extends WebSocket {
  playerStoreId: string;
  server: Server;
}
