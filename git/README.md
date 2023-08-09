
## Activating SSH for git
- Make a key pair or choose an existing one to use
- edit `~/.ssh/config`, add:
```
# GitLab.com server
Host github.com
IdentityFile ~/.ssh/name_of_your_key
```

- Print public-key:
```
$ cat ~/.ssh/name_of_your_key.pub
```
- go paste that in your repo client (e.g. github account, bitbucket account, gitlab account)

- Test if your connection is ok?
```
$ ssh -T git@github.com
$ ssh -T git@bitbucket.com
$ ssh -T git@gitlab.com
$ ssh -T git@git.toptal.com
```

Enjoy pushing and pulling with ssh method.

## Setting up git commiter user
```
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"

git config --global user.name    # Check the global name
git config --global user.email   # Check the global email
```

## Create a branch
```
$ git checkout -b name from_branch
```

## Switch branch
```
$ git checkout name
```

## Delete a branch (on origin)
```
$ git push origin --delete name
```

## Delete a branch locally
```
$ git branch -D name
```

## Pull latest from tracked remote branch
```
$ git pull
```

## Pull a branch in from origin
```
$ git pull origin branch_name
```

## Pull only a commit
```
$ git cherry-pick commit_hash
```

## Revert a commit
```
$ git revert commit_hash
```

## Throw out all changes
```
$ git reset --hard && git clean -dfx
```
