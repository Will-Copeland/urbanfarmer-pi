/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import * as firebase from "firebase-admin";
import { TempData } from "./models/TempData";
import genericNotification from "./notifications/genericNotification";
import toggleRelay from "./toggleRelay";

export type DataType = "tempData"; // Add data types as the get used. Next will be "soilMoisture"

export interface RelayEvent {
  time: number; // unix
  event: "relayOn" | "relayOff";
  mostRecentData: {
    tempData: TempData;
  }
}

export interface RecordKeeperProperties {
  docID: string;
  collection: string;
  recordDate: string; // Date().toDateString();
  createdAt: number; // unix
  updatedAt: any; // firestore.FieldValue.serverTimestamp()
  relayPowered: boolean;
  humLowThreshold: number;
  humHighThreshold: number;
  unsub?: () => void;
}

class RecordKeeper implements RecordKeeperProperties {

  public static async init(collection: string) {
    const Class = new RecordKeeper();
    await Class._getDoc(collection);
    Class.relayPowered = false;
    toggleRelay(0);
    Class.unsub = Class.subscribeToDoc(collection, Class.docID);
    await Class.save();
    return Class;
  }

  public docID!: string;
  public collection!: string;
  public recordDate!: string;
  public createdAt!: number;
  public tempData!: TempData[];
  public updatedAt: any;
  public relayPowered!: boolean;
  public humHighThreshold!: number;
  public humLowThreshold!: number;
  public unsub: (() => void) | undefined;

  public async onData(data: TempData) {
    if (data.humidity > this.humHighThreshold && !this.relayPowered) {
      console.log("Hum over 55 and relay OFF! Turning on");
      this.relayPowered = true;
      toggleRelay(1)
    } else if (data.humidity > this.humHighThreshold && this.relayPowered) {
      console.log("Hum over 55 and relay ON. doing nothing");
    } else if (data.humidity < this.humLowThreshold && this.relayPowered) {
      console.log("Hum under 53 and relay ON, turning off");
      this.relayPowered = false;
      toggleRelay(0)
    } else if (data.humidity < this.humLowThreshold && !this.relayPowered) {
      console.log("hum under 53 and relay off, doing nothing");
    }

    this.addData(data);
  }

  public async addData(data: TempData) {
    console.log("adding to: ", this.docID, " ", this.collection);

    if (!this.docID || !this.collection) {
      console.error("No docID or no collection set! Aborting");
    }
    try {
      await firebase.firestore()
        .collection(this.collection)
        .doc(this.docID)
        .update({
          tempData: firebase.firestore.FieldValue.arrayUnion(data),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          humHighThreshold: this.humHighThreshold,
          humLowThreshold: this.humLowThreshold,
          relayPowered: this.relayPowered,
        })
    } catch (error) {
      console.error("Error saving data to doc ", this.docID);
      console.error("Err: ", error);
    }
  }

  public subscribeToDoc(collection: string, docId: string) {
    if (this.unsub) {
      this.unsub();
    }
    return firebase.firestore()
      .collection(collection)
      .doc(this.docID)
      .onSnapshot(async doc => {
        console.log("onSnapshot running: ", doc.data());
        const data = doc.data() as RecordKeeperProperties;
        if (!doc.exists || !data) {
          return this._newDoc(this.collection)
        }

        data.docID = doc.id;
        this._setProperties(data as RecordKeeperProperties, this.collection)

        if (this.relayPowered !== data.relayPowered) {
          toggleRelay(data.relayPowered ? 1 : 0);
          this.relayPowered = data.relayPowered
        }
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
      relayPowered: false,
    };

    await firebase.firestore()
      .collection(collection)
      .add(data)
      .then((doc) => {
        data.docID = doc.id;
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
    this.humHighThreshold = existingDoc.humHighThreshold || 54;
    this.humLowThreshold = existingDoc.humLowThreshold || 44;
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
      humHighThreshold: this.humHighThreshold,
      humLowThreshold: this.humLowThreshold,
    };
  }
}

export default RecordKeeper;
