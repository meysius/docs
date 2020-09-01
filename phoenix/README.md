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
c = %Ecto.Changeset{data: %Sport{}, valid?: true}

# using Ecto.Changeset.change/2
# arg 1 = instance of the schema
# arg 2 = map of attrs to be set on the instance
c = Ecto.Changeset.change(%Sport{}, %{name: "Name"})

# using Ecto.Changeset.cast/3
# arg 1 = instance of the schema
# arg 2 = map of attrs to be set on the instance
# arg 3 = list of attr to be filtered from the map
c = Ecto.Changeset.cast(%Sport{}, %{name: "Name"}, [:name])
```

# Validations
Validations are applied to changesets. Validation functions can be found in `Ecto.Changeset` module. 
First argument of these functions are always the changeset struct.
See examples below.
```elixir
my_changeset
|> validate_required(:attr) # or [:attr_1, :attr_2]

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
```elixir
create table(:documents) do
  add :title, :string
  add :title, :string, size: 40
  add :title, :string, default: "Hello"
  add :title, :string, default: fragment("now()")
  add :title, :string, null: false
  add :body, :text
  add :age, :integer
  add :price, :float
  add :price, :float
  add :price, :decimal, precision: 10, scale: 2
  add :published_at, :utc_datetime
  add :group_id, references(:groups)
  add :object, :json

  timestamps  # inserted_at and updated_at
end

drop table(:documents)

create index(:posts, [:slug], concurrently: true)
create unique_index(:posts, [:slug])
drop index(:posts, [:name])

rename table(:posts), :title, to: :summary
rename table(:posts), to: table(:new_posts)

alter table("posts") do
  remove :title, :string, default: ""
end
```

https://hexdocs.pm/ecto/Ecto.Schema.html#module-primitive-types

https://hexdocs.pm/ecto_sql/Ecto.Migration.html


# Ecto Query Interface

## Getting
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

  join: c in assoc(u, :comments),
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

## Create/Update
```elixir
changeset |> Repo.update
changeset |> Repo.insert
changeset |> Repo.insert_or_update
```

## Batch Updating
```elixir
from(p in Post, where: p.id < 10)
|> Repo.update_all(set: [title: "Title"])
|> Repo.update_all(inc: [views: 1])
```

## Preloading while querying
```elixir
# Simple preloading
from p in Post, preload: [:comments]

# Nested preloading
from p in Post, preload: [comments: :likes]

# Preloading using join
from p in Post, 
  join: c in assoc(p, :comments), 
  preload: [comments: c]

# Nested preloading using join
from p in Post,
  join: c in assoc(p, :comments),
  join: l in assoc(c, :likes),
  preload: [comments: {c, likes: l}]
```
You can also filter the preloaded data. For more info, read `Ecto.Query.preload/3 |> h`

## Preloading after querying
```elixir
# Use a single atom to preload an association
posts = Repo.preload posts, :comments

# Use a list of atoms to preload multiple associations
posts = Repo.preload posts, [:comments, :authors]

# Use a keyword list to preload nested associations as well
posts = Repo.preload posts, [comments: [:replies, :likes], authors: []]

# Use a keyword list to customize how associations are queried
posts = Repo.preload posts, [comments: from(c in Comment, order_by: c.published_at)]

# Use a two-element tuple for a custom query and nested association definition
query = from c in Comment, order_by: c.published_at
posts = Repo.preload posts, [comments: {query, [:replies, :likes]}]
```

# Saving Associations
`Ecto.Changeset.put_assoc` can be used to make a change to the value of an association.
```elixir
Ecto.Changeset.put_assoc(post_changest, :tags, tags)
```
by default replacing the value of assoc (e.g. any change other than adding) will raise exception. to change this behaviour
set on_replace to proper value:
`:raise, :mark_as_invalid, :nilify, :update, :delete`

# Controllers
```elixir
conn.host          # → "example.com"
conn.method        # → "GET"
conn.path_info     # → ["posts", "1"]
conn.request_path  # → "/posts/1"
conn.query_string  # → "utm_source=twitter"
conn.port          # → 80
conn.scheme        # → :http
conn.peer          # → { {127, 0, 0, 1}, 12345 }
conn.remote_ip     # → { 151, 236, 219, 228 }
conn.req_headers   # → [{"content-type", "text/plain"}]

conn
|> html("<html><head>...")
|> json(%{ message: "Hello" })
|> text("Hello")

|> redirect(to: "/foo")
|> redirect(external: "http://www.google.com/")
|> halt()

|> put_resp_content_type("text/plain")
|> put_resp_cookie("abc", "def")
|> put_resp_header("X-Delivered-By", "myapp")
|> put_status(202)
|> put_status(:not_found)
```

# Routing
https://devhints.io/phoenix-routing

# Views
Each view is a module that represents a cluster (e.g. a directory) of templates.

```elixir
defmodule AppNameWeb.PageView do
  use AppNameWeb, :view
end
```

