import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(" ").map(Number);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cache = new Map<string, number>();

  const nodeCount = (node: number, remainingIterations: number): number => {
    const recurse = (newNode: number, newRemainingIterations: number): number => {
      const cacheKey = `${newNode}:${newRemainingIterations}`
      const cachedResult = cache.get(cacheKey);
      if (cachedResult !== undefined) {
        return cachedResult;
      }
      const newResult = nodeCount(newNode, newRemainingIterations);
      cache.set(cacheKey, newResult);
      return newResult;
    }

    if (remainingIterations === 0) {
      return 1;
    }

    if (node === 0) {
      return recurse(1, remainingIterations - 1);
    } else if (Math.floor(Math.log10(node)) % 2 === 1) {
      const expSize = Math.floor(Math.log10(node)+1)/2;
      // console.log(`Splitting ${node} into ${node % Math.pow(10, expSize)} and ${Math.floor(node / Math.pow(10, expSize))}`)
      return (
        recurse(node % Math.pow(10, expSize), remainingIterations - 1) +
        recurse(
          Math.floor(node / Math.pow(10, expSize)),
          remainingIterations - 1,
        )
      );
    } else {
      return recurse(node * 2024, remainingIterations - 1);
    }
  };

  return input.map((node)=>nodeCount(node, 25)).reduce((a,b)=>a+b);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cache = new Map<string, number>();

  const nodeCount = (node: number, remainingIterations: number): number => {
    const recurse = (newNode: number, newRemainingIterations: number): number => {
      const cacheKey = `${newNode}:${newRemainingIterations}`
      const cachedResult = cache.get(cacheKey);
      if (cachedResult !== undefined) {
        return cachedResult;
      }
      const newResult = nodeCount(newNode, newRemainingIterations);
      cache.set(cacheKey, newResult);
      return newResult;
    }

    if (remainingIterations === 0) {
      return 1;
    }

    if (node === 0) {
      return recurse(1, remainingIterations - 1);
    } else if (Math.floor(Math.log10(node)) % 2 === 1) {
      const expSize = Math.floor(Math.log10(node)+1)/2;
      // console.log(`Splitting ${node} into ${node % Math.pow(10, expSize)} and ${Math.floor(node / Math.pow(10, expSize))}`)
      return (
        recurse(node % Math.pow(10, expSize), remainingIterations - 1) +
        recurse(
          Math.floor(node / Math.pow(10, expSize)),
          remainingIterations - 1,
        )
      );
    } else {
      return recurse(node * 2024, remainingIterations - 1);
    }
  };

  return input.map((node)=>nodeCount(node, 75)).reduce((a,b)=>a+b);
};

run({
  part1: {
    tests: [
      {
        input: `125 17`,
        expected: 55312,
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
