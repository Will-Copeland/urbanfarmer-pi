const TEST = require('./src/TEST');

function main() {
  // code to run
  setInterval(() => {
    TEST();
  }, 1000);
}

function run() {
  setInterval(() => {}, 1 << 30);
  main();
}

run();
