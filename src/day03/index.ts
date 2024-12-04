import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return [...input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)].reduce((acc, expr)=>acc+(Number(expr[1])*Number(expr[2])), 0)
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split('do()').map(s=>s.split('don\'t()')[0]).reduce((acc, section)=>acc+[...section.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)].reduce((acc, expr)=>acc+(Number(expr[1])*Number(expr[2])), 0), 0)
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
      {
        input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
        expected: 161
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
        input: 'xmul(2,4)&mul[3,7]!^don\'t()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))',
        expected: 48
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
