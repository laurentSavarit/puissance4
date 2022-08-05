import { States } from "../types";
import { Board } from "./Board";

export class StateMachine extends Board {
  private state: States = States.AWAIT_PLAYER;

  constructor() {
    super();
  }

  getState() {
    return this.state;
  }

  goTo() {
    switch (this.state) {
      case States.AWAIT_PLAYER:
        if (this.players.length === 2) {
          this.state = States.PLAYER_ONE_PLAY;
        }
        break;
      case States.PLAYER_ONE_PLAY:
      case States.PLAYER_TWO_PLAY:
        const isWinner = this.getWinner();
        if (isWinner) {
          this.state = States.WINNER;
          return;
        }
        const checkAllCells = this.cells.find((e) => !e.available);
        if (!isWinner && !checkAllCells) {
          this.state = States.DRAW;
          return;
        }
        if (this.state === States.PLAYER_ONE_PLAY) {
          this.state = States.PLAYER_TWO_PLAY;
        } else {
          this.state = States.PLAYER_ONE_PLAY;
        }
        break;
      case States.WINNER:
        this.state = States.FINISH;
        break;
      case States.DRAW:
        this.state = States.FINISH;
        break;
      case States.FINISH:
        this.state = States.AWAIT_PLAYER;
        break;
    }
    return this.state;
  }
}
