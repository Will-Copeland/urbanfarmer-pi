import admin from "firebase-admin";
import serviceAccount from "../ADMIN_API_KEY.json";
import { TempData } from "./models/TempData";
import readTemp from "./readTemp";
import schedule from "node-schedule";
import RecordKeeper from "./RecordKeeper";

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
  let record: RecordKeeper;
  record = await RecordKeeper.init("test");
  main(record);

  const onNewDay = new schedule.RecurrenceRule();
  onNewDay.hour = 0;
  onNewDay.minute = 0;
  schedule.scheduleJob(onNewDay, async () => {
    if (record.unsub) {
      record.unsub();
    }
    record = await RecordKeeper.init("test")
    main(record);
  });
}

run();
