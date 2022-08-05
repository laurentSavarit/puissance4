import { Board } from "./services/Board";
import { Color } from "./types";

const test: string = "Hello World!";

console.log(test);

const board = new Board();

console.log(board.cells);
board.addToken({ name: "laurent", toPlay: true, color: Color.red }, [0, 0]);
console.log(board.cells);
