export type Player = { name: string; password: string; id: string };
export type Room = { id: string; players: string[] };
export type Ship = { position: { x: number; y: number }; direction: boolean; length: number; type: 'small'|'medium'|'large'|'huge' };
export type Game = {
  id: string;
  players: { ws: WebSocket; id: string; ships?: Ship[]; hits: Set<string> }[];
  turnIndex: number;
};


export type WSMessage = { type: string; data: unknown; id: number };

export interface IExtendedWebSocket extends WebSocket {
  playerStoreId?: string;
}