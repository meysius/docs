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
c = %Ecto.Changeset{data: %Sport{}, valid?:true}

# using Ecto.Changeset.change/2
# arg 1 = instance of the schema
# arg 2 = map of attrs to be set on the instance
c = Ecto.Changeset.change %Sport{}, %{name: "Name"}

# using Ecto.Changeset.cast/3
# arg 1 = instance of the schema
# arg 2 = map of attrs to be set on the instance
# arg 3 = list of attr to be filtered from the map
c = Ecto.Changeset.cast %Sport{}, %{name: "Name"}, [:name]
```

# Validations
Validations are applied to changesets. Validation functions can be found in `Ecto.Changeset` module. 
First argument of these functions are always the changeset struct.
See examples below.
```elixir
my_changeset
|> validate_required(:attr) # or [:one, :two]

|> validate_format(:email, ~r/@/)

|> validate_inclusion(:age, 18..100)
|> validate_exclusion(:role, ~w(admin superadmin))
|> validate_subset(:pets, ~w(cat dog parrot whale))

|> validate_length(:body, min: 1)
|> validate_length(:body, min: 1, max: 160)
|> validate_length(:partners, is: 2)

|> validate_number(:pi, greater_than: 3) 
|> validate_number(:pi, less_than: 4)
|> validate_number(:pi, equal_to: 42)

|> validate_change(:title, fn _, _ -> [])
|> validate_confirmation(:password, message: "does not match")

|> unique_constraint(:email)
|> foreign_key_constraint(:post_id)
|> assoc_constraint(:post)      # ensure post_id exists
|> no_assoc_constraint(:post)   # negative (useful for deletions)
```

# Migrations
https://hexdocs.pm/ecto/Ecto.Schema.html#module-primitive-types


# Ecto Query Interface

```elixir
first(User) |> Repo.one
last(User) |> Repo.one
Repo.get(User, 1)
Repo.get_by(User, name: "Something")

query |> Repo.all
```

There is two APIs for forming a query:
1 - keyword based
```elixir
from p in Post,
  where: p.title == "Hello",
  where: [state: "Sweden"],

  limit: 1,
  offset: 10,

  order_by: c.name,
  order_by: [c.name, c.title],
  order_by: [asc: c.name, desc: c.title],

  preload: [:comments],
  preload: [comments: {c, likes: l}],

  join: c in assoc(c, :comments),
  join: p in Post, on: c.post_id == p.id,
  group_by: p,

  select: p,
  select: {p.title, p.description},
  select: [p.title, p.description],
```

2 - Pipe based
```elixir
User
|> join(:inner, [u], p in Post, on: p.user_id == u.id)
|> where([u], u.age > 18)
|> select([u], u.name)
|> select([c, p], {p.title, c.text})
```

Batch Updating
```elixir
from(p in Post, where: p.id < 10)
|> Repo.update_all(set: [title: "Title"])
|> Repo.update_all(inc: [views: 1])
```