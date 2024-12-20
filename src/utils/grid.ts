import { Tagged } from "type-fest";

// Footgun-prevention
type X = Tagged<number, "x">;
type Y = Tagged<number, "y">;

export class OutOfBoundsError extends Error {}

export class Grid<T = string> {
  // Indexed as y-major to improve performance in reading input data
  private data: Map<Y, Map<X, T>>;
  private readonly minX: X | undefined;
  private readonly minY: Y | undefined;
  private readonly maxX: X | undefined;
  private readonly maxY: Y | undefined;

  constructor({
    minX,
    minY,
    maxX,
    maxY,
  }: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }) {
    this.data = new Map();
    if (minX) {
      this.minX = minX as X;
    }
    if (maxX) {
      this.maxX = maxX as X;
    }
    if (minY) {
      this.minY = minY as Y;
    }
    if (maxY) {
      this.maxY = maxY as Y;
    }
  }

  public set(x: number, y: number, value: T): void {
    const _x = x as X;
    const _y = y as Y;
    if (
      (this.minX !== undefined && _x < this.minX) ||
      (this.minY !== undefined && _y < this.minY) ||
      (this.maxX !== undefined && _x > this.maxX) ||
      (this.maxY !== undefined && _y > this.maxY)
    ) {
      throw new OutOfBoundsError("Out of bounds during set");
    }

    let row = this.data.get(_y);
    if (row === undefined) {
      row = new Map();
      this.data.set(_y, row);
    }
    row.set(_x, value);
  }

  public get(x: number, y: number): T | undefined {
    return this.data.get(y as Y)?.get(x as X);
  }

  public *[Symbol.iterator]() {
    for (const [y, row] of this.data) {
      for (const [x, cell] of row){
        yield [x, y, cell];
      }
    }
  }

  public static fromCharGrid<C = string>(
    charGrid: string,
    parseCell: (value: string)=>C|undefined,
    splitFn: (values: string) => Iterable<Iterable<string>> = (values) =>
      values.split("\n").map((row) => row.split(""))
  ): Grid<C> {
    const points: [X, Y, C][] = [];
    let y = 0 as Y;
    let x = 0 as X;
    for (const row of splitFn(charGrid)) {
      x = 0 as X;
      for (const cell of row) {
        const parsedValue = parseCell(cell);
        if (parsedValue !== undefined) {
          points.push([x,y,parsedValue]);
        }
        x++;
      }
      y++;
    }
    const grid = new Grid<C>({
      minX: 0,
      minY: 0,
      maxX: x-1,
      maxY: y-1
    });
    for (const [x,y,cell] of points) {
      grid.set(x, y, cell);
    }
    return grid
  }
}
