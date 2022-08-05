import { Board } from "./services/Board";
import { Color, Player } from "./types";
import { v4 as uuidv4 } from "uuid";
import { StateMachine } from "./services/StateMachine";

const board = new StateMachine();

console.log(board.cells);
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
//board.addToken(user, [0, 0]);
//console.log(board.cells);
console.log(board.goTo());
