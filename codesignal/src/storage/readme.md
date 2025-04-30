# Level 1

The cloud storage system should support file manipulation.

- `ADD_FILE <name> <size>` — should add a new file `name` to the storage. `size` is the amount of memory required in bytes. The current operation fails if a file with the same `name` already exists. Returns `"true"` if the file was added successfully or `"false"` otherwise.

- `GET_FILE_SIZE <name>` — should return a string representing the size of the file `name` if it exists, or an empty string otherwise.

- `DELETE_FILE <name>` — should delete the file `name`. Returns a string representing the deleted file size if the deletion was successful or an empty string if the file does not exist.

## Examples

The example below shows how these operations should work (the section is scrollable to the right):

| Queries | Explanations |
|--------|--------------|
| `["ADD_FILE", "/dir1/dir2/file.txt", "10"]` | returns `"true"`; adds file `"/dir1/dir2/file.txt"` of 10 bytes |
| `["ADD_FILE", "/dir1/dir2/file.txt", "5"]` | returns `"false"`; the file `"/dir1/dir2/file.txt"` already exists |
| `["GET_FILE_SIZE", "/dir1/dir2/file.txt"]` | returns `"10"` |
| `["DELETE_FILE", "/not-existing.file"]` | returns `""`; the file `"/not-existing.file"` does not exist |
| `["DELETE_FILE", "/dir1/dir2/file.txt"]` | returns `"10"` |
| `["GET_FILE_SIZE", "/not-existing.file"]` | returns `""`; the file `"/not-existing.file"` does not exist |

The output should be:
```json
["true", "false", "10", "", "10", ""]
```

# Level 2

Implement an operation for retrieving some statistics about files with a specific prefix.

