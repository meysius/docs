To create a systemd (systemctl) job, put your service description file in:
```
/lib/systemd/system/name.service
or 
/etc/systemd/system/name.service
```

Then to enable it do: `sudo systemctl enable name`

Everytime, you edit the service definition file, you have to reload the daemon:
`sudo systemctl daemon-reload`

To control the service:
```
sudo systemctl {start,stop,restart,status} name
```

To lively monitor the logs, in another terminal do:
```
sudo journalctl -u name.service -f
```