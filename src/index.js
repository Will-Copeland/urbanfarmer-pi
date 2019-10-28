const TEST = require('./TEST');
const initializeFirebase = require('./initializeFirebase');


// It exists on the pi

function main() {
  // code to run
  TEST();
  setInterval(() => {
  }, 1000);
}

function run() {
  setInterval(() => {}, 1 << 30);
  initializeFirebase();
  main();
}

run();
