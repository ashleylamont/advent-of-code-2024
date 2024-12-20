import run from "aocrunner";
import { Grid } from "../utils/grid.js";

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const directions = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1],
];

const parseInput = (rawInput: string) =>
  Grid.fromCharGrid<Digit>(rawInput, (cell) =>
    cell === "." ? undefined : (parseInt(cell) as Digit),
  );

const part1 = (rawInput: string) => {
  const inputGrid = parseInput(rawInput);

  let trailheadScoreTotal = 0;

  const findTrails = (
    startX: number,
    startY: number,
    startDigit: Digit = 0,
  ): [number, number][] => {
    if (startDigit === 9) {
      return [[startX, startY]];
    }

    const results = [];

    for (const [dx, dy] of directions) {
      if (inputGrid.get(startX + dx, startY + dy) === startDigit + 1) {
        results.push(
          findTrails(startX + dx, startY + dy, (startDigit + 1) as Digit),
        );
      }
    }

    const finalResults: [number, number][] = [];
    for (const endPoint of results.flat()) {
      if (
        !finalResults.some(([x, y]) => x === endPoint[0] && y === endPoint[1])
      ) {
        finalResults.push(endPoint);
      }
    }
    return finalResults;
  };

  for (const [x, y, cell] of inputGrid) {
    if (cell === 0) {
      // Start trail
      trailheadScoreTotal += findTrails(x, y).length;
    }
  }

  return trailheadScoreTotal;
};

const part2 = (rawInput: string) => {
  const inputGrid = parseInput(rawInput);

  let trailheadScoreTotal = 0;

  const findTrails = (
    startX: number,
    startY: number,
    startDigit: Digit = 0,
  ): number => {
    if (startDigit === 9) {
      return 1;
    }

    let sum = 0;

    for (const [dx, dy] of directions) {
      if (inputGrid.get(startX + dx, startY + dy) === startDigit + 1) {
        sum += findTrails(startX + dx, startY + dy, (startDigit + 1) as Digit);
      }
    }

    return sum;
  };

  for (const [x, y, cell] of inputGrid) {
    if (cell === 0) {
      // Start trail
      trailheadScoreTotal += findTrails(x, y);
    }
  }

  return trailheadScoreTotal;
};

run({
  part1: {
    tests: [
      {
        input: `0123
1234
8765
9876`,
        expected: 1,
      },
      {
        input: `...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`,
        expected: 2,
      },
      {
        input: `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`,
        expected: 4,
      },
      {
        input: `10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01`,
        expected: 3,
      },
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 36,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....`,
        expected: 3,
      },
      {
        input: `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`,
        expected: 13,
      },
      {
        input: `012345
123456
234567
345678
4.6789
56789.`,
        expected: 227,
      },
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 81,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
