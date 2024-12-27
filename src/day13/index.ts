import run from "aocrunner";
import { determinant, inverse, Matrix } from "ml-matrix";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n\n").map((gameString) => {
    const components: { x: number; y: number }[] = [];
    let target: { x: number; y: number } = { x: 0, y: 0 };
    for (const line of gameString.split("\n")) {
      if (line.startsWith("Button")) {
        const match = line.match(/Button \w: X\+(\d+), Y\+(\d+)/);
        if (match === null) throw new Error("Couldn't match button line.");
        components.push({ x: Number(match[1]), y: Number(match[2]) });
      } else {
        const match = line.match(/Prize: X=(\d+), Y=(\d+)/);
        if (match === null) throw new Error("Couldn't match prize line.");
        target = { x: Number(match[1]), y: Number(match[2]) };
      }
    }
    return { components, target };
  });
};

const part1 = (rawInput: string) => {
  const games = parseInput(rawInput);
  let cost = 0;

  for (const { components, target } of games) {
    // console.log({components,target})
    const C = new Matrix([
      components.map((c) => c.x),
      components.map((c) => c.y),
    ]);

    const t = new Matrix([[target.x], [target.y]]);

    const inverseC = inverse(C);
    const A = inverseC.mmul(t);
    const a = Math.round(A.get(0, 0));
    const b = Math.round(A.get(1, 0));
    if (a < 0 || b < 0) {
      // console.log(`Edge limits - a=${a} b=${b}`)
    } else if (target.x !== a * components[0].x + b * components[1].x) {
      // console.log(`X val wrong - ${target.x} != ${a} * ${components[0].x} + ${b} * ${components[1].x} (${a * components[0].x + b * components[1].x})`);
    } else if (target.y !== a * components[0].y + b * components[1].y) {
      // console.log(`Y val wrong - ${target.y} != ${a} * ${components[0].y} + ${b} * ${components[1].y} (${a * components[0].y + b * components[1].y})`);
    } else {
      cost += a * 3 + b;
      // console.log(`Used a=${a.toString().padStart(2,'0')}, b=${b.toString().padStart(2,'0')}`);
    }
  }

  return cost;
};

const part2 = (rawInput: string) => {
  const games = parseInput(rawInput);
  let cost = 0;

  for (const { components, target } of games) {
    // console.log({components,target})
    target.x += 10000000000000;
    target.y += 10000000000000;
    const C = new Matrix([
      components.map((c) => c.x),
      components.map((c) => c.y),
    ]);

    const t = new Matrix([[target.x], [target.y]]);

    const inverseC = inverse(C);
    const A = inverseC.mmul(t);
    const a = Math.round(A.get(0, 0));
    const b = Math.round(A.get(1, 0));
    if (a < 0 || b < 0) {
      // console.log(`Edge limits - a=${a} b=${b}`)
    } else if (target.x !== a * components[0].x + b * components[1].x) {
      // console.log(`X val wrong - ${target.x} != ${a} * ${components[0].x} + ${b} * ${components[1].x} (${a * components[0].x + b * components[1].x})`);
    } else if (target.y !== a * components[0].y + b * components[1].y) {
      // console.log(`Y val wrong - ${target.y} != ${a} * ${components[0].y} + ${b} * ${components[1].y} (${a * components[0].y + b * components[1].y})`);
    } else {
      cost += a * 3 + b;
      // console.log(`Used a=${a.toString().padStart(2,'0')}, b=${b.toString().padStart(2,'0')}`);
    }
  }

  return cost;
};

run({
  part1: {
    tests: [
      {
        input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
        expected: 480,
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
