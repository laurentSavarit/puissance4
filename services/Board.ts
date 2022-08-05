import type { Cell, Player } from "../types";

export class Board {
  cells: Cell[];
  players: Player[] = [];

  constructor() {
    this.cells = this.generateCells();
  }

  private generateCells() {
    const allCells: Cell[] = [];
    let lineNumber = -1;
    let cellNumber = 0;

    for (let i = 0; i < 42; i++) {
      if (i % 7 === 0) {
        lineNumber++;
        cellNumber = 0;
      }

      const cell: Cell = {
        available: true,
        player: null,
        point: [lineNumber, cellNumber],
      };
      allCells.push(cell);
      cellNumber++;
    }
    return allCells;
  }

  public addToken(player: Player, posCell: [number, number]) {
    if (!player.toPlay)
      throw new Error(
        `Le joueur ${player.name} n'a pas le droit de jouer pour le moment...`
      );

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.cells.length; i++) {
      const { point, available } = this.cells[i];

      if (available && point[0] === posCell[0] && point[1] === posCell[1]) {
        this.cells[i].player = player;
        if (this.cells[i].player !== null) {
          this.cells[i].available = false;
        }
        break;
      }
    }
  }
}
