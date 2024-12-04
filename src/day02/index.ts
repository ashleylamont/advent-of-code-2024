import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) =>
    l
      .trim()
      .split(" ")
      .map((x) => Number(x)),
  );

const testReport = (
  report: number[],
  decreasing: boolean,
  canSkip: boolean = false,
): boolean => {
  let last = undefined;
  let skipped = false;
  for (const level of report) {
    if (last !== undefined) {
      const isCurrentlyDecreasing = level < last;
      if (
        !(
          decreasing === isCurrentlyDecreasing &&
          Math.abs(level - last) <= 3 &&
          level !== last
        )
      ) {
        if (!skipped && canSkip) {
          skipped = true;
          continue;
        }
        if (canSkip) return testReport(report.slice(1), decreasing);
        return false;
      }
    }
    last = level;
  }
  return true;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.filter(
    (report) => testReport(report, true) || testReport(report, false),
  ).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.filter(
    (report) =>
      testReport(report, true, true) || testReport(report, false, true),
  ).length;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 2,
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
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
