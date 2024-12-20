import run from "aocrunner";

type Point = [number, number];

const positionIndex = (x: number, y: number, width: number) => x + y * width;
const locIndex = (
  x: number,
  y: number,
  xDirection: number,
  yDirection: number,
  width: number,
) => (x + y * width) * 4 + (xDirection + yDirection + Math.abs(xDirection) + 1);

const parseInput = (rawInput: string) => {
  const obstacles = new Set<number>();
  let guardPos: Point | undefined = undefined;

  const rows = rawInput.split("\n");
  const width = rows[0].length;
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      switch (rows[y][x]) {
        case "#":
          obstacles.add(positionIndex(x, y, width));
          break;
        case "^":
          guardPos = [x, y];
          break;
      }
    }
  }
  if (guardPos === undefined) {
    throw new Error();
  }
  return { obstacles, guardPos, width, height: rows.length };
};

function* followPath(
  startingPoint: Point,
  startingDirection: Point,
  obstacles: Set<number>,
  width: number,
  height: number,
): Generator<[...Point, ...Point]> {
  let direction = startingDirection;
  let position = startingPoint;
  while (
    position[0] >= 0 &&
    position[1] >= 0 &&
    position[0] < width &&
    position[1] < height
  ) {
    yield [...position, ...direction];
    const nextPosition: Point = [
      direction[0] + position[0],
      direction[1] + position[1],
    ];
    if (nextPosition[0] < 0 || nextPosition[1] < 0 || nextPosition[0] >= width || nextPosition[1] >= height) {
      break;
    }
    if (obstacles.has(positionIndex(...nextPosition, width))) {
      direction = [-direction[1], direction[0]];
    } else {
      position = nextPosition;
    }
  }
}

function drawPath(path: number[], obstacles: number[], extraObstacle: number|undefined, width: number, height: number, guardPos: number): void {
  const output = [];
  for (let y = 0; y < height; y++) {
    let row = `${y.toString().padStart(2, ' ')}: `;
    for (let x = 0; x < width; x++) {
      const posIdx = positionIndex(x,y,width);
      if (posIdx === guardPos) {
        row += '^'
      } else if (posIdx === extraObstacle) {
        row += 'O'
      } else if (obstacles.includes(posIdx)) {
        row += '#'
      } else if (path.includes(posIdx)) {
        row += 'X'
      } else {
        row += '.'
      }
    }
    output.push(row)
  }
  console.log(output.join('\n'));
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const visited = new Set<number>();
  for (const [x, y] of followPath(
    input.guardPos,
    [0, -1],
    input.obstacles,
    input.width,
    input.height,
  )) {
    visited.add(positionIndex(x, y, input.width));
  }
  // drawPath([...visited.values()], [...input.obstacles.values()], undefined, input.width, input.height)
  return visited.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const originalPath: [...Point, ...Point][] = [];
  for (const loc of followPath(
    input.guardPos,
    [0, -1],
    input.obstacles,
    input.width,
    input.height,
  )) {
    originalPath.push(loc);
  }

  // const originalPathSet = new Set(originalPath.map((loc) => locIndex(...loc, input.width)));
  const guardPos = positionIndex(
    originalPath[0][0],
    originalPath[0][1],
    input.width,
  );
  // console.log(`Starting from ${originalPath[0]}`)

  let loops = 0;
  for (let split = 1; split < originalPath.length; split ++) {
    const branchPoint = originalPath[split];
    // console.log(`Branching from ${branchPoint}`);
    const [x,y,xDir,yDir] = branchPoint;
    const nextPoint: Point = [
      x + xDir,
      y + yDir
    ];
    if (
      input.obstacles.has(positionIndex(...nextPoint, input.width)) ||
      positionIndex(...nextPoint, input.width) === guardPos
      ||
      originalPath.slice(0, split).some((pathEntry)=>pathEntry[0] === nextPoint[0] && pathEntry[1] === nextPoint[1])
    )
      continue;
    const newPathSet = new Set(originalPath.slice(0, split).map((loc)=>locIndex(...loc, input.width)));
    const newObstacles = new Set(input.obstacles);
    newObstacles.add(positionIndex(...nextPoint, input.width))
    for (const newLocation of followPath([x,y], [-yDir,xDir], newObstacles, input.width, input.height)) {
      const locValue = locIndex(...newLocation, input.width);
      if (newPathSet.has(locValue)) {
        loops += 1;
        // console.log("Looped at ", newLocation);
        // drawPath([...newPathSet.values()].map((v)=>Math.floor(v/4)), [...input.obstacles.values()], positionIndex(...nextPoint, input.width), input.width, input.height, guardPos)
        break;
      }
      newPathSet.add(locValue);
    }
  }
  return loops;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
      {
        input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 41,
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
      {
        input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 6,
      },
      {
        input: `.##..
....#
.....
.^.#.
.....`,
        expected: 1
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
