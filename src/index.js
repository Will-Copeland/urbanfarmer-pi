import * as firebase from 'firebase-admin';

const admin = require('firebase-admin');
const TEST = require('./TEST');
// eslint-disable-next-line import/no-unresolved
const serviceAccount = require('../../urbanfarmer-c46e0-firebase-adminsdk-jun7f-432811d285.json');

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://urbanfarmer-c46e0.firebaseio.com',
});

function main() {
  let data = {};
  TEST((temp, humidity) => {
    const time = new Date().getTime();
    data[time] = { temp, humidity };
  });


  setInterval(() => {
    console.log('Sending update...');
    const timeArr = Object.keys(data);
    firebase.firestore()
      .collection('test')
      .add({
        uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
        first: timeArr[0],
        last: timeArr[timeArr.length - 1],
        nRecords: timeArr.length,
        data,
      }).then((docId) => {
        data = {};
        console.log('UPDATED');
      })
      .catch((e) => {
        console.log('ERROR UPDATING FS: ', e);
      });
  }, 300000);
}

function run() {
  setInterval(() => {}, 1 << 30);
  main();
}

run();
