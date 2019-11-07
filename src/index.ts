import admin from "firebase-admin";
import { ITempData } from "./models/TempData";
const readTemp = require("./readTemp");
import RecordKeeper from "./RecordKeeper";
// eslint-disable-next-line import/no-unresolved
const serviceAccount = require("../urbanfarmer-c46e0-firebase-adminsdk-jun7f-432811d285.json");

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://urbanfarmer-c46e0.firebaseio.com",
});

function main(Record: RecordKeeper) {
  readTemp((temp: number, humidity: number) => {
   const data: ITempData = {
    humidity,
     temp,
     timeOfMeasurement: new Date().getTime(),
   };
   Record.addData("tempData", data); // pushes "data" to tempData Array
  });
}

function run() {
  setInterval(() => {}, 1 << 30);
  const Record = new RecordKeeper("test");

  main(Record);
}

run();
