Types
```go
bool
string
int
float32 float64
[]Type
[n]Type
map[keyType]valueType
*Type  // &a returns pointer to variable a
struct {
  a int
  b string
}
interface {
  method_a(a int, b int) int
  method_a() string
}
error
```

Declaring new type
```go
type type_name type_definition
```

Initialization with `{}`
```go
// Struct
StructName{val_1, val_2}
StructName{key_1: val_1, key_2: val_2}

// Slice
[]int{1, 2, 3}

// Map
map[string]int{
  "a": 1,
  "b": 2
}
```

Extending a struct:
```go
type Person struct {
  firstName string
  lastName string
}

type Police struct {
  person
  policeBadgeId string
}
```

Declaring a variable:
```go
x := 1
var x = 1
var x int = 1

const x = 1
const x int = 1
```

Loops
```go
for {
  ...
  break
  continue
}

i := 0
for i <= 100 {
 i += 1
}


for i := 0; i < 10; i++ {
  ...
}

for i, item := range array {
  ...
}
```

Conditions
```go
if a <= 1 {
} else if a > 2 {
} else {}
```


Functions
```go
func (t Type) name(a int, b int) string {

}

func name() (int, int, int) {
  return 1, 2, 3
}

func name(names ...int) {
}

add := func(b int, c int) int {
  return b + c
}

add(1, 2)
```

Error Handling
To implement interface `error`, a type must implement `Error() string`
```go
errors.New("The error") // returns a basic error
```

any name starting with uppercase is accessible outside the package
any name starting with lowercase is not accessible outside the package