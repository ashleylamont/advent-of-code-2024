import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const width = input[0].length;
  const height = input.length;

  const directions: [number,number][] = [
    [0,1],
    [1,1],
    [1,0],
    [1,-1],
    [0,-1],
    [-1,-1],
    [-1,0],
    [-1,1]
  ];

  const target = 'XMAS';

  let count = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (input[y][x] === target[0]) {
        direction_loop:
        for (const [dx,dy] of directions) {
          for (let i = 1; i < target.length; i++) {
            const _x = x+(dx*i);
            const _y = y+(dy*i);
            if (_x < 0 || _y < 0 || _x >= width || _y >= width) continue direction_loop;
            if (input[_y][_x] !== target[i]) continue direction_loop;
          }
          count++;
        }
      }
    }
  }

  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const width = input[0].length;
  const height = input.length;

  let count = 0;
  for (let x = 1; x < width-1; x++) {
    for (let y = 1; y < height-1; y++) {
      if (input[y][x] === 'A') {
        const topLeft = input[y - 1][x - 1];
        const topRight = input[y - 1][x + 1];
        const bottomLeft = input[y + 1][x - 1];
        const bottomRight = input[y + 1][x + 1];
        if (
          (topLeft !== "M" || bottomRight !== "S") &&
          (topLeft !== "S" || bottomRight !== "M")
        ) continue;
        if (
          (bottomLeft !== "M" || topRight !== "S") &&
          (bottomLeft !== "S" || topRight !== "M")
        ) continue;
        count++;
      }
    }
  }

  return count;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 18
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 9
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
