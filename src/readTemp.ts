
const { spawn } = require("child_process");

module.exports = (cb: (temp: string, humidity: string) => void) => {
  console.log("Starting child process...");

  const process = spawn("python", ["../Python/grove_dht_pro.py"]);
  console.log("started!");

  process.stdout.on("data", (data: Buffer) => {
    console.log("Data: ", data.toString());
    const str = data.toString();
    const arr = str.split(" ");
    console.log(arr);
    const [temp, humidity] = arr.map((data: any) => {
      const Str = data.replace("\n", "");

      return Str;
    });
    cb(temp, humidity);
  });
};
