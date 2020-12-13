# Elixir Language

## Installation
```bash
$ brew install elixir
$ elixir --version

# Run interactive elixir
$ iex

# Running a elixir script
$ elixir test.exs

# Compiling elixir code to generate bytecode
elixirc math.ex
```

## Language Basics

### integer
```elixir
> 1
1
> 0x1F
31
> 0b0110
6
> div(5, 2)
2
> rem(10, 3)
1
```

### float
```elixir
> 5/2
2.5
> trunc(2.58)
2
> round(2.58)
3
```

### boolean
```elixir
# true, false
> is_boolean(true)
true
> is_boolean(:false)
true

# and, or, not are short circuits
# They only execute the right side if needed
> true and 10
error
> true && 10
10
> nil || 22
22
> !10
false
# comparison
# == === != !== > < >= <=
```

### atom
```elixir
:atom
> is_atom(Hello)
true
> is_atom(true)
true
> true == :true
true
```

### bitstring
```elixir
> is_bitstring <<24, 104>>
true

> <<0, 1>> <> <<2, 3>>
<<0, 1, 2, 3>>

> "hello" <> <<0>>
<<104, 101, 108, 108, 111, 0>>

> IO.inspect("hello", binaries: :as_binaries)
<<104, 101, 108, 108, 111>>

> <<3::4>> # or <<3::size(4)>> it means use 4 bits to store 3
> <<0::1, 0::1, 1::1, 1::1>> == <<3::4>>
true

> <<1>> === <<257>>
true # because by default 8 bits is used and 257 stores as 000_000_01

> <<0, 1, x>> = <<0, 1, 2>>
# x becomes 2

> <<0, 1, x :: binary>> = <<0, 1, 2, 3>>
# x becomes <<2, 3>>

> <<head::binary-size(2), rest::binary>> = <<0, 1, 2, 3>>
# head becomes <<0, 1>> rest becomes <<2, 3>>
```

### binary
```elixir
# a bitstring whose size is byte devisiable
> is_binary("hellö")
true
```

### string
```elixir
> is_string "elixir"
true

> to_string 10
"10"

# Each unicode char could be 1 to 4 byte long
> byte_size "hellö"
6 # O(1)

> String.length "hellö"
5 # O(n)

> String.upcase("hellö")
"HELLÖ"

> "hel" <> "lo"
"hello"

> "hello #{:world}"
"hello world"

> IO.puts("Hello")
Hello

> "\u0061" === "a"
true

> String.valid? <<239, 191, 19>>
false # binaries may or maynot be a valid string

> <<head, rest::binary>> = "banana"           
# head becomes first byte or ?b and rest will be "anana"

> <<x, rest::binary>> = "über"                
# x != ?ü because ü is more than 1 byte long

> <<x::utf8, rest::binary>> = "über"
# x == ?ü
```

### list (linked list)
```elixir
> is_list [1, 2]
true
> is_list 'abc'
true
> length [1, 2, 3]
3 # O(n)

> hd [1, 2, 3]
1
> tl [1, 2, 3]
[2, 3]

> hd []
error
> tl []
error

> [1, 2, 3] ++ [4, 5, 6]
[1, 2, 3, 4, 5, 6]

> [1, 2, 3, 3] -- [1, 3]
[2, 3]

> [a, b, c] = [1, 2, 3]      
# a = 1, b = 2, c = 3

> [head | tail] = [1, 2, 3]  
# head = 1, tail = [2, 3]

> [head | _] = [1, 2, 3]
# head = 1, dont care about the rest 

> [0 | [1, 2]]
[0, 1, 2]

> IO.inspect('hello', charlists: :as_lists)
[104, 101, 108, 108, 111]
```

### charlist
```elixir
> is_charlist 'abc'
true

> to_charlist "hełło"
[104, 101, 322, 322, 111]
```

### tuple (array)
```elixir
> is_tuple {1, 2, 3}
true

> tuple_size {:ok, "hello"}
2 # O(1)

> elem {:ok, "hello"}, 1
"hello" # O(1)

> put_elem {:ok, "hello"}, 1, "world"
{:ok, "world"}

> {a, b, c} = {:hello, "world", 42}
# => a = :hellp, b = "world", c = 42
```

### function
```elixir
add = fn (a, b) -> a + b end
add = &(&1 + &2)
> is_function(add)
true
> is_function(add, 2)
true
> add.(1, 2)
3

f = fn
  (x, y) when x > 0 -> x + y end
  (x, y) -> x - y end
end

> f = &Math.zero?/1 
# & Captures definition of a function
```

### keyword lists
```elixir
# keys are always atom 
# keys are not uniq
# order of keys matter

> [{:a, 1}, {:b, 2}] == [a: 1, b: 2]
true
> a = [x: 0, x: 1, y: 2]
> a[:x]
0

# Keyword is a module to work with this
```

