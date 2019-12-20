const { spawn } = require("child_process");

export default (cb: (temp: number, humidity: number) => void) => {
  console.log("Starting temp logging!");

  const process = spawn("python", ["../Python/readTemp.py"]);
  process.stdout.on("data", (data: Buffer) => {
    const str = data.toString();
    const arr = str.split(" ");
    const [temp, humidity] = arr.map((d: any) => {
      const Str = d.replace("\n", "");
      return Str * 1;
    });
    cb(temp, humidity);
  });
};
