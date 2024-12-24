import run from "aocrunner";
import { Grid } from "../utils/grid.js";

const parseInput = (rawInput: string) => Grid.fromCharGrid(rawInput, (v) => v);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const unplaced = [...input];
  const regions: Grid[] = [];

  while (unplaced.length > 0) {
    const newRegionStart = unplaced.pop()!;
    const frontier = [newRegionStart];
    const newRegion = new Grid();
    newRegion.set(...newRegionStart);
    while (frontier.length > 0) {
      const expansion = frontier.pop()!;
      for (const neighbour of input.cardinalNeighbours(
        expansion[0],
        expansion[1],
      )) {
        const [neighbourX, neighbourY, neighbourValue] = neighbour;
        if (newRegion.get(neighbourX, neighbourY) !== undefined) continue;
        if (neighbourValue !== newRegionStart[2]) continue;
        frontier.push(neighbour);
        newRegion.set(...neighbour);
        unplaced.splice(
          unplaced.findIndex(([x, y]) => x === neighbourX && y === neighbourY),
          1,
        );
      }
    }
    regions.push(newRegion);
  }

  let totalSize = 0;
  for (const region of regions) {
    let area = region.size;
    let perimeter = 0;
    for (const cell of region) {
      for (const [neighbourX, neighbourY] of input.cardinalNeighbours(
        cell[0],
        cell[1],
        true,
      )) {
        if (region.get(neighbourX, neighbourY) === undefined) {
          perimeter++;
        }
      }
    }
    // console.log(`Region containing ${[...region][0][2]}: A=${area}, P=${perimeter}`)
    totalSize += area * perimeter;
  }

  return totalSize;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const unplaced = [...input];
  const regions: Grid[] = [];

  while (unplaced.length > 0) {
    const newRegionStart = unplaced.pop()!;
    const frontier = [newRegionStart];
    const newRegion = new Grid();
    newRegion.set(...newRegionStart);
    while (frontier.length > 0) {
      const expansion = frontier.pop()!;
      for (const neighbour of input.cardinalNeighbours(
        expansion[0],
        expansion[1],
      )) {
        const [neighbourX, neighbourY, neighbourValue] = neighbour;
        if (newRegion.get(neighbourX, neighbourY) !== undefined) continue;
        if (neighbourValue !== newRegionStart[2]) continue;
        frontier.push(neighbour);
        newRegion.set(...neighbour);
        unplaced.splice(
          unplaced.findIndex(([x, y]) => x === neighbourX && y === neighbourY),
          1,
        );
      }
    }
    regions.push(newRegion);
  }

  let totalSize = 0;
  for (const region of regions) {
    let area = region.size;
    // console.log([...region]);
    let sideCount = 0;
    for (let x = 0; x <= input.maxX! + 1; x++) {
      for (let y = 0; y <= input.maxY! + 1; y++) {
        let filledCount = 0;
        let oppositeCount = 0;
        if (region.get(x, y) !== undefined) {
          filledCount++;
          oppositeCount++;
        }
        if (region.get(x, y - 1) !== undefined) filledCount++;
        if (region.get(x - 1, y) !== undefined) filledCount++;
        if (region.get(x - 1, y - 1) !== undefined) {
          filledCount++;
          oppositeCount++;
        }
        if (filledCount === 1 || filledCount === 3) sideCount++;
        if (filledCount === 2 && (oppositeCount === 2 || oppositeCount === 0))
          sideCount += 2;
        // console.log(x, y, filledCount);
      }
    }
    // console.log(
    //   `Region containing ${[...region][0][2]}: A=${area}, S=${sideCount}`,
    // );
    totalSize += area * sideCount;
  }

  return totalSize;
};

run({
  part1: {
    tests: [
      {
        input: `AAAA
BBCD
BBCC
EEEC`,
        expected: 140,
      },
      {
        input: `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
        expected: 772,
      },
      {
        input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1930,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `AAAA
BBCD
BBCC
EEEC`,
        expected: 80,
      },
      {
        input: `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
        expected: 436,
      },
      {
        input: `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
        expected: 236,
      },
      {
        input: `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
        expected: 368,
      },
      {
        input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1206,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
