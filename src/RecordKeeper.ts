/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import * as firebase from "firebase-admin";
import schedule from "node-schedule";
import { ITempData } from "./models/TempData";
import genericNotification from "./notifications/genericNotification";

export type DataType = "tempData"; // Add data types as the get used. Next will be "soilMoisture"

export interface RecordKeeperProperties {
  docID: string;
  collection: string;
  recordDate: string; // Date().toDateString();
  createdAt: number; // unix
  updatedAt: any; // firestore.FieldValue.serverTimestamp()
  tempData: ITempData[];

}

class RecordKeeper implements RecordKeeperProperties {

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
    console.log("adding data to local recordkeeper: ", data);
    
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
    console.log("Saving data... data: ", noUndefined);
    await firebase.firestore()
    .collection(this.collection)
    .doc(this.docID)
    .update({
      ...noUndefined,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }).catch(e => {
      console.error("Error saving data to doc ", this.docID);
      
    })
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
          const existingDoc = doc.data();
          existingDoc.docID = doc.id;
          const unix = existingDoc.createdAt;
          if (this._isDocToday(unix)) {
            console.log("Doc is today, setting props");

            return this._setProperties(existingDoc as RecordKeeperProperties, collection);
          } else {
            console.log("Doc is not today. Creating new doc");

            return this._newDoc(collection);
          }
        });
      });
  }

   private async _newDoc(collection: string) {
     const date = new Date();
     const data: any = {
      collection,
      createdAt: date.getTime(),
      recordDate: date.toDateString(),
      tempData: [],
    };
     await firebase.firestore()
    .collection(collection)
    .add(data)
    .then(async (doc) => {
      data.docID = doc.id;
      await genericNotification("New doc created!", ":new:")
      this._setProperties(data, collection);
    })
    .catch((e) => {
      console.log("Doc creation failed ", e);
      return genericNotification("Doc creation failed!", ":rotating_light:");
    });
  }

  private _setProperties(existingDoc: RecordKeeperProperties, collection: string) {
    this.collection = collection;
    this.docID = existingDoc.docID;
    this.tempData = existingDoc.tempData;
    this.createdAt = existingDoc.createdAt;
    // this.recordDate = data.recordDate;

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

  private saveScheduler() {
    console.log("init save scheduler");
    
    const everyTenMinutes = new schedule.RecurrenceRule();
    everyTenMinutes.minute = new schedule.Range(0, 59, 10);
    schedule.scheduleJob(everyTenMinutes, () => {      
      console.log("running save cron job...");
      
      this.save();
    });
  }
}

export default RecordKeeper;
