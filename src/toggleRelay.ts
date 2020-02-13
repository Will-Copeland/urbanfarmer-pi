
const { exec } = require("child_process");

export default (pin: number, state: 0 | 1) => {
  return new Promise((resolve, reject) => {
    exec(`python toggleRelay.py ${pin} ${state}`, [pin, state], (err: any, stdout: any, stderr: any) => {
      console.log("stdout: ", stdout, " ", typeof stdout);
      console.log("err: ", err, " ", typeof err);
      console.log("stderr: ", stderr, " ", typeof stderr);
      
      resolve();
    })
  })

}