This view represents a cluster of templates in `web/templates/page`

# Setting up email sending
- Add `bamboo` and `bamboo_smtp` to your dependencies.
- Add a mailer module to `_web/mailers/mailer.ex`
```elixir
defmodule AppNameWeb.Mailer do
  use Bamboo.Mailer, otp_app: :app_name
end
```
- Configure this mailer (If you are using SES, verify two email address, get smtp creds and you are good to go.)
```elixir
config :app_name, AppNameWeb.Mailer,
  adapter: Bamboo.SMTPAdapter,
  server: "...",
  port: ...,
  username: ...,
  password: ...,
  tls: :if_available,
  ssl: false,
  retries: 1
```
- Add layout files: `web/templates/layout/email.(html/text).eex`
- To make a namespace of templates like `web/templates/email/*`, add view below in `web/views`
```elixir
defmodule AppNameWeb.EmailView do
  use AppNameWeb, :view
end
```
- Makeemail factory module in `_web/emails/email.ex`
```elixir
defmodule AppName.Email do
  use Bamboo.Phoenix, view: AppNameWeb.EmailView

  def welcome do
    new_email()
    |> to(...)
    |> from(...)
    |> subject(...)
    |> put_layout({ AppNameWeb.LayoutView, :email })
    |> render(:welcome)
  end
end
```
- This module defines `welcome` email which renders `web/templates/email/welcome.(html/text).eex` in layout `web/templates/layout/email.(html/text).eex`
- Send email using: `AppNameWeb.Email.welcome() |> AppNameWeb.Mailer.deliver_now`


# Setting up cors
When using phoenix as an API, cors configs has to be set up otherwise you are going to get cross-origin error when trying to communicate with the API.
- Add `{:cors_plug, "~> 2.0"}` to `mix.exs`
- Add `plug CORSPlug` to `endpoint.ex`. (In docs it is added before `plug YourApp.Router`)

Read more https://github.com/mschae/cors_plug

# Setting up password encryption
- Add `{:bcrypt_elixir, "~> 2.0"}` to `mix.exs`
- Add to user migration
```elixir
# ...
  add :email, :string
  add :password_hash, :string
# ...

create unique_index(:users, [:email])
```
- Add the following two fields to user model
```elixir
field :password, :string, virtual: true
field :password_hash, :string
```

- Remove `:password_hash` from cast and required valiadations and add below to user changeset:
```elixir
|> validate_length(:password, min: 8)
|> unique_constraint(:email)
|> put_password_hash
```

- Add the following private method to user model
```elixir
defp put_password_hash(changeset) do
  case changeset do
    %Ecto.Changeset{valid?: true, changes: %{password: password}}
      ->
        put_change(changeset, :password_hash, Bcrypt.hash_pwd_salt(password))
    _ ->
        changeset
  end
end
```
- To verify a password in controller do:
```elixir
Bcrypt.verify_pass("password", password_hash_from_db)
```

# Setting up jwt
- Add `{:guardian, "~> 2.0"}` to `mix.exs`
- Make a file in `lib/guardian.ex`:
```elixir
defmodule AppName.Guardian do
  use Guardian, otp_app: :app_name

  def subject_for_token(user, _claims) do
    sub = to_string(user.id)
    {:ok, sub}
  end
  def subject_for_token(_, _) do
    {:error, :reason_for_error}
  end

  def resource_from_claims(claims) do
    id = claims["sub"]
    user = AppName.Repo.get(AppName.UserContext.User, id)
    {:ok,  user}
  end
  def resource_from_claims(_claims) do
    {:error, :reason_for_error}
  end
end
```
- Add to `config.exs`
```elixir
# Secret key. You can use `mix guardian.gen.secret` to get one
config :app_name, AppName.Guardian,
       issuer: "app_name",
       secret_key: "hWf88T2zEh/+PE+B50hqOKlBrzBgMytS9glt4JlgV9E4xR7YEZL8pwggUeBH+dqT"
```
- Add `_web/auth_pipeline.ex`:
```elixir
defmodule AppName.Guardian.AuthPipeline do
  use Guardian.Plug.Pipeline, otp_app: :app_name,
  module: AppName.Guardian,
  error_handler: AppName.AuthErrorHandler

  # Can customize plugs below, read more on guardian github
  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource
end
```
- Add `_web/auth_error_handler.ex`
```elixir
defmodule AppName.AuthErrorHandler do
  import Plug.Conn

  def auth_error(conn, {type, _reason}, _opts) do
    body = Jason.encode!(%{error: to_string(type)})
    send_resp(conn, 401, body)
  end

end
```
- Add a new pipeline to `router.ex`:
```elixir
pipeline :jwt_authenticated do
  plug AppName.Guardian.AuthPipeline
end
```
- Use this pipelines on routes that require authentication
- In controllers you have:
```elixir
resource = MyApp.Guardian.Plug.current_resource(conn)
claims = MyApp.Guardian.Plug.current_claims(conn)
```
