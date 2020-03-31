import { spawn } from "child_process";
import toggleRelay from "../toggleRelay";

export interface RelayProps {
  ioPort: number;
}

type StatePromise = 0 | 1 | Promise<0 | 1>

export class Relay implements RelayProps {
  constructor({ ioPort }: RelayProps) {
    this.ioPort = ioPort;
  }
  public ioPort: number;

  get state(): StatePromise {
    return new Promise(resolve => {
      spawn("python", [`../Python/readRelay.py ${this.ioPort}`]);
      process.stdout.on("data", data => {
      const output = data.toString();
      resolve(output);
    });
    })
  }

  set state(newState: StatePromise) {
    toggleRelay(newState as 0 | 1);
  }
}

