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
Adjust migrations and schemas
```elixir
# add to migration of the dependant
add :user_id, references(:users)

# add to users schema
has_many :posts, Project.Blog.Post

# add to posts schema
belongs_to :user, Project.Blog.User
```

## One to One
Generate the schemas within some context
```
$ mix phx.gen.context Blog User users 
$ mix phx.gen.context Blog Profile profiles
```
Adjust migrations and schemas
```elixir
# add to migration of the dependant
add :user_id, references(:users)

# add to users schema
has_one :profile, Project.Blog.Profile

# add to profile schema
belongs_to :user, Project.Blog.User
```

## many to many
Generate the schemas within some contest, along with migration for the join table 
```
$ mix phx.gen.context Blog Post posts
$ mix phx.gen.context Blog Hashtag hashtags
$ mix ecto.gen.migration create_hashtags_posts
```
Adjust migrations and schemas
```elixir
# fill in the migration of the join table
defmodule Project.Repo.Migrations.CreateHashtagsPosts do
  use Ecto.Migration

  def change do
    create table(:hashtags_posts) do
      add :hashtag_id, references(:hashtags)
      add :post_id, references(:posts)
    end

    create unique_index(:hashtags_posts, [:hashtag_id, :post_id])
  end
end


# add to posts schema
many_to_many :hashtags, Project.Blog.Hashtag, join_through: :hashtags_posts

# add to hashtags schema
many_to_many :posts, Project.Blog.Post, join_through: :hashtags_posts
```

# Changesets
`%Ecto.Changeset{}` is a struct that is given to `Repo.update`, `Repo.insert`, and `Repo.delete`.

How to create a changeset:
```elixir
# directly making the struct
s = %Ecto.Changeset{data: %Sport{}, valid?:true}

# using Ecto.Changeset.change/2
# arg 1 = instance of the schema
# arg 2 = map of attrs to be set on the instance
u = Ecto.Changeset.cast %Sport{}, %{name: "Name"}

# using Ecto.Changeset.cast/3
# arg 1 = instance of the schema
# arg 2 = map of attrs to be set on the instance
# arg 3 = list of attr to be filtered from the map
u = Ecto.Changeset.cast %Sport{}, %{name: "Name"}, [:name]
```

# Validations
Validations are applied to changesets. Validation functions can be found in `Ecto.Changeset` modules. See examples below.
```elixir
Ecto.Changeset.validate_required changeset, [:attr_1, :attr_2]
Ecto.Changeset.validate_number(changeset, :pi, greater_than: 3, less_than: 4)
```

# Migrations
https://hexdocs.pm/ecto/Ecto.Schema.html#module-primitive-types
