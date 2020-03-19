## Up and Running
```
$ mix phx.new name
```

## mix tasks
```
$ mix ecto.create
$ mix ecto.drop
$ mix ecto.migrate
$ mix ecto.migrations
$ mix deps.get
$ mix phx.server
```

## Interactive console
```bash
# Simple
$ iex

# Loads the project mix file
$ iex -S mix

# Loads the project mix file & runs a server
$ iex -S mix phx.server
```

## generators
```
$ mix ecto.gen.migration migration_name
$ mix phx.gen.html Blog Post posts column_name:column_type
$ mix phx.gen.json Blog Post posts column_name:column_type
$ mix phx.gen.context Blog Post posts column_name:column_type
```

