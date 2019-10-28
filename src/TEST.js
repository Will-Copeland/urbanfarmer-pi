const { spawn } = require('child_process');

module.exports = () => {
  const process = spawn('python', ['./Python/TEST.py']);

  process.stdout.on('data', (data) => {
    console.log('Node Log with data from python: ', data.toString());
  });
};
