import { Board } from "./services/Board";
import { Color, Player } from "./types";
import { v4 as uuidv4 } from "uuid";
import { StateMachine } from "./services/StateMachine";
import { CustomError } from "./services/CustomError";

const board = new StateMachine();

const user: Player = {
  name: "laurent",
  toPlay: true,
  color: Color.red,
  id: uuidv4(),
};
const user2: Player = {
  name: "steph",
  toPlay: true,
  color: Color.yellow,
  id: uuidv4(),
};
board.addPlayer(user);

board.addPlayer(user2);

board.addToken(user.id, 0, 0);
//board.addToken(user2.id, 1, 0);
const toto = board.addToken(user.id, 1, 1);

if (toto instanceof Error) {
  console.log(toto.message);
}

board.addToken(user2.id, 5, 5);
board.addToken(user.id, 2, 2);
board.addToken(user2.id, 1, 2);
board.addToken(user.id, 3, 3);
board.addToken(user2.id, 1, 5);
