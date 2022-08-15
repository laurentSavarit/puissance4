export type Cell = {
  available: boolean;
  playerId: Player["id"] | null;
};

export type Player = {
  id: string;
  name: string;
  color: Color;
  toPlay: boolean;
  position?: number;
};

export enum Color {
  red = "red",
  yellow = "yellow",
}

export enum BoardStatus {
  OK = "OK",
  NOK = "NOK",
  WAIT = "WAIT",
  PLAY = "PLAY",
}

export enum States {
  PLAYER_ONE_PLAY = "PLAYER_ONE_PLAY",
  PLAYER_TWO_PLAY = "PLAYER_TWO_PLAY",
  AWAIT_PLAYER = "AWAIT_PLAYER",
  WINNER = "WINNER",
  DRAW = "DRAW",
  FINISH = "FINISH",
}

export type Game = {
  status: BoardStatus;
  players: Player[];
  strokes: number;
  currentState: States;
  winner: Player["id"] | null;
  playerToPlay: Player["id"] | undefined;
};
