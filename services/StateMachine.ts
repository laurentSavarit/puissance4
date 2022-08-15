import { Game, Player, States } from "../types";
import { Board } from "./Board";
import { CustomError } from "./CustomError";

export class StateMachine extends Board {
  private state: States = States.AWAIT_PLAYER;

  constructor() {
    super();
  }

  public addPlayer(player: Player): Game | CustomError {
    try {
      super.addPlayer(player);
      this.goTo();
      return this.getGame();
    } catch (e: unknown) {
      return e as CustomError;
    }
  }

  public addToken(
    playerId: string,
    lineCell: number,
    posCell: number
  ): Game | CustomError {
    try {
      super.addToken(playerId, lineCell, posCell);
      this.goTo();
      return this.getGame();
    } catch (e: unknown) {
      return e as CustomError;
    }
  }

  getState() {
    return this.state;
  }

  getGame(): Game {
    return {
      cells: this.cells,
      players: this.players,
      currentState: this.state,
      status: this.getStatus(),
      winner: this.getWinner(),
    };
  }

  private goTo() {
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
        const checkAllCells = this.cells.find(
          (e) => !e.find((y) => !y.available)
        );
        if (!isWinner && !checkAllCells) {
          this.state = States.DRAW;
          return;
        }
        if (this.state === States.PLAYER_ONE_PLAY) {
          this.state = States.PLAYER_TWO_PLAY;
        } else {
          this.state = States.PLAYER_ONE_PLAY;
        }
        this.updatePlayerStatus(this.state);
        break;
      case States.WINNER:
        this.state = States.FINISH;
        break;
      case States.DRAW:
        this.state = States.FINISH;
        break;
      case States.FINISH:
        //this.state = States.AWAIT_PLAYER;
        break;
    }
    return this.state;
  }
}
