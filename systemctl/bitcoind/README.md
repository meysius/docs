- Put this in `/lib/systemd/system/bitcoind.service`
```
[Unit]
Description=Bitcoin daemon
After=network.target

[Service]
ExecStart=/usr/bin/bitcoind -conf=/home/deploy/.bitcoin/bitcoin.conf -pid=/home/deploy/.bitcoin/bitcoind.pid
RuntimeDirectory=bitcoind
User=deploy
Type=forking
PIDFile=/home/deploy/.bitcoin/bitcoind.pid
Restart=always


PrivateTmp=true
ProtectSystem=full
NoNewPrivileges=true
PrivateDevices=true
MemoryDenyWriteExecute=true

[Install]
WantedBy=multi-user.target
```