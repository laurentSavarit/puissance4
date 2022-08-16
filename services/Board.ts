import { BoardStatus, Cell, Player, States } from "../types";
import { CustomError } from "./CustomError";

export class Board {
  cells: Cell[][];
  players: Player[] = [];
  private status: BoardStatus = BoardStatus.NOK;
  private strokes: number = 0;

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

  public getWinner(): Player["id"] | null {
    // on gagne lorsque 4 jetons sont alignés (ligne, colonne ou diagonale)

    let player: string | null = null;

    this.cells.forEach((raw, indexRaw) => {
      raw.forEach((cell, indexCell) => {
        if (cell.available) return;
        const result = this.checkWin(indexRaw, indexCell, cell.playerId);

        if (result) {
          player = cell.playerId;
        }
      });
    });

    return player ? player : null;
  }

  public addToken(playerId: string, lineCell: number, posCell: number) {
    if (lineCell < 0 || lineCell > 5 || posCell < 0 || posCell > 6) {
      throw new CustomError(
        "Le numéro de ligne doit être compris entre 0 et 5 (inclus) et le numéro de la cellule entre 0 et 6 (inclus)...",
        400
      );
    }

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
      this.strokes++;
    } else {
      throw new CustomError("Cette case est déja prise...", 400);
    }
  }

  private checkWin(raw: number, cell: number, playerId: string | null) {
    const winningCombination = [
      [
        [raw, cell],
        [raw + 1, cell + 1],
        [raw + 2, cell + 2],
        [raw + 3, cell + 3],
      ],
      [
        [raw, cell],
        [raw + 1, cell - 1],
        [raw + 2, cell - 2],
        [raw + 3, cell - 3],
      ],
      [
        [raw, cell],
        [raw, cell + 1],
        [raw, cell + 2],
        [raw, cell + 3],
      ],
      [
        [raw, cell],
        [raw + 1, cell],
        [raw + 2, cell],
        [raw + 3, cell],
      ],
    ];

    const win = winningCombination.map((combination) => {
      const result = combination.map((coords) => {
        return this.cells[coords[0]] &&
          this.cells[coords[0]][coords[1]] &&
          !this.cells[coords[0]][coords[1]].available &&
          this.cells[coords[0]][coords[1]].playerId &&
          this.cells[coords[0]][coords[1]].playerId === playerId
          ? true
          : false;
      });

      return !result.includes(false);
    });

    return win.includes(true);
  }

  public newGame() {
    this.strokes = 0;
    this.players.length = 0;
    this.cells = this.generateCells();
  }

  public getStrokes() {
    return this.strokes;
  }
}
