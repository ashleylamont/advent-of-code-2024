import run from "aocrunner";

const part1 = (rawInput: string) => {
  const fileSystem: (number | undefined)[] = [];
  let fileId = 0;
  for (let i = 0; i < rawInput.length; i++) {
    if (i % 2 === 0) {
      // Create new file segment
      for (let j = 0; j < parseInt(rawInput.at(i)!); j++) {
        fileSystem.push(fileId);
      }
      fileId++;
    } else {
      // Create new blank block
      for (let j = 0; j < parseInt(rawInput.at(i)!); j++) {
        fileSystem.push(undefined);
      }
    }
  }

  let leftPointer = 0;
  let rightPointer = fileSystem.length - 1;

  while (leftPointer < rightPointer) {
    if (fileSystem[leftPointer] !== undefined) {
      leftPointer++;
    } else if (fileSystem[rightPointer] === undefined) {
      rightPointer--;
    } else {
      fileSystem[leftPointer] = fileSystem[rightPointer];
      fileSystem[rightPointer] = undefined;
    }
  }

  return fileSystem.reduce(
    (acc: number, val, index) => acc + (val ?? 0) * index,
    0,
  );
};

const part2 = (rawInput: string) => {
  let fileSystem: {
    id: number | undefined;
    size: number;
  }[] = [];
  let fileId = 0;
  for (let i = 0; i < rawInput.length; i++) {
    if (i % 2 === 0) {
      // Create new file segment
      fileSystem.push({
        id: fileId,
        size: parseInt(rawInput.at(i)!),
      });
      fileId++;
    } else {
      // Create new blank block
      fileSystem.push({
        id: undefined,
        size: parseInt(rawInput.at(i)!),
      });
    }
  }

  // console.log(fileSystem.map((block)=>block.id===undefined?'_'.repeat(block.size):block.id.toString(36).repeat(block.size)).join(''))

  const movedBlocks = new Set<number>();

  for (let i = fileSystem.length-1; i >= 0; i--) {
    if (
      !(fileSystem[i].id === undefined || movedBlocks.has(fileSystem[i].id!))
    ) {
      // console.log(`Trying to move file ID ${fileSystem[i].id}`)
      for (let targetBlock = 0; targetBlock < i; targetBlock++) {
        if (
          fileSystem[targetBlock].id === undefined &&
          fileSystem[targetBlock].size >= fileSystem[i].size
        ) {
          const newFreeSpace = fileSystem[targetBlock].size - fileSystem[i].size;
          fileSystem[targetBlock].id = fileSystem[i].id;
          fileSystem[targetBlock].size = fileSystem[i].size;
          fileSystem[i].id = undefined;
          if (newFreeSpace > 0) {
            fileSystem = [...fileSystem.slice(0,targetBlock+1), {id: undefined, size: newFreeSpace}, ...fileSystem.slice(targetBlock+1)];
            i++;
          }
          movedBlocks.add(fileSystem[targetBlock].id!);
          break;
        }
      }

      // console.log(fileSystem.map((block)=>block.id===undefined?'_'.repeat(block.size):block.id.toString(36).repeat(block.size)).join(''))
    }
  }

  // console.log(fileSystem.map((block)=>block.id===undefined?'_'.repeat(block.size):block.id.toString(36).repeat(block.size)).join(''))

  return fileSystem.reduce(
    ([total, blockIndex]: [number, number], segment): [number, number] => {
      if (segment.id === undefined) {
        return [total, blockIndex + segment.size];
      } else {
        let newTotal = total;
        for (let i = 0; i < segment.size; i++) {
          newTotal += segment.id * (i + blockIndex);
        }
        return [newTotal, blockIndex + segment.size];
      }
    },
    [0, 0],
  )[0];
};

run({
  part1: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 1928,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
