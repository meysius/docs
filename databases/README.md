# Databases

## Postgresql
```
$ brew install postgresql
```
Create rails app with `--database=postgresql` or install gem `pg` and configure `config/database.yml`
```
$ rails db:create
```

For installing postgres on ubuntu in production:
```
$ sudo apt-get install libpq-dev
$ sudo apt-get install postgresql postgresql-contrib
```
Postgresql super user `postgres` is used for administation and database `postgres` is used for users and database data. 
To reset the password of `postgres` role or user:
```
$ sudo vim /etc/postgresql/<VERSION>/main/pg_hba.conf
```
Change `peer` to `trust` for `local all postgres` and `local all all` then do a `sudo service postgresql restart`
Now connect to psql client with `postgres` user:
```
[Command shell with postgres user] 
$ psql -U postgres

[Change super user password]
ALTER USER postgres with password 'new-password';

[OR Create super user no password]
postgres=# CREATE ROLE postgres WITH SUPERUSER CREATEDB CREATEROLE LOGIN;

[Make a special user and db]
postgres=# CREATE ROLE my_user WITH LOGIN PASSWORD 'password';
postgres=# ALTER ROLE my_user CREATEDB;
postgres=# CREATE DATABASE my_db;
postgres=# GRANT ALL PRIVILEGES ON DATABASE my_db TO my_user;

[Bonuses]
postgres=# \du
postgres=# \list
postgres=# \connect my_db
postgres=# \dt
postgres=# \q

[Syntax]
$ psql db_namee -U user 

[Main DB with no user] 
$ psql postgres

```
After this, revert the changes in `pg_hba.conf` file from `trust` to `md5` and restart postgresql.

### Setting up remote Access:
Find `postgresql.config` file:
```
$ sudo find / -name "postgresql.conf"
```
Find `listen_addresses = 'localhost'` and change it to `listen_addresses = '*'`
Add two lines beliw to `pg_hba.conf`:
```
host    all             all              0.0.0.0/0                       md5
host    all             all              ::/0                            md5
```
Do a `sudo service postgresql restart`.
On the server do `netstat -nlt` you should see:
```
tcp        0      0 0.0.0.0:5432          0.0.0.0:*               LISTEN
```
To test from your local machine do: `psql -h ip -U user`

Importing dumps:
```
$ psql db_name < dump.sql
```

## Redis
```
$ sudo apt-get install redis-server
```
To make it password protected, open `/etc/redis/redis.conf` and uncoment `requirepass foobared` and restart the service.

If you are accessing redis from outside, you also have to modify `bind` command with `bind 0.0.0.0 ::0`

## MySQL
```
$ brew install mysql
```
At the end it will give you a command that make mysql launch at startup. 
You can always manually do:
```
$ brew services stop/start mysql
```
Set password for user root:
```
$ mysqladmin -u root password
```
Add `-p` if root already has a password and you want to change it.
Login to MySql, create database and a user:
```
$ mysql -u <user> -p
> show databases;
> create database my_db;
> grant all privileges on my_db.* to 'my_user'@'localhost' identified by 'my_pass'
```
Install `mysql2` gem and configure `config/database.yml`

## MongoDB
```
$ brew install mongodb
```
If mongodb is going to be accessed from outside of server, you need to create a user that has appropriate access on that specific db name
Set password for user root:
```
$ mongo
> show dbs
> use admin
> db.createUser({
  user: "root",
  pwd: "<password>",
  roles: [{ role: "dbAdminAnyDatabase", db: "admin" }]
})
```
Create a user for a specific db name and make that user owner of the db
```
> use my_db
> db.createUser({
  user: "my_user",
  pwd: "<password>",
  roles: ["dbOwner"]
})
```
On server, mongodb is usually protected by authentication.
If you have password for root:
```
mongo --port 27017 -u "root" -p "<password>" --authenticationDatabase "admin"
```
If you don't have password of root you need to comment out `security` and `authorization` in `/etc/mongod.conf`, restart the mongodb service and do the above steps. 

If you are making a new rails app add `--skip-active-record`. If you already have an app, delete any lines starting with `config.active_record` from `config/environments/development` and `config/environments/production` then open `config/application.rb` and replace `require 'rails/all'` with:
```
require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
require "rails/test_unit/railtie"
```
Install gem `mongoid`
Then do:
```
$ rails g mongoid:config
```
Configure `config/mongoid.yml` accordingly.
Put the following code in `~/.irbrc`:
```ruby
if Object.const_defined?('Rails') && Object.const_defined?('Mongoid')
	Mongoid.load!("#{Rails.root}/config/mongoid.yml")
end
```
