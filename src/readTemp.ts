const { spawn } = require("child_process");

module.exports = (cb: (temp: number, humidity: number) => void) => {
  console.log("Starting temp logging!");

  const process = spawn("python", ["../Python/grove_dht_pro.py"]);
  process.stdout.on("data", (data: Buffer) => {
    const str = data.toString();
    const arr = str.split(" ");
    const [temp, humidity] = arr.map((data: any) => {
      const Str = data.replace("\n", "");
      return Str * 1;
    });
    cb(temp, humidity);
  });
};
