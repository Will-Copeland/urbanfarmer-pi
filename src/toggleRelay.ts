
const { spawn } = require("child_process");

export default (pin: number, state: 0 | 1) => {
  return new Promise((resolve, reject) => {
    const process = spawn("python", [pin, state], {cwd: "../Python/toggleRelay.py"});
     process.stdout.on("data", (data: string) => {
    console.log("stdout: ", data);
    
      
      resolve();
    });
    process.stderr.on("data", (data: string) => {
      console.log("err ", data);
      reject()
    })
  })

}