### maps
```elixir
# keys can be any type
# keys are uniq
# keys are not ordered
> m = %{:a => 1, 2 => :b}
> m.a
1
> m.2
error

# when all keys are atom
> %{:a => 1, :b => 2} == %{a: 1, b: 2}
true

%{:a => a} = %{:a => 1, 2 => :b} 
# a = 1, it does not matter there is two keys at right but one at left

> Map.to_list %{:a => 1, 2 => :b}
[{2, :b}, {:a, 1}]

> Map.put(%{:a => 1, 2 => :b}, :c, 3)
%{2 => :b, :a => 1, :c => 3}

map = %{a: 1, b: 2}
> new_map = %{map | b: 5}
# can only change the value of a key, does not add new keys
```

### nested structures useful micros
```elixir
put_in/2
update_in/2
get_and_update_in/2
put_in/3
update_in/3
get_and_update_in/3
```

### pid
```elixir
self
```

### iex helpers
```elixir
# for autocomplete press tab after .

# info about data type of var
> i var

# print docs
> h round/1

# code point for unicode char a
> ?a
97

# recompile
> r Module

# print types available in the module
> t Enum
```

### pining variables
```elixir
# maks it read only
> ^x = 2
# error if x is not 2
```

### switch case
```elixir
variable = {3, 4, 5}
case variable do
  {1, 2, 3} ->
  ^variable ->
  {1, x, 3} when x > 2 ->
  _ -> # default
end
```

### cond
```elixir
cond do
  1 == 2 ->
  true ->
end
```

### If and unless
```elixir
if a > 2 do
  ...
else
  ...
end

if a > 2, do: , else:
```

### Modules
```elixir
defmodule Math do
  # module attr
  # used for annotation, constant, and temporary storage
  @module_attr 1

  # public
  def sum(a, b) do
    a + b
  end

  # private
  defp sum(a, b) do
    a + b
  end
end

defmodule Math do
  def zero?(0) do
    true
  end

  def zero?(x) when is_integer(x) do
    false
  end
end

defmodule Concat do
  # declare default values for a param
  def join(a, b, sep \\ " ") do
    a <> sep <> b
  end
end

# declare default values for a multiple clause function
defmodule Concat do
  def join(a, b \\ nil, sep \\ " ")

  def join(a, b, _sep) when is_nil(b) do
    a
  end

  def join(a, b, sep) do
    a <> sep <> b
  end
end
```

### Struct 
```elixir
defmodule User do
  defstruct name: "John", age: 27
end

> %User{}
%User{age: 27, name: "John"}

> mike = %User{name: "Mike"}
%User{age: 27, name: "Mike"}

> mike.name
"Mike"

> kate = %{mike | name: "Kate"}
%User{age: 27, name: "Kate"}

> Map.put mike, :name, "Kate"
%User{age: 27, name: "Kate"}
```

### Loops
```elixir
list = [1, 2, 3]
> Enum.each(list, fn (x) -> IO.puts(x) end)
# prints 1 2 3

> Enum.map(list, fn(x) -> x * 2 end)
[2, 4, 6]

> Enum.reduce(list, 0, fn(x, acc) -> x + acc end)
6

odd? = &(rem(&1, 2) == 1)
> Enum.filter(1..3, odd?)
[1, 3]
```

### piping
```elixir
# |> it takes the output from the expression on its left side
# and passes it as the first argument to the function call on its right side
> 1..3 |> Enum.to_list |> Enum.filter fn(x) -> rem(x, 2) == 1 end |> Enum.sum
4
```

### processes
```elixir
> spawn fn -> 1 + 2 end
# another isolated process. exceptions are not revealed.

> spawn_link fn -> 1 + 2 end
# linked process. exceptions will propagate

> send pid, data
# sends process a message

receive do
  match_1 -> 
  match_2 ->
end
# read more here: https://elixir-lang.org/getting-started/processes.html
```

### Tasks
```elixir
> Task.start 
# wraps spawn for better error handling

> Task.start_linked # wraps spawn_linked for better error handling 
# read more here: https://elixir-lang.org/getting-started/processes.html
```

### alias, use, require, import
```elixir
# Alias the module so it can be called as Bar instead of Foo.Bar
alias Foo.Bar, as: Bar
# same as
alias Foo.Bar

alias Foo.{Bar, Jar, Dar, Var}

# Require the module in order to use its macros
require Foo

# Import functions from Foo so they can be called without the `Foo.` prefix
import Foo

# Invokes the custom code defined in Foo as an extension point
use Foo
```

### What is OTP, Genserver, Supervisor
https://serokell.io/blog/elixir-otp-guide
