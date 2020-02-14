import admin from "firebase-admin";
import serviceAccount from "../ADMIN_API_KEY.json";
import { TempData } from "./models/TempData";
import genericNotification from "./notifications/genericNotification";
import readTemp from "./readTemp";
import RecordKeeper from "./RecordKeeper";
import toggleRelay from "./toggleRelay";

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://urbanfarmer-c46e0.firebaseio.com",
});

function main(record: RecordKeeper) {
  readTemp((tempData) => {
    const data: TempData = {
      ...tempData,
      timeOfMeasurement: new Date().getTime(),
    };
    record.onData(data);
  })

}

async function run() {
  setInterval(() => { }, 1 << 50);
  await genericNotification("Initializing RecordKeeper", ":globe_with_meridians:");
  const record = await RecordKeeper.init("test");
  // toggleRelay(0);
  main(record);
}

run();
