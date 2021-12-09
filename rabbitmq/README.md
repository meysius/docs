# Installation
- `sudo apt install rabbitmq-server` on Ubuntu
- `brew install rabbitmq` on MacOS
- Make sure to add the bin folder to your path so you have easy access to rabbitmq executables like rabbitmqctl or rabbitmq-plugins

# Configuration
- find folder containing this file: `sudo find / -name "rabbitmq-env.conf"`
- make a file in that folder name it `rabbitmq.conf`
- Copy content of rabbitmq.conf file you find here to the file you just created
- Default user, pass for connecting to rabbitmq or login to web interface will be guest, guest
- You can find and customize the user pass
- Find and uncomment this: 
```
loopback_users.guest = false
```
- Find, uncomment and replace:
```
listeners.tcp.local = 172.0.0.1:5672 -> listeners.tcp.local = 0.0.0.0:5672
```
- Enable management plugin: `rabbitmq-plugins enable rabbitmq_management`
- You can now access the web interface here: `localhost:15672`
