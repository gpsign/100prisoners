process = require("process");

class Prisoner {
  number: number;
  target: number;
  tries: number = 0;
  constructor(num: number) {
    this.number = num;
    this.target = num;
  }
}

class Prison {
  prisoners: Prisoner[] = [];
  boxes: number[] = [];
  replays: number;
  log: boolean[] = [];
  numberOfPrisoners: number;

  constructor(numberOfPrisoners: number, replays: number) {
    this.numberOfPrisoners = numberOfPrisoners;
    this.replays = replays;
    this.init();
  }

  reset() {
    for (let i = 0; i < this.numberOfPrisoners; i++) {
      delete this.prisoners[i];
      delete this.boxes[i];
    }
    this.prisoners = [];
    this.boxes = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.numberOfPrisoners; i++) {
      this.prisoners.push(new Prisoner(i));
      this.boxes.push(i);
    }
    this.shuffle();
  }

  shuffle() {
    this.boxes = this.boxes.sort(() => Math.random() - 0.5);
  }

  lookAtBox(prisoner: Prisoner): boolean {
    if (!prisoner) return false;

    let result = false;

    while (prisoner.tries < this.numberOfPrisoners / 2) {
      if (this.boxes[prisoner.target] === prisoner.number) {
        result = true;
        break;
      }
      prisoner.tries++;
      prisoner.target = this.boxes[prisoner.target];
    }

    return result;
  }

  round(): boolean {
    for (const prisoner of this.prisoners) {
      const result = this.lookAtBox(prisoner);
      if (!result) return false;
    }
    return true;
  }

  play(): number {
    for (let i = 0; i < this.replays; i++) {
      const result = this.round();
      this.log.push(result);
      this.reset();
    }

    let wins = 0;
    for (const replay of this.log) {
      if (replay) wins++;
    }

    return wins / this.replays;
  }
}

const numberOfPrisoners = process.argv[2] ?? 100;
const replays = process.argv[3] ?? 1000;

const prison = new Prison(parseInt(numberOfPrisoners), parseInt(replays));
prison.play();
const wins = prison.log.reduce((a, b) => a + (b ? 1 : 0), 0);
const fails = prison.replays - wins;
const succesRate = (wins / prison.replays) * 100;

const R = "\u001b[1;31m";
const RB = "\u001b[1;41m";
const G = "\u001b[1;32m";
const GB = "\u001b[1;42m";
const B = "\u001b[1;34m";
const BB = "\u001b[1;44m";
const _ = "\u001b[0m";

console.log("\n");
console.log(`Number of Prisoners: ${numberOfPrisoners}`);
console.log(`Replays: ${prison.replays}`);
console.log("\n");
console.log(`${B}Wins:${_} ${BB} ${wins} ${_}`);
console.log(`${R}Fails:${_} ${RB} ${fails} ${_}`);
console.log(`${G}Succes rate:${_} ${GB} ${succesRate.toFixed(2)}% ${_}`);
console.log("\n");
