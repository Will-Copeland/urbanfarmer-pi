/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import * as firebase from "firebase-admin";
import fs from "fs";
import path from "path";

export interface RecordKeeper {
  docID: string;
  collection:
}

class RecordKeeper {
  constructor() {
    this.docID = ""; // The document we're storing our records in for the day
    this.collection = ""; // And the collection
  }

  public save() {

  }

  public async _setCurrentDoc() {
    const isToday = await firebase
      .firestore()
      .collection(this.collection)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()
      .then((resp) => {
        resp.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          const docDay = new Date(data.createdAt); // createdAt === unix
          if (this._isToday(docDay)) {
            return data;
          }
          return false;
        });
      });

    if (isToday) {
      this.docID = isToday.id;
    }
  }

  public _isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate()
      && date.getMonth() === today.getMonth()
      && date.getFullYear() === today.getFullYear();
  }

  public _init() {
    fs.readdirSync(path.join(__dirname, "../data"));

  }
}
firebase.firestore()
  .collection("test")
  .add({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
    first: timeArr[0],
    last: timeArr[timeArr.length - 1],
    nRecords: timeArr.length,
    records: data,
  }).then((docId) => {
    // data = {};
    console.log("UPDATED");
  })
  .catch((e) => {
    console.log("ERROR UPDATING FS: ", e);
  });
