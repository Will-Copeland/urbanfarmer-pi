import { spawn } from "child_process";

export default (state: 0 | 1) => {
  console.log(`../Python/${state === 0 ? "relayOff" : "relayOn"}.py`);
  const process = spawn("python", [`../Python/${state === 0 ? "relayOff" : "relayOn"}.py`]);
  process.stdout.on("data", data => {
    const output = data.toString();
    console.log("relay set to: ", output);
  });
}
