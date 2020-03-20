Create a branch
```
$ git checkout -b name from_branch
```

Switch branch
```
$ git checkout name
```

Delete a branch (on origin)
```
$ git push origin --delete name
```

Delete a branch locally
```
$ git branch -D name
```

Pull latest from tracked remote branch
```
$ git pull
```

Pull a branch in from origin
```
$ git pull origin branch_name
```

Pull only a commit
```
$ git cherry-pick commit_hash
```

Revert a commit
```
$ git revert commit_hash
```

Throw out all changes
```
$ git reset --hard && git clean -dfx
```
