// Level 1
// Memory has a db: map key -> map str -> str
// ---- Level 2: no changes to the design
// ---- Level 3
// new RichValue class needed to keep metadata: an optional ttl, and timestamp
// ---- Level 4
// we neeed ValBackup class: value, ttlLeft?
// backups are stored using a class Backup: timestamp and data: Map<string, Map<string, BackupVal>>

class Val {
  public value: string;
  public timestamp: number;
  public expiration?: number;

  constructor(value: string, timestamp: number, ttl?: number) {
    this.value = value;
    this.timestamp = timestamp;
    if (ttl !== undefined) {
      this.expiration = timestamp + ttl;
    }
  }

  public isValidAt(timestamp: string): boolean {
    const isAfterCreation = parseInt(timestamp) >= this.timestamp;
    const doesntExpire = this.expiration === undefined;
    const epxiresInFutre = this.expiration !== undefined && this.expiration > parseInt(timestamp);
    return (isAfterCreation && (doesntExpire || epxiresInFutre));
  }
}

class ValBackup {
  public value: string;
  public ttlLeft?: number;

  constructor(value: string, ttlLeft?: number) {
    this.value = value;
    this.ttlLeft = ttlLeft;
  }
}

type Backup = {
  timestamp: number;
  data: Map<string, Map<string, ValBackup>>;
}

class Memory {
  public db: Map<string, Map<string, string>> = new Map();
  public db2: Map<string, Map<string, Val>> = new Map();
  public backups: Backup[] = [];

  constructor() {}

  public set(key: string, field: string, value: string): "" {
    const record = this.db.get(key) || new Map();
    record.set(field, value);
    this.db.set(key, record);
    return "";
  }

  public get(key: string, field: string): string {
    return this.db.get(key)?.get(field) || "";
  }

  public delete(key: string, field: string): "true" | "false" {
    const record = this.db.get(key);
    if (!record || !record.has(field)) {
      return "false";
    }
    record.delete(field);
    return "true";
  }

  public scanByPrefix(key: string, prefix: string): string {
    const record = this.db.get(key) || new Map<string, string>();
    return Array.from(record.entries())
      .filter(entry => entry[0].startsWith(prefix))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(entry => `${entry[0]}(${entry[1]})`)
      .join(", ");
  }

  public scan(key: string): string {
    return this.scanByPrefix(key, "");
  }

  // -----

  public setAtWithTtl(key: string, field: string, value: string, timestamp: string, ttl?: string): "" {
    const ttlToPass = (ttl === undefined) ? undefined : parseInt(ttl);
    const val = new Val(value, parseInt(timestamp), ttlToPass);
    const record = this.db2.get(key) || new Map<string, Val>();
    record.set(field, val);
    this.db2.set(key, record);
    return "";
  }

  public setAt(key: string, field: string, value: string, timestamp: string): "" {
    return this.setAtWithTtl(key, field, value, timestamp);
  }

  public getAt(key: string, field: string, timestamp: string): string {
    const val = this.db2.get(key)?.get(field);
    if (!val || !val.isValidAt(timestamp)) {
      return "";
    }
    return val.value;
  }

  public deleteAt(key: string, field: string, timestamp: string): "true" | "false" {
    const record = this.db2.get(key);
    if (!record) {
      return "false";
    }
    const val = record.get(field);
    if (!val) {
      return "false";
    }
    record.delete(field);
    if (val.isValidAt(timestamp)) {
      return "true";
    }
    return "false";
  }

  public scanByPrefixAt(key: string, prefix: string, timestamp: string): string {
    const record = this.db2.get(key) || new Map<string, Val>();
    return Array.from(record.entries())
      .filter(entry => entry[0].startsWith(prefix) && entry[1].isValidAt(timestamp))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(entry => `${entry[0]}(${entry[1].value})`)
      .join(", ");
  }

  public scanAt(key: string, timestamp: string): string {
    return this.scanByPrefixAt(key, "", timestamp);
  }

