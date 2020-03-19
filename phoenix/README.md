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

## Generate Json and Html scaffolds
```
$ mix phx.gen.html Blog Post posts column_name:column_type
$ mix phx.gen.json Blog Post posts column_name:column_type
```

# Associations
## One to Many
Generate the schemas within some context
```
$ mix phx.gen.context Blog User users 
$ mix phx.gen.context Blog Post posts
```
Adjust migration for the side holding the foreign key
```elixir
defmodule Project.Repo.Migrations.CreatePosts do
  use Ecto.Migration

  def change do
    create table(:posts) do
      add :user_id, references(:users)
    end
  end
end
```
Declare the relationship on the schema
```elixir
defmodule Project.Blog.User do
  use Ecto.Schema

  schema "users" do
    has_many :posts, Project.Blog.Post
  end
end

defmodule Project.Blog.Post do
  use Ecto.Schema

  schema "posts" do
    belongs_to :user, Project.Blog.User
  end
end
```


