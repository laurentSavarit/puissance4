import { BoardStatus, Cell, Player } from "../types";

export class Board {
  cells: Cell[];
  players: Player[] = [];
  private status: BoardStatus = BoardStatus.NOK;

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
        playerId: null,
        point: [lineNumber, cellNumber],
      };
      allCells.push(cell);
      cellNumber++;
    }
    this.status = BoardStatus.OK;
    return allCells;
  }

  public addPlayer(player: Player) {
    if (this.players.length > 2)
      throw new Error(
        "Impossible d'ajouter le joueur, le nombre maximum de joueur sur une partie est de 2..."
      );
    this.players.push({ ...player, position: this.players.length + 1 });
  }

  public updatePlayerStatus(id: string) {
    const player = this.players.find((e) => e.id === id);

    if (!player) throw new Error("L'utilisateur recherché n'existe pas...");

    player.toPlay = !player.toPlay;

    this.players.forEach((e) => {
      if (e.id === id) e = player;
    });
  }

  public getStatus() {
    return this.status;
  }

  public getPlayerToPlay() {
    return this.players.find((e) => e.toPlay);
  }

  public getWinner(): Player | null {
    return this.players[0];
  }

  public addToken(playerId: string, posCell: [number, number]) {
    const player = this.players.find((e) => e.id === playerId);

    if (!player) {
      throw new Error("Impossible de trouver le joueur demandé...");
    }

    if (!player.toPlay)
      throw new Error(
        `Le joueur ${player.name} n'a pas le droit de jouer pour le moment...`
      );

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.cells.length; i++) {
      const { point, available } = this.cells[i];

      if (available && point[0] === posCell[0] && point[1] === posCell[1]) {
        this.cells[i].playerId = player.id;

        this.cells[i].available = false;

        this.updatePlayerStatus(player.id);
        break;
      }
    }
  }
}