  public backup(timestamp: string): string {
    const backup = new Map();
    let count = 0;
    for (let [key, record] of this.db2.entries()) {
      const keyBackup = new Map<string, ValBackup>()
      let thiscount = 0;
      for (let [field, val] of record.entries()) {
        if (val.isValidAt(timestamp)) {
          const ttlLeft = val.expiration === undefined ? undefined : val.expiration - parseInt(timestamp);
          keyBackup.set(field, new ValBackup(val.value, ttlLeft));
          thiscount = 1;
        }
      }
      count += thiscount;
      backup.set(key, keyBackup);
    }
    this.backups.push({
      timestamp: parseInt(timestamp),
      data: backup
    })
    return count.toString();
  }

  public restore(timestamp: string, timestampToRestore: string) {
    let targetBackup = this.backups[0];
    for (let backup of this.backups) {
      if (backup.timestamp > parseInt(timestampToRestore)) {
        break;
      } else {
        targetBackup = backup;
      }
    }

    this.db2 = new Map();
    for (let [key, record] of targetBackup.data.entries()) {
      const newRecord = new Map<string, Val>();
      for (let [field, valBackup] of record.entries()) {
        const newVal = new Val(valBackup.value, parseInt(timestamp), valBackup.ttlLeft);
        newRecord.set(field, newVal);
      }
      this.db2.set(key, newRecord);
    }

    return "";
  }
}

function test(id: number, value: any, expected: any) {
  if (JSON.stringify(value) === JSON.stringify(expected)) {
    console.log(`Test ${id} passed`);
  }
  else {
    console.log(`Test ${id} failed! expected "${expected}" got "${value}"`);
  }
}

const m = new Memory();

console.log("Level 1 Tests:");
test(1, m.set("A", "B", "E"), "");
test(2, m.set("A", "C", "F"), "");
test(3, m.get("A", "B"), "E");
test(4, m.get("A", "D"), "");
test(5, m.delete("A", "B"), "true");
test(6, m.delete("A", "D"), "false");

console.log("\nLevel 2 Tests:");
const m2 = new Memory();
test(7, m2.set("A", "BC", "E"), "");
test(8, m2.set("A", "BD", "F"), "");
test(9, m2.set("A", "C", "G"), "");
test(10, m2.scanByPrefix("A", "B"), "BC(E), BD(F)");
test(11, m2.scan("A"), "BC(E), BD(F), C(G)");
test(12, m2.scanByPrefix("B", "B"), "");


console.log("\nLevel 3 Tests:");
const m3 = new Memory();
test(13, m3.setAtWithTtl("A", "BC", "E", "1", "9"), "");
test(14, m3.setAtWithTtl("A", "BC", "E", "5", "10"), "");
test(15, m3.setAt("A", "BD", "F", "5"), "");
test(16, m3.scanByPrefixAt("A", "B", "14"), "BC(E), BD(F)");
test(17, m3.scanByPrefixAt("A", "B", "15"), "BD(F)");

const m4 = new Memory();
test(18, m4.setAt("A", "B", "C", "1"), "");
test(19, m4.setAtWithTtl("X", "Y", "Z", "2", "15"), "");
test(20, m4.getAt("X", "Y", "3"), "Z");
test(21, m4.setAtWithTtl("A", "D", "E", "4", "10"), "");
test(22, m4.scanAt("A", "13"), "B(C), D(E)");
test(23, m4.scanAt("X", "16"), "Y(Z)");
test(24, m4.scanAt("X", "17"), "");
test(25, m4.deleteAt("X", "Y", "20"), "false");


console.log("\nLevel 4 Tests:");
const m5 = new Memory();
test(26, m5.setAtWithTtl("A", "B", "C", "1", "10"), "");
test(27, m5.backup("3"), "1");
test(28, m5.setAt("A", "D", "E", "4"), "");
test(29, m5.backup("5"), "1");
test(30, m5.deleteAt("A", "B", "8"), "true");
test(31, m5.backup("9"), "1");
test(32, m5.restore("10", "7"), "");
test(33, m5.backup("11"), "1");
test(34, m5.scanAt("A", "15"), "B(C), D(E)");
test(35, m5.scanAt("A", "16"), "D(E)");