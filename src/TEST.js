
const { spawn } = require('child_process');

module.exports = (cb) => {
  console.log('Starting child process...');

  const process = spawn('python', ['../Python/grove_dht_pro.py']);
  console.log('started!');

  process.stdout.on('data', (data) => {
    console.log("data: ", data);
    
    console.log('Data: ', data.toString());
    const str = data.toString();
    const [temp, humidity] = str.split(',');
    console.log('t, h in TEST: ', temp, humidity);
    cb(temp, humidity);
  });
};
