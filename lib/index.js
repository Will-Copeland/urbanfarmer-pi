"use strict";

var TEST = require('./TEST');

var initializeFirebase = require('./initializeFirebase'); // It exists on the pi


function main() {
  // code to run
  TEST();
  setInterval(function () {}, 1000);
}

function run() {
  setInterval(function () {}, 1 << 30);
  initializeFirebase();
  main();
}

run();