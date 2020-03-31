import { spawn } from "child_process";

  export interface DHTSensorProps {
    ioPort: number;
  }

  export type DHTSensorStatus = "temp" | "humidity";

  export class DHTSensor implements DHTSensorProps {
    constructor({ ioPort }: DHTSensorProps) {
      this.ioPort = ioPort;
    }

    public ioPort: number;

    get status(): Promise<{ temp: number, humidity: number}> {
      return new Promise(resolve => {
        const process = spawn("python", [`../Python/readTemp.py ${this.ioPort}`]);
        process.stdout.on("data", (data: Buffer) => {
          const str = data.toString();
          const arr = str.split(" ");
          const [temp, humidity] = arr.map((d: any) => {
            const Str = d.replace("\n", "");
            return Str * 1;
          });

          resolve({
            temp,
            humidity
          })
        })
      })
    }
  }
