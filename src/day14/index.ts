import run from "aocrunner";
import * as fs from "node:fs";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const values = line.match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/)!;
    return {
      p: {
        x: Number(values[1]),
        y: Number(values[2]),
      },
      v: {
        x: Number(values[3]),
        y: Number(values[4]),
      },
    };
  });

const part1 = (rawInput: string) => {
  const initialRobots = parseInput(rawInput);
  const isTest = initialRobots.length < 100;
  const width = isTest ? 11 : 101;
  const height = isTest ? 7 : 103;

  const endRobots = initialRobots.map(({ p, v }) => ({
    x: (((p.x + v.x * 100) % width) + width) % width,
    y: (((p.y + v.y * 100) % height) + height) % height,
  }));

  const firstQuadrantCount = endRobots.filter(
    ({ x, y }) => x < Math.floor(width / 2) && y < Math.floor(height / 2),
  ).length;
  const secondQuadrantCount = endRobots.filter(
    ({ x, y }) => x < Math.floor(width / 2) && y > Math.floor(height / 2),
  ).length;
  const thirdQuadrantCount = endRobots.filter(
    ({ x, y }) => x > Math.floor(width / 2) && y < Math.floor(height / 2),
  ).length;
  const fourthQuadrantCount = endRobots.filter(
    ({ x, y }) => x > Math.floor(width / 2) && y > Math.floor(height / 2),
  ).length;
  // console.log(firstQuadrantCount,secondQuadrantCount,thirdQuadrantCount,fourthQuadrantCount)

  return (
    firstQuadrantCount *
    secondQuadrantCount *
    thirdQuadrantCount *
    fourthQuadrantCount
  );
};

const part2 = (rawInput: string) => {
  let robots = parseInput(rawInput);
  const width = 101;
  const height = 103;

  for (let step = 1; step < 10000; step++) {
    robots.forEach(({ p, v }) => {
      p.x = (((p.x + v.x) % width) + width) % width;
      p.y = (((p.y + v.y) % height) + height) % height;
    });

    const columnCheck = Array(width)
      .fill(null)
      .map((_, i) => i)
      .some((x) => robots.filter(({ p }) => p.x === x).length > 30);
    const rowCheck = Array(height)
      .fill(null)
      .map((_, i) => i)
      .some((y) => robots.filter(({ p }) => p.y === y).length > 20);

    if (rowCheck&&columnCheck) {
      return step;
      // let image = "";
      // image += `Step ${step}\n\n`;
      // for (let y = 0; y < height; y++) {
      //   let row = "";
      //   for (let x = 0; x < width; x++) {
      //     if (robots.some(({ p }) => p.x === x && p.y === y)) {
      //       row += "#";
      //     } else {
      //       row += " ";
      //     }
      //   }
      //   image += row + "\n";
      //   console.log(image);
      // }
    }
  }
};

run({
  part1: {
    tests: [
      {
        input: `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
        expected: 12,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
