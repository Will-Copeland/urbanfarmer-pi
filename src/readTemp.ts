import { TempData } from "./models/TempData";
import { spawn } from "child_process";
// const { spawn } = require("child_process");

export default (callback: (data: { temp: number, humidity: number }) => void) => {
  console.log("Starting temp logging!");

  const process = spawn("python", ["../Python/readTemp.py"]);
  console.log(process);
  
  process.stdout.on("data", (data: Buffer) => {
    const str = data.toString();
    const arr = str.split(" ");
    const [temp, humidity] = arr.map((d: any) => {
      const Str = d.replace("\n", "");
      return Str * 1;
    });
    console.log("New reading: ", temp, humidity);

    callback({ temp, humidity });
  });

};
