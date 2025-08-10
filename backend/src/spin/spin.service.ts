import { Injectable } from '@nestjs/common';

const payments = {
  combinationOf4: {
    sw: 10,
    ic: 20,
    bk: 30,
    cl: 40,
  },
  combinationOf3: {
    sw: 1,
    ic: 2,
    bk: 3,
    cl: 4,
  },
  combinationOf2: {
    mk: 5,
  },
};

@Injectable()
export class SpinService {
  private slotList1 = ['cl', 'ic', 'mk', 'sw', 'bk'];
  private slotList2 = ['sw', 'ic', 'bk', 'cl'];
  private freeSpin: boolean = false;

  generateSlotResult(): string[][] {
    const result = [];
    for (let i = 0; i < 4; i++) {
      if (i < 2) {
        const arr = [];
        for (let j = 0; j < 3; j++) {
          const randomSlot =
            this.slotList1[Math.floor(Math.random() * this.slotList1.length)];
          arr.push(randomSlot);
        }
        result.push(arr);
      } else {
        const arr = [];
        for (let j = 0; j < 3; j++) {
          const randomSlot =
            this.slotList2[Math.floor(Math.random() * this.slotList2.length)];
          arr.push(randomSlot);
        }
        result.push(arr);
      }
    }
    return result;
  }

  calculateWinLines(result: string[][], lines: number, free: boolean) {
    const winLines = [];
    let winSum = 0;
    this.freeSpin = false;

    const rowsToProcess = lines === 1 ? [1] : [0, 1, 2];

    rowsToProcess.forEach((i) => {
      const row = result[i];
      const rowWinLines = [];

      if (row[0] === row[1] && row[1] === row[2] && row[2] === row[3]) {
        rowWinLines.push({
          line: 'full',
          start: 0,
          length: 4,
          payout: payments.combinationOf4[row[0]],
        });
        winSum += payments.combinationOf4[row[0]];
      } else if (row[0] === row[1] && row[1] === row[2]) {
        rowWinLines.push({
          line: 'partial',
          start: 0,
          length: 3,
          payout: payments.combinationOf3[row[0]],
        });
        winSum += payments.combinationOf3[row[0]];
      } else if (row[1] === row[2] && row[2] === row[3]) {
        rowWinLines.push({
          line: 'partial',
          start: 1,
          length: 3,
          payout: payments.combinationOf3[row[1]],
        });
        winSum += payments.combinationOf3[row[1]];
      }

      if (row[0] == row[1] && row[0] == 'mk') {
        rowWinLines.push({
          line: 'partial',
          start: 0,
          length: 2,
          payout: payments.combinationOf2[row[0]],
        });
        winSum += payments.combinationOf2[row[0]];
      } else if (!free && row[0] == 'mk') {
        rowWinLines.push({
          line: 'partial',
          start: 0,
          length: 1,
        });
        this.freeSpin = true;
      } else if (!free && row[1] == 'mk') {
        rowWinLines.push({
          line: 'partial',
          start: 1,
          length: 1,
        });
        this.freeSpin = true;
      }
      winLines[i] = rowWinLines;
    });
    return { winLines, winSum, freeSpin: this.freeSpin };
  }
}
