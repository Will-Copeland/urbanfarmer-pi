const admin = require('firebase-admin');
// eslint-disable-next-line import/no-unresolved
const serviceAccount = require('../../urbanfarmer-c46e0-firebase-adminsdk-jun7f-432811d285.json');

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://urbanfarmer-c46e0.firebaseio.com',
});