- `GET_N_LARGEST <prefix> <n>` — should return the string representing the names of the top `n` largest files with names starting with `prefix` in the following format:
  `"<name1>(<size1>), ..., <nameN>(<sizeN>)"`.
  Returned files should be sorted by size in descending order, or in case of a tie, sorted in [lexicographical](https://en.wikipedia.org/wiki/Lexicographical_order) order of the names.
  If there are no such files, return an empty string.
  If the number of such files is less than `n`, all of them should be returned in the specified format.

## Examples

The example below shows how these operations should work (the section is scrollable to the right):

| Queries | Explanations |
|--------|--------------|
| `["ADD_FILE", "/dir/file1.txt", "5"]` | returns `"true"` |
| `["ADD_FILE", "/dir/file2", "20"]` | returns `"true"` |
| `["ADD_FILE", "/dir/deeper/file3.mov", "9"]` | returns `"true"` |
| `["GET_N_LARGEST", "/dir", "2"]` | returns `"/dir/file2(20), /dir/deeper/file3.mov(9)"` |
| `["GET_N_LARGEST", "/dir/file", "3"]` | returns `"/dir/file2(20), /dir/file1.txt(5)"` |
| `["GET_N_LARGEST", "/another_dir", "file.txt"]` | returns `""`; there are no files with the prefix `"/another_dir"` |
| `["ADD_FILE", "/big_file.mp4", "20"]` | returns `"true"` |
| `["GET_N_LARGEST", "/", "2"]` | returns `"/big_file.mp4(20), /dir/file2(20)"`; sizes of files are equal, so returned names are sorted lexicographically |

The output should be:
```json
["true", "true", "true", "/dir/file2(20), /dir/deeper/file3.mov(9)", "/dir/file2(20), /dir/file1.txt(5)", "", "true", "/big_file.mp4(20), /dir/file2(20)"]
```


# Level 3

Implement support for queries from different users. All users share a common filesystem in the cloud storage system, but each user is assigned a storage capacity limit.

- `ADD_USER <userId> <capacity>` — should add a new user in the system, with `capacity` as their storage limit in bytes. The total size of all files owned by `userId` cannot exceed `capacity`. The operation fails if a user with `userId` already exists. Returns `"true"` if a user was successfully created, or `"false"` otherwise.

- `ADD_FILE_BY <userId> <name> <size>` — should behave in the same way as the `ADD_FILE` from Level 1, but the added file should be owned by the user with `userId`. A new file cannot be added to the storage if doing so would exceed the user's `capacity` limit. Returns a string representing the remaining capacity of the user if the file is added successfully, or an empty string otherwise.

> **Note**: All queries calling the `ADD_FILE` operation implemented during Level 1 are run by the user with `userId = "admin"`, who has unlimited storage capacity.

- `MERGE_USER <userId1> <userId2>` — should merge the account of `userId2` with `userId1`. Ownership of all of `userId2`'s files is transferred to `userId1`, and any remaining storage capacity is also added to `userId1`'s limit. `userId2` is deleted if the merge is successful. Returns a string representing the remaining capacity of `userId1` after merging, or an empty string if one of the users does not exist or `userId1` is equal to `userId2`. It is guaranteed that neither `userId1` nor `userId2` equals `"admin"`.

## Examples

The example below shows how these operations should work (the section is scrollable to the right):

| Queries | Explanations |
|--------|--------------|
| `["ADD_USER", "user1", "200"]` | returns `"true"`; creates user `"user1"` with 200 bytes capacity limit |
| `["ADD_USER", "user1", "100"]` | returns `"false"`; `"user1"` already exists |
| `["ADD_FILE_BY", "user1", "/dir/file.med", "50"]` | returns `"150"` |
| `["ADD_FILE_BY", "user1", "/big.blob", "140"]` | returns `"10"` |
| `["ADD_FILE_BY", "user1", "/file-small", "20"]` | returns `""`; `"user1"` does not have enough storage capacity |
| `["ADD_FILE", "/dir/admin_file", "300"]` | returns `"true"`; done by `"admin"` with unlimited capacity |
| `["ADD_USER", "user2", "110"]` | returns `"true"` |
| `["ADD_FILE_BY", "user2", "/dir/file.med", "45"]` | returns `""`; file already exists and owned by `"user1"` |
| `["ADD_FILE_BY", "user2", "/new_file", "50"]` | returns `"60"` |
| `["MERGE_USER", "user1", "user2"]` | returns `"70"`; transfers ownership of `"/new_file"` to `"user1"` |

The output should be:
```json
["true", "false", "150", "10", "", "true", "true", "", "60", "70"]
```

# Level 4

Implement support to allow users to back up their files.

- `BACKUP_USER <userId>` — should back up the current state of all files owned by `userId` (i.e., file names and sizes).
  The backup is stored on a separate storage system and is not affected by any new file manipulation queries.
  Overwrites any backups for the same user if previous backups exist.
  Returns a string representing the number of backed-up files, or an empty string if `userId` does not exist.

- `RESTORE_USER <userId>` — should restore the state of `userId`'s files to the latest backup.
  If there was no backup, all of `userId`'s files are deleted.
  If a file can’t be restored because another user added another file with the same name, it is ignored.
  Returns a string representing the number of the files that are successfully restored, or an empty string if `userId` does not exist.

> **Note**:
> - `MERGE_USER` does not affect `userId`’s backup, and `userId2` is deleted along with its backup.
> - The `RESTORE_USER` operation does not affect the user's capacity.

## Examples

The example below shows how these operations should work (the section is scrollable to the right):

| Queries | Explanations |
|--------|--------------|
| `["ADD_USER", "user", "100"]` | returns `"true"`; creates `"user"` with 100 bytes capacity limit |
| `["ADD_FILE_BY", "user", "/dir/file1", "50"]` | returns `"50"` |
| `["ADD_FILE_BY", "user", "/file2.txt", "30"]` | returns `"20"` |
| `["RESTORE_USER", "user"]` | returns `"0"`; removes all of `"user"`'s files |
| `["ADD_FILE_BY", "user", "/file3.mp4", "60"]` | returns `"40"` |
| `["ADD_FILE_BY", "user", "/file4.txt", "10"]` | returns `"30"` |
| `["BACKUP_USER", "user"]` | returns `"2"`; backs up all of `"user"`'s files |
| `["DELETE_FILE", "/file3.mp4"]` | returns `"60"` |
| `["DELETE_FILE", "/file4.txt"]` | returns `"10"` |
| `["ADD_FILE_BY", "user", "/dir/file5.new", "20"]` | returns `"80"` |
| `["RESTORE_USER", "user"]` | returns `"1"`; restores `"/file4.txt"` and deletes `"/dir/file5.new"` |

The output should be:
```json
["true", "50", "20", "0", "40", "30", "2", "60", "10", "80", "1"]
