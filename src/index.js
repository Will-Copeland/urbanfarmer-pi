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
  // let tempArr = [];
  // let humArr = [];
  TEST();

  
  // setInterval(() => {
  //   console.log("Sending update...");
    
  //   // firebase.firestore()
  //   //   .collection('test')
  //   //   .add({
  //   //     uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
  //   //     temp: tempArr,
  //   //     humidity: humArr,
  //   //   }).then((docId) => {
  //   //     tempArr = [];
  //   //     humArr = [];
  //   //   })
  //   //   .catch((e) => {
  //   //     console.log('ERROR UPDATING FS: ', e);
  //   //   });
  // }, 5000);
}

function run() {
  setInterval(() => {}, 1 << 30);
  main();
}

run();
