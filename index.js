const TEST = require('./src/TEST');

function main() {
  // code to run
  TEST();
  setInterval(() => {
  }, 1000);
}

function run() {
  setInterval(() => {}, 1 << 30);
  main();
}

run();
