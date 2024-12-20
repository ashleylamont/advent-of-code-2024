import run from "aocrunner";

type Point = [number, number];

const positionIndex = (x: number, y: number, width: number) => x + y * width;

const parseInput = (rawInput: string) => {
  const frequencies = new Map<string, Point[]>();
  const rows = rawInput.split("\n");
  const width = rows[0].length;
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      const value = rows[y][x];
      if (value !== ".") {
        if (frequencies.has(value)) {
          frequencies.get(value)!.push([x, y]);
        } else {
          frequencies.set(value, [[x, y]]);
        }
      }
    }
  }
  return { frequencies, width, height: rows.length };
};

const part1 = (rawInput: string) => {
  const { frequencies, width, height } = parseInput(rawInput);

  const antinodes = new Set<number>();

  for (const points of frequencies.values()) {
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points.length; j++) {
        if (i === j) continue;
        const [x1, y1] = points[i];
        const [x2, y2] = points[j];
        const x3 = 2 * x2 - x1;
        const y3 = 2 * y2 - y1;
        if (x3 >= 0 && y3 >= 0 && x3 < width && y3 < height) {
          antinodes.add(positionIndex(x3, y3, width));
        }
      }
    }
  }

  return antinodes.size;
};

const part2 = (rawInput: string) => {
  const { frequencies, width, height } = parseInput(rawInput);

  const antinodes = new Set<number>();

  for (const points of frequencies.values()) {
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points.length; j++) {
        if (i === j) continue;
        const [x1, y1] = points[i];
        const [x2, y2] = points[j];
        let d = 0;
        while (true) {
          const x3 = x2 + d * (x2 - x1);
          const y3 = y2 + d * (y2 - y1);
          if (x3 >= 0 && y3 >= 0 && x3 < width && y3 < height) {
            antinodes.add(positionIndex(x3, y3, width));
            d++;
          } else {
            break;
          }
        }
      }
    }
  }

  return antinodes.size;
};

run({
  part1: {
    tests: [
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
