import run from "aocrunner";

const parseInput = (rawInput: string) => ({
  rules: rawInput
    .split("\n\n")[0]
    .split("\n")
    .map(
      (rule) =>
        [Number(rule.split("|")[0]), Number(rule.split("|")[1])] as [
          number,
          number,
        ],
    ),
  updates: rawInput
    .split("\n\n")[1]
    .split("\n")
    .map((update) => update.split(",").map((page) => Number(page))),
});

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const pairMap = new Map<number, number[]>();
  for (const [a, b] of input.rules) {
    if (pairMap.has(a)) {
      pairMap.get(a)!.push(b);
    } else {
      pairMap.set(a, [b]);
    }
  }

  const validUpdates = input.updates.filter((update) => {
    for (let i = 0; i < update.length - 1; i++) {
      const outgoingEdges = pairMap.get(update[i]);
      if (outgoingEdges === undefined || !outgoingEdges.includes(update[i + 1]))
        return false;
    }
    return true;
  });

  return validUpdates.reduce(
    (acc, update) => update[Math.floor(update.length / 2)] + acc,
    0,
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const pairMap = new Map<number, number[]>();
  for (const [a, b] of input.rules) {
    if (pairMap.has(a)) {
      pairMap.get(a)!.push(b);
    } else {
      pairMap.set(a, [b]);
    }
  }

  let sum = 0;
  for (const update of input.updates) {
    const updateSet = new Set(update);
    const outDegrees = update
      .map((value) => ({
        value,
        outDegree:
          pairMap.get(value)?.reduce((acc, v) => acc+(updateSet.has(v)?1:0),0) ?? 0,
      }));
    const updateLength = update.length;
    if (!outDegrees.every((v,i)=>v.outDegree===(updateLength-1-i)))
      sum += outDegrees.find((v)=>v.outDegree===Math.floor(updateLength/2))!.value;
  }
  return sum;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 143,
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
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
