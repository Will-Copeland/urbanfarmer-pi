import admin from "firebase-admin";
import serviceAccount from "../ADMIN_API_KEY.json";
import { ITempData } from "./models/TempData";
import genericNotification from "./notifications/genericNotification";
import readTemp from "./readTemp";
import RecordKeeper from "./RecordKeeper";

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://urbanfarmer-c46e0.firebaseio.com",
});

function main(record: RecordKeeper) {
  readTemp().then(tempData => {
    const data: ITempData = {
      ...tempData,
      timeOfMeasurement: new Date().getTime(),
    };
    record.addData("tempData", data);
  })
}

async function run() {
  while (true) {
    await genericNotification("Initializing RecordKeeper", ":globe_with_meridians:");
    const record = await RecordKeeper.init("tempData");
    main(record);
  }
}

run();
