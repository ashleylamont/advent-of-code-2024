import { Tagged } from "type-fest";

// Footgun-prevention
type X = Tagged<number, "x">;
type Y = Tagged<number, "y">;
type Point<T> = [X, Y, T];

export class OutOfBoundsError extends Error {}

export class Grid<T = string> {
  // Indexed as y-major to improve performance in reading input data
  private readonly data: Map<Y, Map<X, T>>;
  public readonly minX: X | undefined;
  public readonly minY: Y | undefined;
  public readonly maxX: X | undefined;
  public readonly maxY: Y | undefined;

  constructor({
    minX,
    minY,
    maxX,
    maxY,
  }: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  } = {}) {
    this.data = new Map();
    if (minX !== undefined) {
      this.minX = minX as X;
    }
    if (maxX !== undefined) {
      this.maxX = maxX as X;
    }
    if (minY !== undefined) {
      this.minY = minY as Y;
    }
    if (maxY !== undefined) {
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

  public *[Symbol.iterator](): IterableIterator<Point<T>> {
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

  public cardinalNeighbours(x: number, y: number, includeUndefined: true): IterableIterator<Point<T|undefined>>;
  public cardinalNeighbours(x: number, y: number, includeUndefined?: false): IterableIterator<Point<T>>;
  public *cardinalNeighbours(x: number, y: number, includeUndefined: boolean = false): IterableIterator<Point<T|undefined>> {
    const left = this.get(x-1, y);
    if (left !== undefined || includeUndefined) yield [x-1 as X, y as Y, left];
    const right = this.get(x+1, y);
    if (right !== undefined || includeUndefined) yield [x+1 as X, y as Y, right];
    const top = this.get(x, y-1);
    if (top !== undefined || includeUndefined) yield [x as X, y-1 as Y, top];
    const bottom = this.get(x, y+1);
    if (bottom !== undefined || includeUndefined) yield [x as X, y+1 as Y, bottom];
  }

  public get size() {
    let size = 0;
    for (const [_y, row] of this.data) {
      size += row.size;
    }
    return size;
  }
}
