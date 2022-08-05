export type Cell = {
  available: boolean;
  player: Player | null;
  point: [number, number];
};

export type Player = {
  name: string;
  color: Color;
  toPlay: boolean;
};

export enum Color {
  red = "red",
  yellow = "yellow",
}
