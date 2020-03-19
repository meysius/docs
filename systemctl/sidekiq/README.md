```
# /lib/systemd/system/sidekiq.service
#
# systemd unit file for CentOS 7, Ubuntu 15.04
#
# Customize this file based on your bundler location, app directory, etc.
# Put this in /usr/lib/systemd/system (CentOS) or /lib/systemd/system (Ubuntu).
# Run:
#   - systemctl enable sidekiq
#   - systemctl {start,stop,restart} sidekiq
#
# This file corresponds to a single Sidekiq process.  Add multiple copies
# to run multiple processes (sidekiq-1, sidekiq-2, etc).
#
# See Inspeqtor's Systemd wiki page for more detail about Systemd:
# https://github.com/mperham/inspeqtor/wiki/Systemd
#
[Unit]
Description=sidekiq
After=syslog.target network.target

[Service]
Type=simple
WorkingDirectory=/home/deploy/apps/ggapi/current
ExecStart=/bin/bash -lc 'bundle exec sidekiq -e production -L log/sidekiq.log'
User=deploy
Group=deploy
UMask=0002

Environment=MALLOC_ARENA_MAX=2

RestartSec=1
Restart=always

# output goes to /var/log/syslog
StandardOutput=syslog
StandardError=syslog

# This will default to "bundler" if we don't specify it
SyslogIdentifier=sidekiq

[Install]
WantedBy=multi-user.target
```