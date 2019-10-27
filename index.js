function main() {
  // code to run
  setInterval(() => {
    console.log('Polling sensors...');
  }, 1000);
}

function run() {
  setInterval(() => {}, 1 << 30);
  main();
}

run();
