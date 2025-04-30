// Level 1 & 2
// File: name, size
// Store has a map of filename -> File
// -- Level 3
// User: id, capacity
// Store has a map of userid -> User
// Adding files by user consumes the capacity, (deleting frees it up): should find owner by filename
// for easy transfer: user should keep a list of owned files.
// --- level 4
// backup: 1 record per user. state of user: current files are stored, inital backup: empty state
// restore: delete all current files -> resets capacity. try restoring files one by one:
  // if no one has that file name => ok, consumes capacity
  // otherwise, skip it

type CloudFile = {
  name: string;
  size: string;
  owner: string;
}

class User {
  public id: string;
  public capacity: number;
  public fileNames: Set<string> = new Set();

  public backupFiles: CloudFile[] = [];

  constructor(id: string, capacity: string) {
    this.id = id;
    this.capacity = parseInt(capacity);
  }

  public addFile(name: string, size: string) {
    this.capacity -= parseInt(size);
    this.fileNames.add(name);
    return `${this.capacity}`;
  }

  public removeFile(file: CloudFile) {
    this.capacity += parseInt(file.size);
    this.fileNames.delete(file.name);
  }
}

class CloudStore {
  public files: Map<string, CloudFile> = new Map();
  public users: Map<string, User> = new Map();

  constructor() {}

  public addFile(name: string, size: string): "true" | "false" {
    if (this.files.has(name)) {
      return "false";
    }
    this.files.set(name, { name, size, owner: "admin" });
    return "true";
  }

  public getFileSize(name: string): string {
    return this.files.get(name)?.size || "";
  }

  public deleteFile(name: string): string {
    const file = this.files.get(name);
    if (!file) {
      return "";
    }

    const user = this.users.get(file.owner);
    user?.removeFile(file)
    this.files.delete(name);
    return file.size;
  }

  public getNLargest(prefix: string, n: string): string {
    return Array.from(this.files.values())
      .filter(f => f.name.startsWith(prefix))
      .sort((a, b) => (parseInt(b.size) - parseInt(a.size)) || a.name.localeCompare(b.name))
      .slice(0, parseInt(n))
      .map(f => `${f.name}(${f.size})`)
      .join(", ");
  }

  public addUser(userId: string, capacity: string): "true" | "false" {
    if (this.users.has(userId)) {
      return "false";
    }
    this.users.set(userId, new User(userId, capacity));
    return "true";
  }

  public addFileBy(userId: string, name: string, size: string): string {
    const user = this.users.get(userId);
    if (!user || user.capacity < parseInt(size) || this.files.has(name)) {
      return "";
    }

    this.files.set(name, { name, size, owner: userId });
    return user.addFile(name, size);
  }

  public mergeUser(userId1: string, userId2: string): string {
    if (userId1 === userId2) {
      return "";
    }

    const u1 = this.users.get(userId1);
    const u2 = this.users.get(userId2);

    if (!u1 || !u2) {
      return "";
    }

    // update capacity u1
    u1.capacity += u2.capacity;
    // transfer u2 files to u1
    u2.fileNames.forEach(fname => {
      const file = this.files.get(fname);
      if (file) {
        file.owner = u1.id;
      }
      u1.fileNames.add(fname);
    });
    // delete u2
    this.users.delete(userId2);
    // return u1 capacity
    return `${u1.capacity}`;
  }

  public backupUser(userId: string): string {
    const user = this.users.get(userId);

    if (!user) {
      return "";
    }

    const backupFiles: CloudFile[] = [];
    user.fileNames.forEach(fname => {
      const file = this.files.get(fname);
      if (file) {
        backupFiles.push(file);
      }
    });

    user.backupFiles = backupFiles;
    return `${backupFiles.length}`;
  }

  public restoreUser(userId: string): string {
    const user = this.users.get(userId);

    if (!user) {
      return "";
    }

    // deletes all current files -> resets capacity
    user.fileNames.forEach(fname => {
      this.deleteFile(fname);
    });

    // add files from backup one by one while counting successful
    let sum = 0;
    user.backupFiles.forEach(f => {
      const result = this.addFileBy(userId, f.name, f.size);
      if (result !== "") {
        sum += 1;
      }
    });
    return sum.toString();
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


console.log("Level 1 Tests:");
const s1 = new CloudStore();
test(1, s1.addFile("/dir1/dir2/file.txt", "10"), "true");
test(2, s1.addFile("/dir1/dir2/file.txt", "5"), "false");
test(3, s1.getFileSize("/dir1/dir2/file.txt"), "10");
test(4, s1.deleteFile("/not-existing.file"), "");
test(5, s1.deleteFile("/dir1/dir2/file.txt"), "10");
test(6, s1.getFileSize("/not-existing.file"), "");


console.log("\nLevel 2 Tests:");
const s2 = new CloudStore();
test(7, s2.addFile("/dir/file1.txt", "5"), "true");
test(8, s2.addFile("/dir/file2", "20"), "true");
test(9, s2.addFile("/dir/deeper/file3.mov", "9"), "true");
test(10, s2.getNLargest("/dir", "2"), "/dir/file2(20), /dir/deeper/file3.mov(9)");
test(11, s2.getNLargest("/dir/file", "3"), "/dir/file2(20), /dir/file1.txt(5)");
test(12, s2.getNLargest("/another_dir", "file.txt"), "");
test(13, s2.addFile("/big_file.mp4", "20"), "true");
test(14, s2.getNLargest("/", "2"), "/big_file.mp4(20), /dir/file2(20)");


console.log("\nLevel 3 Tests:");
const s3 = new CloudStore();
test(15, s3.addUser("user1", "200"), "true");
test(16, s3.addUser("user1", "100"), "false");
test(17, s3.addFileBy("user1", "/dir/file.med", "50"), "150");
test(18, s3.addFileBy("user1", "/big.blob", "140"), "10");
test(19, s3.addFileBy("user1", "/file-small", "20"), "");
test(20, s3.addFile("/dir/admin_file", "300"), "true");
test(21, s3.addUser("user2", "110"), "true");
test(22, s3.addFileBy("user2", "/dir/file.med", "45"), "");
test(23, s3.addFileBy("user2", "/new_file", "50"), "60");
test(24, s3.mergeUser("user1", "user2"), "70");


console.log("\nLevel 4 Tests:");
const s4 = new CloudStore();
test(25, s4.addUser("user", "100"), "true");
test(26, s4.addFileBy("user", "/dir/file1", "50"), "50");
test(27, s4.addFileBy("user", "/file2.txt", "30"), "20");
test(28, s4.restoreUser("user"), "0");
test(29, s4.addFileBy("user", "/file3.mp4", "60"), "40");
test(30, s4.addFileBy("user", "/file4.txt", "10"), "30");
test(31, s4.backupUser("user"), "2");
test(32, s4.deleteFile("/file3.mp4"), "60");
test(33, s4.deleteFile("/file4.txt"), "10");
test(34, s4.addFileBy("user", "/dir/file5.new", "20"), "80");
test(35, s4.restoreUser("user"), "2");