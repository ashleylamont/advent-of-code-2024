import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const listA: number[] = [];
  const listB: number[] = [];
  for (const line of rawInput.split("\n")) {
    const [a, b] = /(\d+)\s+(\d+)/.exec(line)!.slice(1);
    listA.push(parseInt(a.trim()));
    listB.push(parseInt(b.trim()));
  }
  return [listA, listB];
};

const part1 = (rawInput: string) => {
  const [a,b] = parseInput(rawInput);

  a.sort();
  b.sort();

  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff += Math.abs(a[i] - b[i]);
  }

  return diff;
};

const part2 = (rawInput: string) => {
  const [a,b] = parseInput(rawInput);

  const bCount: Map<number, number> = new Map()
  for (const n of b) {
    bCount.set(n, (bCount.get(n) || 0) + 1);
  }

  let diff = 0;
  for (const n of a) {
    diff += n * (bCount.get(n) || 0);
  }

  return diff;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 11,
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
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 31,
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
