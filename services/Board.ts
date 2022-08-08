import { BoardStatus, Cell, Player, States } from "../types";
import { CustomError } from "./CustomError";

export class Board {
  cells: Cell[][];
  players: Player[] = [];
  private status: BoardStatus = BoardStatus.NOK;

  constructor() {
    this.cells = this.generateCells();
  }

  private generateCells() {
    const allCells: Cell[][] = [];

    for (let i = 0; i < 6; i++) {
      const lineCells = [];
      for (let y = 0; y < 7; y++) {
        const cell: Cell = {
          available: true,
          playerId: null,
        };
        lineCells.push(cell);
      }
      allCells.push(lineCells);
    }

    this.status = BoardStatus.OK;
    return allCells;
  }

  public addPlayer(player: Player) {
    if (this.players.length > 2)
      throw new CustomError(
        "Impossible d'ajouter le joueur, le nombre maximum de joueur sur une partie est de 2...",
        401
      );
    this.players.push({ ...player, position: this.players.length + 1 });
  }

  public updatePlayerStatus(state: States) {
    switch (state) {
      case States.PLAYER_ONE_PLAY:
        this.players[0].toPlay = true;
        this.players[1].toPlay = false;
        break;
      case States.PLAYER_TWO_PLAY:
        this.players[0].toPlay = false;
        this.players[1].toPlay = true;
        break;
    }
  }

  public getStatus() {
    return this.status;
  }

  public getPlayerToPlay() {
    return this.players.find((e) => e.toPlay);
  }

  public getWinner(): Player | null {
    // on gagne lorsque 4 jetons sont alignés (ligne, colonne ou diagonale)
    let count = 0;
    let player: string | null = null;
    // on vérifie en ligne
    this.cells.forEach((cell) => {
      if (count === 4) return;
      if (count !== 0) count = 0;
      cell.forEach((curr, index) => {
        if (count === 4) return;
        if (curr.playerId && curr.playerId === cell[index + 1].playerId) {
          if (count === 0) {
            count += 2;
          } else count++;
          player = curr.playerId;
        } else {
          count = 0;
          player = null;
        }
      });
    });

    // on vérifie en colonne

    this.cells.forEach((cell, index) => {
      if (count === 4) return;
      if (count !== 0) count = 0;
      if (
        cell[index].playerId &&
        this.cells[index + 1] &&
        cell[index].playerId === this.cells[index + 1][index].playerId
      ) {
        if (count === 0) {
          count += 2;
        } else count++;
        player = cell[index].playerId;
      } else {
        count = 0;
        player = null;
      }
    });

    // on vérifie en diagonale...
    /*this.cells.forEach((cell, index) => {
      if (count === 4) return;
      if (count !== 0) count = 0;

      if (
        cell[index] &&
        this.cells[index - 1] &&
        index > 0 &&
        cell[index].playerId &&
        cell[index].playerId ===
          (this.cells[index - 1][index - 1]?.playerId ||
            this.cells[index - 1][index + 1]?.playerId ||
            this.cells[index + 1][index - 1]?.playerId ||
            this.cells[index + 1][index + 1]?.playerId)
      ) {
        console.log("true!");
      }
    });*/

    return player ? this.players.find((e) => e.id === player)! : null;
  }

  public addToken(playerId: string, lineCell: number, posCell: number) {
    const player = this.players.find((e) => e.id === playerId);

    if (!player) {
      throw new CustomError("Impossible de trouver le joueur demandé...", 404);
    }

    if (!player.toPlay)
      throw new CustomError(
        `Le joueur ${player.name} n'a pas le droit de jouer pour le moment...`,
        403
      );

    if (this.cells[lineCell][posCell].available) {
      this.cells[lineCell][posCell].available = false;
      this.cells[lineCell][posCell].playerId = player.id;
    } else {
      throw new CustomError("Cette case est déja prise...", 400);
    }
  }
}
