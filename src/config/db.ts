import Dexie, { Table } from "dexie";
const DB_NAME = "fcmDB";

export interface FCMTokens {
  id?: number;
  token: string;
}

export class MySubClassedDexie extends Dexie {
  fcmTokens!: Table<FCMTokens>;

  constructor() {
    super(DB_NAME);
    this.version(1).stores({
      fcmTokens: "++id, token", // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
