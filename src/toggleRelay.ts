// import { execFile } from "child_process"
const { execFile } = require("child_process");

export default (pin: number, state: 0 | 1) => {
  return new Promise((resolve, reject) => {
    execFile(`python toggleRelay.py ${pin} ${state}`, { cwd: "/home/pi/urbanfarmer-pi/Python/" }, (err: any, stdout: any, stderr: any) => {
      console.log("stdout: ", stdout, " ", typeof stdout);
      console.log("err: ", err, " ", typeof err);
      console.log("stderr: ", stderr, " ", typeof stderr);
      
      resolve();
    })
  })

}