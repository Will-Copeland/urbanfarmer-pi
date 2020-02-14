// import { execFile } from "child_process"

// const { execFile } = require("child_process");

// export default (pin: number, state: 0 | 1) => {
//   return new Promise((resolve, reject) => {
//     execFile("../Python/toggleRelay.py", [pin, state], (err: any, stdout: any, stderr: any) => {
//       console.log("stdout: ", stdout, " ", typeof stdout);
//       console.log("err: ", err, " ", typeof err);
//       console.log("stderr: ", stderr, " ", typeof stderr);
      
//       resolve();
//     })
//   })

// }


// const { exec } = require("child_process");

// export default (pin: number, state: 0 | 1) => {
//   return new Promise((resolve, reject) => {
//     exec(`python toggleRelay.py ${pin} ${state}`, { cwd: "../Python/"}, (err: object, stdout: string, stderr: string) => {
//       console.log("stdout: ", stdout, " ", typeof stdout);
//       console.log("err: ", err, " ", typeof err);
//       console.log("stderr: ", stderr, " ", typeof stderr);
      
//       resolve();
//     })
//   })

// }


const { spawn } = require("child_process");

export default (pin: number, state: 0 | 1) => {
  return new Promise((resolve, reject) => {
    console.log("running toggle");
      
      const process = spawn("python", [`../Python/${state === 0 ? "relayOff" : "relayOn"}.py`]);


      process.stdout.on("data", (data: string) => {
      console.log("stdout: ", data);
     
       
       resolve();
     });

     process.stderr.on("data", (data: string) => {
       console.log("err ", data);
       reject()
     })
    
     resolve();
  })

}


// const { execFile } = require("child_process");

// export default (pin: number, state: 0 | 1) => {

//   })

// }