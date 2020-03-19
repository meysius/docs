## Up and Running
```bash
$ mix phx.new hello
$ mix phx.new hello --no-html --no-webpack
```

## mix tasks
```
$ mix ecto.create
$ mix ecto.drop
$ mix ecto.migrate
$ mix ecto.migrations
$ mix phx.server
```

## Running interactive console
```
$ iex
$ iex -S mix
$ iex -S mix phx.server
```

## generators
```
$ mix ecto.gen.migration migration_name
$ mix phx.gen.html Blog Post posts column_name:column_type user_id:references:users
$ mix phx.gen.html Blog Post posts column_name:column_type user_id:references:users
$ mix phx.gen.context Blog Post posts column_name:column_type user_id:references:users
```
