// const { spawn } = require("child_process");
import { spawn } from "child_process";

export default (state: 0 | 1) => spawn("python", [`../Python/${state === 0 ? "relayOff" : "relayOn"}.py`]);

