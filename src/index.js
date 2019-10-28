import * as firebase from 'firebase-admin';

const TEST = require('./TEST');
const initializeFirebase = require('./initializeFirebase');


function main() {
  let tempArr = [];
  let humArr = [];
  TEST((temp, humidity) => {
    const time = new Date().getTime();
    tempArr.push({
      temp,
      time,
    });
    humArr.push({
      humidity,
      time,
    });
  });
  setInterval(() => {
    firebase.firestore()
      .collection('test')
      .add({
        uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
        temp: tempArr,
        humidity: humArr,
      }).then((docId) => {
        tempArr = [];
        humArr = [];
      })
      .catch((e) => {
        console.log('ERROR UPDATING FS: ', e);
      });
  }, 5000);
}

function run() {
  setInterval(() => {}, 1 << 30);
  initializeFirebase();
  main();
}

run();
