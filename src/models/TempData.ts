import * as firebase from "firebase-admin";
import fs from "fs";
import path from "path";

export interface ITempData {
  docID: string;
  collection: string;
  dateCreated: string; // Date().toDateString()
}


class TempData implements ITempData {
  public docID: string;
  public dateCreated: string;
  public collection: string;

  constructor() {

  }



  private init(collection: string) {
    firebase
      .firestore()
      .collection(collection)

  }


  private _getTodaysDoc() {
    const p = path.join(__dirname, "../data");
    const files = this._getData(p);
    if (!files) {
      fs.mkdirSync(p);
    }
    if (!!files.length) {
      const today = new Date().toDateString();
      
      
    }
  }

  private _getData(path: string) {
     return fs.readdirSync(path)
  }

  private _isDocToday(today: string, docUnix: number) {
    const docDay = new Date(docUnix).toDateString();
    return docDay === today;
  }

}

