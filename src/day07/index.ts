import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map((line)=>({
  target: parseInt(line.split(': ')[0]),
  values: line.split(': ')[1].split(' ').map(v=>parseInt(v))
}));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let total = 0;

  outer_loop:
  for (const {target, values} of input) {
    // console.log("Outer loop start");
    for (let equationIndex = 0; equationIndex < Math.pow(2, values.length-1); equationIndex++) {
      let result = values[0];
      // console.log(values, equationIndex.toString(2).padStart(values.length-1, '0'))
      for (let i = 1; i < values.length; i++) {
        const op = (equationIndex >> (i-1))&1;
        if (op) {
          // console.log(`${result} += ${values[i]} => ${result+values[i]}`)
          result += values[i];
        }
        else {
          // console.log(`${result} *= ${values[i]} => ${result*values[i]}`)
          result *= values[i];
        }
      }
      // console.log(`${result} === ${target}`)
      if (result === target) {
        total += target;
        continue outer_loop;
      }
    }
  }

  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let total = 0;

  outer_loop:
    for (const {target, values} of input) {
      // console.log("Outer loop start");
      for (let equationIndex = 0; equationIndex < Math.pow(3, values.length-1); equationIndex++) {
        const equationString = equationIndex.toString(3).padStart(values.length-1, '0');
        let result = values[0];
        for (let i = 1; i < values.length; i++) {
          const op = equationString.at(i-1);
          if (op === '0') {
            // console.log(`${result} += ${values[i]} => ${result+values[i]}`)
            result += values[i];
          }
          else if (op === '1') {
            // console.log(`${result} *= ${values[i]} => ${result*values[i]}`)
            result *= values[i];
          } else {
            // console.log(`${result} ||= ${values[i]} => ${result*Math.pow(10, Math.floor(Math.log10(values[i])+1))+values[i]}`)
            result = result*Math.pow(10, Math.floor(Math.log10(values[i])+1))+values[i]
          }
        }
        // console.log(`${result} === ${target}`)
        if (result === target) {
          total += target;
          continue outer_loop;
        }
      }
    }

  return total;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
      {
        input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 3749
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
        input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 11387
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
