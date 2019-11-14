/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import * as firebase from "firebase-admin";
import schedule from "node-schedule";
import { ITempData } from "./models/TempData";

export type DataType = "tempData"; // Add data types as the get used. Next will be "soilMoisture"

export interface IRecordKeeperProperties {
  docID: string;
  collection: string;
  recordDate: string; // Date().toDateString();
  createdAt: number; // unix
  updatedAt: any; // firestore.FieldValue.serverTimestamp()
  tempData: ITempData[];

}

class RecordKeeper implements IRecordKeeperProperties {

  public static async init(collection: string) {
    const Class = new RecordKeeper();
    await Class._getDoc(collection);
    Class.initSchedule(collection);
    Class.saveScheduler();

    Class.tempData = [];
    return Class;
    }
  public docID!: string;
  public collection!: string;
  public recordDate!: string;
  public createdAt!: number;
  public tempData!: ITempData[];
  public updatedAt: any;

  public addData(dataType: DataType, data: any) {
    console.log("data: ", data);

    this[dataType].push(data);
  }

  public async save() {
    const props: any = this._getProperties();
    const noUndefined: any = {};
    Object.keys(props).forEach((key: any) => {
      if (!!props[key]) {
        noUndefined[key] = props[key];
      }
    });
    console.log("saving, ", props);

    await firebase.firestore()
    .collection(this.collection)
    .doc(this.docID)
    .update({
      ...noUndefined,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public _isToday(date: Date) {
    const today = new Date();
    return date.getDate() === today.getDate()
      && date.getMonth() === today.getMonth()
      && date.getFullYear() === today.getFullYear();
  }

  private async _getDoc(collection: string) {
    await firebase
      .firestore()
      .collection(collection)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()
      .then((resp) => {
        if (resp.empty) {
          return this._newDoc(collection);
        }
        resp.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          const unix = data.createdAt;
          if (this._isDocToday(unix)) {
            return this._setProperties(data, collection);
          } else {
            return this._newDoc(collection);
          }
        });
      });
  }

  private saveScheduler() {
    const everyFiveMinutes = new schedule.RecurrenceRule();
    everyFiveMinutes.minute = new schedule.Range(0, 59, 1);
    schedule.scheduleJob(everyFiveMinutes, () => {
      this.save();
    });
  }

   private async _newDoc(collection: string) {
    const data = {
      collection,
      createdAt: new Date().getTime(),
      recordDate: new Date().toDateString(),
      tempData: [],
    };

    await firebase.firestore()
    .collection(collection)
    .add(data)
    .then((doc) => {
        this.docID = doc.id;
        this._setProperties(data, collection);

    });
  }

  private _setProperties(props: any, collection: string) {
    Object.keys(props).map((key) => {
      (this as any)[key] = props[key];
    });
    this.collection = collection;
    this.docID = props.id;
    // this.recordDate = props.recordDate;

  }

  private _todaysDate(): string {
    return new Date().toDateString();
  }

  private _isDocToday(docUnix: number) {
    const docDay = new Date(docUnix).toDateString();
    return docDay === this._todaysDate();
  }

  private _getProperties() {
    return {
      tempData: this.tempData,
    };
  }

  private initSchedule(collection: string) {
    const onNewDay = new schedule.RecurrenceRule();
    onNewDay.hour = 0;
    onNewDay.minute = 0;
    schedule.scheduleJob(onNewDay, () => {
      this._newDoc(collection);
    });
  }
}

export default RecordKeeper;
