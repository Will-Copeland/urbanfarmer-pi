/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import * as firebase from "firebase-admin";
import schedule from "node-schedule";
import { TempData } from "./models/TempData";
import genericNotification from "./notifications/genericNotification";

export type DataType = "tempData"; // Add data types as the get used. Next will be "soilMoisture"

export interface RecordKeeperProperties {
  docID: string;
  collection: string;
  recordDate: string; // Date().toDateString();
  createdAt: number; // unix
  updatedAt: any; // firestore.FieldValue.serverTimestamp()
  relayPowered: boolean;
}

class RecordKeeper implements RecordKeeperProperties {

  public static async init(collection: string) {
    const Class = new RecordKeeper();
    await Class._getDoc(collection);
    Class.initSchedule(collection);
    Class.relayPowered = false;
    return Class;
    }
    
  public docID!: string;
  public collection!: string;
  public recordDate!: string;
  public createdAt!: number;
  public tempData!: TempData[];
  public updatedAt: any;
  public relayPowered!: boolean;

  public addData(data: TempData) {
    console.log("adding");
    
    return firebase.firestore()
    .collection(this.collection)
    .doc(this.docID)
    .update({
      tempData: firebase.firestore.FieldValue.arrayUnion(data),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }).catch(e => {
      console.error("Error saving data to doc ", this.docID);
    })
    .then(() => {
      console.log("Successfully updated");
      
    })
    
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
      relayPowered: 0,
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
    this.createdAt = existingDoc.createdAt;
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
