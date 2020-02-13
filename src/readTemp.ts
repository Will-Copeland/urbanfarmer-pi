const { spawn } = require("child_process");

export default (): Promise<{temp: number, humidity: number}> => {
  console.log("Starting temp logging!");

  return new Promise(resolve => {
    const process = spawn("python", ["../Python/readTemp.py"]);
    process.stdout.on("data", (data: Buffer) => {
      const str = data.toString();
      const arr = str.split(" ");
      const [temp, humidity] = arr.map((d: any) => {
        const Str = d.replace("\n", "");
        return Str * 1;
      });
      console.log("New reading: ", temp, humidity);
      
      resolve({temp, humidity});
    });
  })

};
