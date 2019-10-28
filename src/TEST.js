import * as firebase from 'firebase-admin';

const { spawn } = require('child_process');

module.exports = () => {
    const tempArr = [];
  console.log('Starting child process...');

  const process = spawn('python', ['./Python/grove_dht_pro.py']);
  console.log('started!');

  process.stdout.on('data', (data) => {
    console.log('Node Log with data from python: ', data.toString());
    
  });
};
