- Add user on ubuntu:
```
sudo adduser name
```
- Add them to sudo group:
```
usermod -aG sudo name
```

- Generate ssh-keys:
```
$ ssh-keygen -t rsa -b 4096
```

# Activating ssh with rsa key
- Copy your public key content to `~/.ssh/authorized_keys` on the server. Note that `~` is home dir for the use you want to use for connecting to server.

now you should be able to connect to the server using: `ssh -i your/private_key user@ip`

# Disable Password-based login for ssh
Edit the following settings in `/etc/ssh/sshd_config` and set them to `no`:
```
PasswordAuthentication no
```

finally do:
`sudo systemctl restart ssh`
