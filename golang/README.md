# Learn Go

## 1. Hello, Go

### What is Go?

Go (or Golang) is a statically typed, compiled language designed at Google by Rob Pike, Ken Thompson, and Robert Griesemer. It was built to solve real engineering problems: slow builds, messy dependencies, hard-to-read code, and clunky concurrency.

Go's core philosophy: **simplicity over cleverness**. There's usually one obvious way to do something. The language is small — you can learn it all, unlike C++ or Rust.

```go
// Every Go file belongs to a package
package main

// Import standard library packages
import "fmt"

// main() is the entry point
func main() {
    fmt.Println("Hello, Go!")
    fmt.Printf("Version: %s\n", "1.22")
}
```

```
Hello, Go!
Version: 1.22
```

- `package main` declares this is an executable (not a library)
- `import` brings in standard library packages
- `fmt` is the format/print package — you'll use it constantly
- Go requires ALL imports to be used — unused imports are compile errors
- Go requires ALL variables to be used — unused vars are compile errors

### The Go Toolchain

Go ships with an excellent built-in toolchain. You rarely need third-party build tools.

```sh
# Initialize a new module
go mod init github.com/yourname/myapp

# Run a file directly
go run main.go

# Build a binary
go build -o myapp .

# Run all tests
go test ./...

# Format all code (use this always!)
go fmt ./...

# Check for issues
go vet ./...

# Add a dependency
go get github.com/gin-gonic/gin

# Tidy up dependencies
go mod tidy
```

```
# go build produces a single static binary
# No runtime needed — just ship the binary
$ ls -lh myapp
-rwxr-xr-x  1 user  staff  6.2M myapp
```

- `go run` compiles and runs in one step — great for dev
- `go build` produces a single, self-contained static binary
- `go fmt` is the official formatter — no debates about style
- `go mod` manages dependencies (like npm/cargo but simpler)

---

## 2. Variables & Types

### Declaring Variables

Go is statically typed — every variable has a type known at compile time. But Go's type inference means you rarely have to write types explicitly.

```go
package main

import "fmt"

func main() {
    // Full declaration with type
    var name string = "Alice"

    // Type inferred from value
    var age = 30

    // Short declaration (most common inside functions)
    city := "New York"

    // Multiple vars at once
    var (
        isActive bool    = true
        score    float64 = 98.5
    )

    // Zero values — Go always initializes variables
    var count int     // 0
    var label string  // ""
    var ok    bool    // false

    fmt.Println(name, age, city)
    fmt.Println(isActive, score)
    fmt.Println(count, label, ok)
}
```

```
Alice 30 New York
true 98.5
0  false
```

- `:=` is the short declaration — only works inside functions
- `var` works anywhere (package level too)
- Every type has a **zero value** — Go never has uninitialized memory
- Zero values: `0` for numbers, `""` for strings, `false` for bool, `nil` for pointers/slices/maps

### Basic Types

Go has a concise set of built-in types. You'll use these constantly.

```go
package main

import "fmt"

func main() {
    // Integers
    var i int     = 42        // platform size (64-bit on modern systems)
    var i8 int8   = 127       // -128 to 127
    var u uint    = 100       // unsigned
    var i64 int64 = 1_000_000 // underscores for readability

    // Floats
    var f32 float32 = 3.14
    var f64 float64 = 3.141592653589793

    // String — immutable, UTF-8 encoded
    var s string = "Hello, 世界"
    fmt.Println(len(s))        // byte length: 13
    fmt.Println([]rune(s))     // rune (unicode codepoint) slice

    // Booleans
    var b bool = true

    // Byte and Rune
    var ch byte = 'A'   // alias for uint8
    var r rune = '界'    // alias for int32 (unicode)

    fmt.Printf("int: %d, float: %.2f\n", i, f64)
    fmt.Printf("string: %s, bool: %t\n", s, b)
    fmt.Printf("byte: %c, rune: %c\n", ch, r)

    _ = i8; _ = u; _ = i64; _ = f32 // suppress unused warnings
}
```

```
13
[72 101 108 108 111 44 32 19990 30028]
int: 42, float: 3.14
string: Hello, 世界, bool: true
byte: A, rune: 界
```

- Use `int` by default — only use sized types when you need them
- Use `float64` by default — more precision, same performance on modern CPUs
- Strings in Go are UTF-8 byte slices. Use `rune` when working with unicode characters
- `_` discards a value — useful for suppressing 'declared and not used' errors
- Type conversion is always explicit: `float64(myInt)` — no implicit casting

### Constants & iota

Constants are declared with `const`. Go's `iota` is a powerful tool for enumerations.

```go
package main

import "fmt"

// Package-level constants
const Pi = 3.14159
const AppName = "MyAPI"

// Typed constant
const MaxRetries int = 3

// iota — auto-increments in const blocks
type Direction int

const (
    North Direction = iota // 0
    East                   // 1
    South                  // 2
    West                   // 3
)

type ByteSize float64

const (
    _           = iota // ignore first value with blank identifier
    KB ByteSize = 1 << (10 * iota) // 1024
    MB                              // 1048576
    GB                              // 1073741824
)

func main() {
    fmt.Println(North, East, South, West)
    fmt.Printf("KB=%.0f MB=%.0f GB=%.0f\n", float64(KB), float64(MB), float64(GB))

    dir := North
    fmt.Println(dir == North) // true
}
```

```
0 1 2 3
KB=1024 MB=1048576 GB=1073741824
true
```

- `iota` resets to 0 in each `const` block
- You can use expressions with `iota` — it just increments by 1 each line
- Constants are computed at compile time — more efficient than variables
- Go doesn't have a built-in enum keyword — `iota` + typed constants is the pattern

---

## 3. Functions

### Function Basics

Functions are first-class citizens in Go. They can be assigned to variables, passed as arguments, and returned from other functions.

```go
package main

import (
    "fmt"
    "math"
)

// Basic function: params and return type
func add(a, b int) int {
    return a + b
}

// Multiple return values — very common in Go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}

// Named return values
func minMax(nums []int) (min, max int) {
    min, max = nums[0], nums[0]
    for _, n := range nums {
        if n < min { min = n }
        if n > max { max = n }
    }
    return // naked return — returns named values
}

// Variadic function — variable number of args
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

func main() {
    fmt.Println(add(3, 4))

    result, err := divide(10, 3)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Printf("%.4f\n", result)
    }

    lo, hi := minMax([]int{5, 2, 8, 1, 9, 3})
    fmt.Println(lo, hi)

    fmt.Println(sum(1, 2, 3, 4, 5))

    // Spread a slice into variadic
    nums := []int{10, 20, 30}
    fmt.Println(sum(nums...))

    // math package
    fmt.Printf("%.4f\n", math.Sqrt(2))
}
```

```
7
3.3333
1 9
15
60
1.4142
```

- Multiple return values are idiomatic Go — used everywhere for `(result, error)` pairs
- `nil` is Go's zero value for error — means 'no error'
- Always check errors immediately after the function call
- Variadic `...T` lets you pass any number of args; spread with `slice...`
- Named returns are fine for short functions but can hurt readability in long ones

### First-Class Functions & Closures

Functions are values in Go. This enables powerful patterns like callbacks, middleware, and functional programming techniques.

```go
package main

import "fmt"

// Function type
type MathFn func(int, int) int

// Higher-order function — takes a function as param
func apply(a, b int, fn MathFn) int {
    return fn(a, b)
}

// Returns a function (closure)
func multiplier(factor int) func(int) int {
    return func(n int) int {
        return n * factor  // captures 'factor' from outer scope
    }
}

func main() {
    // Assign function to variable
    add := func(a, b int) int { return a + b }
    mul := func(a, b int) int { return a * b }

    fmt.Println(apply(3, 4, add))
    fmt.Println(apply(3, 4, mul))

    // Closure — captures outer variable
    double := multiplier(2)
    triple := multiplier(3)
    fmt.Println(double(5), triple(5))

    // Immediately invoked function
    result := func(x int) int {
        return x * x
    }(7)
    fmt.Println(result)

    // Slice of functions
    ops := []MathFn{
        func(a, b int) int { return a + b },
        func(a, b int) int { return a - b },
        func(a, b int) int { return a * b },
    }
    for _, op := range ops {
        fmt.Println(op(10, 3))
    }
}
```

```
7
12
10 15
49
13
7
30
```

- Closures capture variables from the enclosing scope by reference
- This is how Go implements functional patterns — no need for lambdas, Go functions ARE lambdas
- Function types (`type MathFn func(int,int) int`) make signatures readable
- Immediately invoked functions are useful for complex initialization

### defer, panic & recover

`defer` schedules a function call to run when the surrounding function returns. It's used heavily for cleanup (closing files, unlocking mutexes, etc.).

```go
package main

import "fmt"

func riskyOperation(n int) (err error) {
    // defer runs AFTER the function returns
    // recover() catches panics
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered from panic: %v", r)
        }
    }()

    if n == 0 {
        panic("n cannot be zero!")
    }
    return nil
}

func readFile(name string) {
    fmt.Println("Opening", name)
    // defer ensures this always runs, even if we return early
    defer fmt.Println("Closing", name)

    fmt.Println("Reading", name)
    // imagine more logic here...
    fmt.Println("Done reading", name)
}

func countDefer() {
    // Multiple defers run LIFO (stack order)
    for i := 1; i <= 3; i++ {
        defer fmt.Printf("deferred %d\n", i)
    }
    fmt.Println("function body done")
}

func main() {
    readFile("data.txt")
    fmt.Println()

    countDefer()
    fmt.Println()

    err := riskyOperation(0)
    fmt.Println("Error:", err)

    err = riskyOperation(5)
    fmt.Println("Error:", err)
}
```

```
Opening data.txt
Reading data.txt
Done reading data.txt
Closing data.txt

function body done
deferred 3
deferred 2
deferred 1

Error: recovered from panic: n cannot be zero!
Error: <nil>
```

- `defer` is LIFO — last deferred runs first
- Use `defer` for cleanup: file closes, mutex unlocks, HTTP response body closes
- `panic` is like an exception — but it's NOT idiomatic for normal error handling
- `recover()` can catch panics — only useful in deferred functions
- Normal errors in Go use return values, not panics. Panics are for truly unrecoverable states

---

## 4. Control Flow

### if / else

Go's `if` has a unique feature: an init statement before the condition. This keeps scoping tight and is used constantly with error handling.

```go
package main

import (
    "fmt"
    "strconv"
)

func classify(n int) string {
    if n < 0 {
        return "negative"
    } else if n == 0 {
        return "zero"
    } else {
        return "positive"
    }
}

func main() {
    // Standard if
    x := 42
    if x > 100 {
        fmt.Println("big")
    }

    // if with init statement — very idiomatic!
    // 'err' is scoped to the if block
    if n, err := strconv.Atoi("123"); err != nil {
        fmt.Println("parse error:", err)
    } else {
        fmt.Println("parsed:", n * 2)
    }

    // Another common pattern: early return
    if err := doWork(); err != nil {
        fmt.Println("work failed:", err)
        return
    }
    fmt.Println("work succeeded")

    fmt.Println(classify(-5))
    fmt.Println(classify(0))
    fmt.Println(classify(7))
}

func doWork() error {
    return nil // success
}
```

```
parsed: 246
work succeeded
negative
zero
positive
```

- The init statement (`n, err := ...`) scopes variables to just the if/else block
- No parentheses around conditions in Go — `if x > 0 {` not `if (x > 0) {`
- Braces are always required — no single-line `if`
- The 'early return' pattern (check error, return immediately) is idiomatic Go

### for loops

Go has only ONE loop keyword: `for`. It does everything — while loops, infinite loops, traditional C-style loops, and range-based iteration.

```go
package main

import "fmt"

func main() {
    // Traditional C-style for
    for i := 0; i < 3; i++ {
        fmt.Print(i, " ")
    }
    fmt.Println()

    // While-style (condition only)
    n := 1
    for n < 100 {
        n *= 2
    }
    fmt.Println(n)

    // Infinite loop with break
    count := 0
    for {
        count++
        if count >= 3 { break }
    }
    fmt.Println(count)

    // range over slice — index and value
    fruits := []string{"apple", "banana", "cherry"}
    for i, fruit := range fruits {
        fmt.Printf("%d: %s\n", i, fruit)
    }

    // range — ignore index with _
    total := 0
    for _, n := range []int{1, 2, 3, 4, 5} {
        total += n
    }
    fmt.Println("total:", total)

    // range over map
    scores := map[string]int{"Alice": 95, "Bob": 87}
    for name, score := range scores {
        fmt.Printf("%s: %d\n", name, score)
    }

    // range over string iterates runes
    for i, ch := range "Go!" {
        fmt.Printf("%d=%c ", i, ch)
    }
    fmt.Println()
}
```

```
0 1 2
128
3
0: apple
1: banana
2: cherry
total: 15
Alice: 95
Bob: 87
0=G 1=o 2=!
```

- No `while` keyword — `for condition {}` is Go's while loop
- `for {}` is an infinite loop — use `break` to exit
- `range` works on slices, arrays, maps, strings, and channels
- Use `_` to discard the index or value from `range`
- `continue` skips to next iteration; `break` exits the loop

### switch

Go's `switch` is much more powerful than C's. No fallthrough by default, can switch on any type, and supports expressions.

```go
package main

import (
    "fmt"
    "time"
)

func describe(i interface{}) string {
    // Type switch — very powerful
    switch v := i.(type) {
    case int:
        return fmt.Sprintf("int: %d", v)
    case string:
        return fmt.Sprintf("string: %q (len %d)", v, len(v))
    case bool:
        return fmt.Sprintf("bool: %t", v)
    default:
        return fmt.Sprintf("unknown type: %T", v)
    }
}

func main() {
    // Basic switch — no fallthrough by default
    day := time.Now().Weekday()
    switch day {
    case time.Saturday, time.Sunday:
        fmt.Println("Weekend!")
    default:
        fmt.Println("Weekday")
    }

    // Switch with no condition = if/else chain
    x := 42
    switch {
    case x < 0:
        fmt.Println("negative")
    case x == 0:
        fmt.Println("zero")
    case x < 100:
        fmt.Println("small positive")
    default:
        fmt.Println("large")
    }

    // Type switch
    fmt.Println(describe(42))
    fmt.Println(describe("hello"))
    fmt.Println(describe(true))
    fmt.Println(describe(3.14))

    // Explicit fallthrough (rare)
    n := 1
    switch n {
    case 1:
        fmt.Println("one")
        fallthrough
    case 2:
        fmt.Println("two or after one")
    }
}
```

```
Weekday
small positive
int: 42
string: "hello" (len 5)
bool: true
unknown type: float64
one
two or after one
```

- No `break` needed — cases don't fall through by default
- Multiple values per case: `case 'a', 'e', 'i', 'o', 'u':`
- Switch with no condition is a clean alternative to long if/else chains
- Type switch (`switch v := x.(type)`) is used extensively with interfaces
- `fallthrough` exists but is rarely used — usually a design smell

---

## 5. Slices, Arrays & Maps

### Arrays & Slices

Arrays are fixed-size. Slices are the real workhorse — dynamic, flexible views over arrays. You'll use slices 95% of the time.

```go
package main

import "fmt"

func main() {
    // Array — fixed size, rarely used directly
    arr := [3]int{1, 2, 3}
    fmt.Println(arr, len(arr))

    // Slice — dynamic, most common collection
    s := []int{10, 20, 30, 40, 50}

    // Slicing (like Python)
    fmt.Println(s[1:3])  // [20 30]
    fmt.Println(s[:2])   // [10 20]
    fmt.Println(s[3:])   // [40 50]

    // make — create slice with length and capacity
    s2 := make([]int, 3, 5)  // len=3, cap=5
    fmt.Println(s2, len(s2), cap(s2))

    // append — adds elements, may grow the underlying array
    s2 = append(s2, 100, 200)
    fmt.Println(s2)

    // Append slice to slice
    s3 := append(s[:2], s[3:]...)
    fmt.Println(s3)

    // 2D slice
    matrix := [][]int{
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9},
    }
    for _, row := range matrix {
        fmt.Println(row)
    }

    // copy
    dst := make([]int, len(s))
    n := copy(dst, s)
    fmt.Println(dst, n)
}
```

```
[1 2 3] 3
[20 30]
[10 20]
[40 50]
[0 0 0] 3 5
[0 0 0 100 200]
[10 20 40 50]
[1 2 3]
[4 5 6]
[7 8 9]
[10 20 30 40 50] 5
```

- Slices are references to an underlying array — be careful with mutations
- `append` may return a NEW slice if capacity is exceeded — always reassign: `s = append(s, x)`
- `make([]T, len, cap)` pre-allocates capacity — important for performance in hot paths
- Slicing doesn't copy data — both slices share the same memory
- Use `copy()` when you need an independent copy of a slice

### Maps

Maps are Go's built-in hash tables. Fast, flexible, and used everywhere.

```go
package main

import "fmt"

func main() {
    // Map literal
    ages := map[string]int{
        "Alice": 30,
        "Bob":   25,
        "Carol": 35,
    }

    // Read
    fmt.Println(ages["Alice"])

    // Check existence — always use the two-value form
    age, ok := ages["Dave"]
    if !ok {
        fmt.Println("Dave not found, zero value was:", age)
    }

    // Insert / update
    ages["Dave"] = 28
    ages["Alice"] = 31

    // Delete
    delete(ages, "Bob")

    // Iterate (order is random!)
    for name, age := range ages {
        fmt.Printf("%s: %d\n", name, age)
    }

    // Make a map
    wordCount := make(map[string]int)
    words := []string{"go", "is", "fast", "go", "is", "great", "go"}
    for _, w := range words {
        wordCount[w]++  // safe! zero value of int is 0
    }
    fmt.Println(wordCount)

    // Map of slices — common pattern
    groups := map[string][]string{
        "backend":  {"Alice", "Bob"},
        "frontend": {"Carol"},
    }
    groups["backend"] = append(groups["backend"], "Dave")
    fmt.Println(groups)
}
```

```
30
Dave not found, zero value was: 0
Alice: 31
Carol: 35
Dave: 28
map[go:3 great:1 fast:1 is:2]
map[backend:[Alice Bob Dave] frontend:[Carol]]
```

- Always use the two-value form `v, ok := m[key]` to check existence
- Reading a missing key returns the zero value — not an error!
- Map iteration order is intentionally randomized in Go
- Maps are NOT safe for concurrent use — use `sync.RWMutex` or `sync.Map`
- `wordCount[w]++` works because missing key returns `0` (int zero value)

---

## 6. Structs & Methods

### Structs

Go uses structs instead of classes. They're value types that can have methods attached. This is Go's primary mechanism for object-oriented-style code.

```go
package main

import (
    "fmt"
    "math"
)

// Define a struct
type Point struct {
    X, Y float64
}

type Circle struct {
    Center Point
    Radius float64
}

// Method with value receiver — doesn't modify the struct
func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

// Method with pointer receiver — can modify the struct
func (c *Circle) Scale(factor float64) {
    c.Radius *= factor
}

func (c Circle) String() string {
    return fmt.Sprintf("Circle(center=(%.1f,%.1f), r=%.1f)",
        c.Center.X, c.Center.Y, c.Radius)
}

func main() {
    // Struct literal
    p := Point{X: 1.0, Y: 2.0}
    c := Circle{
        Center: Point{3, 4},
        Radius: 5,
    }

    fmt.Println(p)
    fmt.Println(c)
    fmt.Printf("Area: %.2f\n", c.Area())

    c.Scale(2)
    fmt.Println(c)

    // Pointer to struct
    cp := &Circle{Center: Point{0, 0}, Radius: 10}
    cp.Scale(0.5) // auto-dereferenced
    fmt.Printf("Area: %.2f\n", cp.Area())

    // Anonymous struct — good for one-off data
    user := struct {
        Name string
        Role string
    }{"Alice", "admin"}
    fmt.Println(user.Name, user.Role)
}
```

- Use **pointer receivers** (`*T`) when you need to mutate state or the struct is large
- Use **value receivers** (`T`) for small, immutable structs
- Be consistent — if any method uses a pointer receiver, all should
- Go auto-dereferences: `cp.Scale()` works even though `Scale` takes `*Circle`
- Implement the `String() string` method to customize `fmt.Println` output

### Embedding & Composition

Go doesn't have inheritance. Instead, it has **embedding** — a form of composition that promotes fields and methods.

```go
package main

import "fmt"

type Animal struct {
    Name string
}

func (a Animal) Speak() string {
    return a.Name + " makes a sound"
}

// Dog embeds Animal — gets all its fields and methods
type Dog struct {
    Animal       // embedded (no field name)
    Breed string
}

// Override the method
func (d Dog) Speak() string {
    return d.Name + " barks!"
}

// Logger demonstrates embedding for mixins
type Logger struct{}

func (l Logger) Log(msg string) {
    fmt.Println("[LOG]", msg)
}

type Server struct {
    Logger       // embed Logger
    Host string
    Port int
}

func (s Server) Start() {
    s.Log(fmt.Sprintf("Starting server on %s:%d", s.Host, s.Port))
}

func main() {
    d := Dog{
        Animal: Animal{Name: "Rex"},
        Breed:  "Labrador",
    }

    fmt.Println(d.Name)       // promoted from Animal
    fmt.Println(d.Speak())    // Dog's version
    fmt.Println(d.Animal.Speak()) // explicitly call Animal's

    srv := Server{
        Host: "localhost",
        Port: 8080,
    }
    srv.Start()
    srv.Log("Direct log call")
}
```

```
Rex
Rex barks!
Rex makes a sound
[LOG] Starting server on localhost:8080
[LOG] Direct log call
```

- Embedding is NOT inheritance — it's composition with syntactic sugar
- Embedded fields are **promoted** — `d.Name` instead of `d.Animal.Name`
- Methods are also promoted — `srv.Log()` instead of `srv.Logger.Log()`
- You can always access the embedded type explicitly: `d.Animal.Speak()`
- This pattern replaces mixins and base classes from OOP languages

---

## 7. Interfaces

### Interface Basics

Interfaces in Go are implicitly satisfied — no `implements` keyword. If a type has the methods, it satisfies the interface. This is called **structural typing** and it makes Go incredibly composable.

```go
package main

import (
    "fmt"
    "math"
)

// Define an interface
type Shape interface {
    Area() float64
    Perimeter() float64
}

type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * math.Pi * c.Radius
}

// Function that works with ANY Shape
func printShape(s Shape) {
    fmt.Printf("Area: %.2f, Perimeter: %.2f\n", s.Area(), s.Perimeter())
}

func totalArea(shapes []Shape) float64 {
    total := 0.0
    for _, s := range shapes {
        total += s.Area()
    }
    return total
}

func main() {
    r := Rectangle{Width: 4, Height: 6}
    c := Circle{Radius: 3}

    printShape(r)
    printShape(c)

    shapes := []Shape{r, c, Rectangle{2, 2}}
    fmt.Printf("Total area: %.2f\n", totalArea(shapes))
}
```

```
Area: 24.00, Perimeter: 20.00
Area: 28.27, Perimeter: 18.85
Total area: 56.27
```

- **No `implements` keyword** — satisfaction is implicit and structural
- This means you can satisfy interfaces you didn't write — great for mocking in tests
- Interfaces are usually small in Go — 1 or 2 methods is ideal
- The standard library is full of powerful small interfaces: `io.Reader`, `io.Writer`, `fmt.Stringer`
- A concrete type can satisfy multiple interfaces simultaneously

### Key Standard Interfaces

The Go standard library defines a handful of small interfaces that everything is built around. Learn these and you'll understand Go's entire I/O model.

```go
package main

import (
    "bytes"
    "fmt"
    "io"
    "strings"
)

// io.Reader: anything you can read bytes from
// io.Writer: anything you can write bytes to

// This function works with ANY reader — file, network, string, buffer
func countBytes(r io.Reader) (int, error) {
    buf := make([]byte, 1024)
    total := 0
    for {
        n, err := r.Read(buf)
        total += n
        if err == io.EOF { break }
        if err != nil { return 0, err }
    }
    return total, nil
}

// fmt.Stringer — implement String() to control printing
type Temperature struct {
    Celsius float64
}

func (t Temperature) String() string {
    return fmt.Sprintf("%.1f°C (%.1f°F)", t.Celsius, t.Celsius*9/5+32)
}

// error interface — just one method!
// type error interface { Error() string }
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed on '%s': %s", e.Field, e.Message)
}

func validateAge(age int) error {
    if age < 0 || age > 150 {
        return &ValidationError{Field: "age", Message: "must be between 0 and 150"}
    }
    return nil
}

func main() {
    // strings.NewReader satisfies io.Reader
    r := strings.NewReader("Hello, Go interfaces!")
    n, _ := countBytes(r)
    fmt.Println("bytes:", n)

    // bytes.Buffer satisfies both io.Reader AND io.Writer
    var buf bytes.Buffer
    fmt.Fprintf(&buf, "written to buffer: %d", 42) // uses io.Writer
    fmt.Println(buf.String())

    // Stringer
    t := Temperature{Celsius: 100}
    fmt.Println(t) // calls t.String() automatically

    // Custom error
    err := validateAge(-5)
    if err != nil {
        fmt.Println("Error:", err)
        // Type assert to get the concrete type
        if ve, ok := err.(*ValidationError); ok {
            fmt.Println("Field was:", ve.Field)
        }
    }
}
```

```
bytes: 21
written to buffer: 42
100.0°C (212.0°F)
Error: validation failed on 'age': must be between 0 and 150
Field was: age
```

- `io.Reader` and `io.Writer` are the foundation of all I/O in Go — files, HTTP, buffers all implement them
- `fmt.Stringer` (the `String() string` method) controls how your type prints
- The `error` interface is just `Error() string` — easy to implement custom errors
- Type assertion `v, ok := x.(ConcreteType)` safely extracts the concrete type
- `bytes.Buffer` is extremely useful — an in-memory reader/writer

---

## 8. Goroutines & Channels

### Goroutines

Goroutines are Go's lightweight threads — you can run hundreds of thousands concurrently. They're the key reason Go excels at web services and I/O-heavy workloads.

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()  // signal we're done when this returns
    fmt.Printf("Worker %d starting\n", id)
    time.Sleep(time.Millisecond * 100) // simulate work
    fmt.Printf("Worker %d done\n", id)
}

func main() {
    // go keyword launches a goroutine
    go fmt.Println("I run concurrently!")

    // WaitGroup — wait for multiple goroutines to finish
    var wg sync.WaitGroup

    for i := 1; i <= 5; i++ {
        wg.Add(1)          // tell WaitGroup to expect one more
        go worker(i, &wg)  // launch goroutine
    }

    wg.Wait() // block until all Done() calls match Add() calls
    fmt.Println("All workers done")

    // Goroutines are cheap — 2KB stack vs 1MB for OS threads
    // You can easily launch 100,000+
    var counter sync.WaitGroup
    for i := 0; i < 10_000; i++ {
        counter.Add(1)
        go func() {
            defer counter.Done()
            // tiny work
        }()
    }
    counter.Wait()
    fmt.Println("10,000 goroutines done")
}
```

```
I run concurrently!
Worker 3 starting
Worker 1 starting
Worker 5 starting
Worker 2 starting
Worker 4 starting
Worker 3 done
Worker 1 done
Worker 5 done
Worker 4 done
Worker 2 done
All workers done
10,000 goroutines done
```

- `go fn()` launches fn as a goroutine — returns immediately
- Goroutines are multiplexed onto OS threads by Go's scheduler (M:N threading)
- `sync.WaitGroup` is the standard way to wait for a group of goroutines
- Always pass `*sync.WaitGroup` by pointer — copying breaks it
- Goroutines are ~2KB initial stack (vs ~1MB for OS threads) — extremely cheap

### Channels

Channels are Go's way to communicate between goroutines safely. The Go motto: *"Don't communicate by sharing memory; share memory by communicating."*

```go
package main

import (
    "fmt"
    "time"
)

func producer(ch chan<- int, n int) {
    for i := 0; i < n; i++ {
        ch <- i  // send to channel (blocks if full)
    }
    close(ch) // signal no more values
}

func main() {
    // Unbuffered channel — send blocks until someone receives
    ch := make(chan int)
    go func() { ch <- 42 }()
    val := <-ch  // receive
    fmt.Println(val)

    // Buffered channel — send doesn't block until buffer full
    buffered := make(chan string, 3)
    buffered <- "a"
    buffered <- "b"
    buffered <- "c"
    fmt.Println(<-buffered, <-buffered, <-buffered)

    // Range over channel until closed
    nums := make(chan int, 5)
    go producer(nums, 5)
    for n := range nums {
        fmt.Print(n, " ")
    }
    fmt.Println()

    // select — like switch for channels
    ch1 := make(chan string, 1)
    ch2 := make(chan string, 1)
    go func() { time.Sleep(1 * time.Millisecond); ch1 <- "one" }()
    go func() { ch2 <- "two" }()

    for i := 0; i < 2; i++ {
        select {
        case msg := <-ch1:
            fmt.Println("from ch1:", msg)
        case msg := <-ch2:
            fmt.Println("from ch2:", msg)
        }
    }

    // Timeout pattern with select
    result := make(chan int, 1)
    go func() { time.Sleep(5 * time.Millisecond); result <- 99 }()
    select {
    case v := <-result:
        fmt.Println("got:", v)
    case <-time.After(50 * time.Millisecond):
        fmt.Println("timed out!")
    }
}
```

```
42
a b c
0 1 2 3 4
from ch2: two
from ch1: one
got: 99
```

- Unbuffered channels synchronize — sender blocks until receiver is ready
- Buffered channels (`make(chan T, n)`) allow `n` sends before blocking
- Always `close(ch)` when done sending — enables `range` to terminate
- `select` waits on multiple channel ops — picks whichever is ready first
- `time.After()` + `select` is the standard timeout pattern
- Never send on a closed channel — it panics!

### Mutex & sync primitives

Sometimes channels are overkill. For simple shared state, `sync.Mutex` is cleaner and faster.

```go
package main

import (
    "fmt"
    "sync"
    "sync/atomic"
)

// Safe counter using Mutex
type SafeCounter struct {
    mu sync.Mutex
    v  map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()  // always unlock, even on panic
    c.v[key]++
}

func (c *SafeCounter) Value(key string) int {
    c.mu.RLock()  // read lock — multiple readers OK
    defer c.mu.RUnlock()
    return c.v[key]
}

func main() {
    c := SafeCounter{v: make(map[string]int)}
    var wg sync.WaitGroup

    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            c.Inc("key")
        }()
    }
    wg.Wait()
    fmt.Println(c.Value("key")) // always 1000

    // sync.Once — run something exactly once
    var once sync.Once
    for i := 0; i < 3; i++ {
        once.Do(func() {
            fmt.Println("initialized once!")
        })
    }

    // atomic — lock-free operations on simple types
    var counter int64
    var wg2 sync.WaitGroup
    for i := 0; i < 100; i++ {
        wg2.Add(1)
        go func() {
            defer wg2.Done()
            atomic.AddInt64(&counter, 1)
        }()
    }
    wg2.Wait()
    fmt.Println("atomic counter:", atomic.LoadInt64(&counter))
}
```

```
1000
initialized once!
atomic counter: 100
```

- Use `defer mu.Unlock()` immediately after `Lock()` — ensures unlock even on panics
- `sync.RWMutex` allows multiple concurrent readers but exclusive writers
- `sync.Once` is perfect for lazy initialization (e.g., singleton DB connection)
- `sync/atomic` is fastest for simple integer counters — no lock overhead
- Rule of thumb: use channels for ownership transfer, mutexes for shared state

---

## 9. Error Handling

### Idiomatic Error Handling

Go's error handling is explicit and sometimes verbose — but it's also clear, traceable, and forces you to think about failure cases. There are no exceptions.

```go
package main

import (
    "errors"
    "fmt"
)

// Sentinel errors — predefined error values
var (
    ErrNotFound   = errors.New("not found")
    ErrPermission = errors.New("permission denied")
)

// Custom error type with extra context
type DBError struct {
    Code    int
    Message string
    Query   string
}

func (e *DBError) Error() string {
    return fmt.Sprintf("DB error %d: %s (query: %s)", e.Code, e.Message, e.Query)
}

func queryUser(id int) (string, error) {
    if id <= 0 {
        return "", fmt.Errorf("queryUser: invalid id %d: %w", id, ErrNotFound)
    }
    if id == 999 {
        return "", &DBError{Code: 500, Message: "connection refused", Query: "SELECT * FROM users"}
    }
    return fmt.Sprintf("user_%d", id), nil
}

func main() {
    // Standard error check
    user, err := queryUser(1)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Got:", user)
    }

    // errors.Is — check for sentinel errors (works through wrapping)
    _, err = queryUser(-1)
    if errors.Is(err, ErrNotFound) {
        fmt.Println("User not found!")
    }
    fmt.Println("Full error:", err)

    // errors.As — unwrap to concrete type
    _, err = queryUser(999)
    var dbErr *DBError
    if errors.As(err, &dbErr) {
        fmt.Printf("DB error code: %d\n", dbErr.Code)
    }

    // fmt.Errorf with %w wraps errors
    wrapped := fmt.Errorf("service layer: %w", ErrPermission)
    fmt.Println(errors.Is(wrapped, ErrPermission)) // true!
}
```

```
Got: user_1
User not found!
Full error: queryUser: invalid id -1: not found
DB error code: 500
true
```

- Errors are just values — they implement the `error` interface
- **Sentinel errors** (`var ErrX = errors.New(...)`) are for expected, named failure modes
- `fmt.Errorf("context: %w", err)` wraps errors with context — use this everywhere
- `errors.Is()` traverses the error chain — works with wrapped errors
- `errors.As()` extracts the concrete error type from a wrapped chain
- The convention is: lower-level functions return raw errors; higher-level functions wrap them with context

---

## 10. HTTP & Web APIs

### net/http — Building a REST API

Go's standard library has everything you need to build production HTTP services. No framework required for basic APIs.

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
    "strconv"
    "strings"
)

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

// In-memory store
var users = map[int]User{
    1: {ID: 1, Name: "Alice", Email: "alice@example.com"},
    2: {ID: 2, Name: "Bob",   Email: "bob@example.com"},
}

// Helper: write JSON response
func writeJSON(w http.ResponseWriter, status int, v any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(v)
}

// GET /users      — list all users
// GET /users/{id} — get one user
func usersHandler(w http.ResponseWriter, r *http.Request) {
    // Extract optional ID from path
    path := strings.TrimPrefix(r.URL.Path, "/users")
    path = strings.Trim(path, "/")

    if path == "" {
        // List all
        list := make([]User, 0, len(users))
        for _, u := range users { list = append(list, u) }
        writeJSON(w, http.StatusOK, list)
        return
    }

    id, err := strconv.Atoi(path)
    if err != nil {
        writeJSON(w, http.StatusBadRequest, map[string]string{
            "error": "invalid user id",
        })
        return
    }

    user, ok := users[id]
    if !ok {
        writeJSON(w, http.StatusNotFound, map[string]string{
            "error": "user not found",
        })
        return
    }
    writeJSON(w, http.StatusOK, user)
}

// POST /users — create a user
func createUserHandler(w http.ResponseWriter, r *http.Request) {
    var u User
    if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
        writeJSON(w, http.StatusBadRequest, map[string]string{
            "error": "invalid request body",
        })
        return
    }
    u.ID = len(users) + 1
    users[u.ID] = u
    writeJSON(w, http.StatusCreated, u)
}

func main() {
    mux := http.NewServeMux()

    mux.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case http.MethodGet:
            usersHandler(w, r)
        case http.MethodPost:
            createUserHandler(w, r)
        default:
            w.WriteHeader(http.StatusMethodNotAllowed)
        }
    })

    mux.HandleFunc("/users/", usersHandler)

    mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
    })

    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", mux))
}
```

```sh
# Run the server
$ go run main.go
2024/01/01 Server starting on :8080

# GET all users
$ curl localhost:8080/users
[{"id":1,"name":"Alice","email":"alice@example.com"},...]

# GET one user
$ curl localhost:8080/users/1
{"id":1,"name":"Alice","email":"alice@example.com"}

# POST new user
$ curl -X POST -d '{"name":"Carol","email":"carol@x.com"}' localhost:8080/users
{"id":3,"name":"Carol","email":"carol@x.com"}

# Health check
$ curl localhost:8080/health
{"status":"ok"}
```

- Struct tags like `` `json:"name"` `` control JSON serialization field names
- `json.NewEncoder(w).Encode(v)` streams JSON directly to the response writer
- `json.NewDecoder(r.Body).Decode(&v)` parses the request body — always check the error
- `http.NewServeMux()` is Go 1.22+'s improved router — supports method and path patterns
- Use `log.Fatal(http.ListenAndServe(...))` — logs the error if the server fails to start

### Middleware Pattern

Middleware in Go is just a function that wraps an `http.Handler`. Chain them to add logging, auth, CORS, etc.

```go
package main

import (
    "log"
    "net/http"
    "time"
)

// Middleware type — takes a handler, returns a handler
type Middleware func(http.Handler) http.Handler

// Logging middleware
func Logger(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)  // call the next handler
        log.Printf("%s %s — %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// Auth middleware
func RequireAuth(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        token := r.Header.Get("Authorization")
        if token != "Bearer secret-token" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return // don't call next
        }
        next.ServeHTTP(w, r)
    })
}

// CORS middleware
func CORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
}

// Chain applies middleware in order (left to right)
func Chain(h http.Handler, mws ...Middleware) http.Handler {
    for i := len(mws) - 1; i >= 0; i-- {
        h = mws[i](h)
    }
    return h
}

func main() {
    mux := http.NewServeMux()

    // Public route
    mux.HandleFunc("/public", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("public endpoint"))
    })

    // Protected route — wrapped with auth
    protected := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("secret data"))
    })
    mux.Handle("/private", RequireAuth(protected))

    // Apply global middleware to all routes
    handler := Chain(mux, Logger, CORS)

    log.Println("Listening on :8080")
    http.ListenAndServe(":8080", handler)
}
```

```sh
# Public endpoint
$ curl localhost:8080/public
public endpoint
[LOG] GET /public — 42µs

# Private without token
$ curl localhost:8080/private
Unauthorized
[LOG] GET /private — 12µs

# Private with token
$ curl -H "Authorization: Bearer secret-token" localhost:8080/private
secret data
[LOG] GET /private — 18µs
```

- Middleware is just `func(http.Handler) http.Handler` — simple and composable
- `http.HandlerFunc` converts a plain function into an `http.Handler`
- Call `next.ServeHTTP(w, r)` to pass through, or return early to short-circuit
- The `Chain` function applies middleware cleanly — the first in the list runs first
- For production, use a router like **Gin** or **Chi** which has built-in middleware support

---

## 11. Packages & Modules

### Organizing Code

Go code is organized into packages. A module is a collection of packages with a `go.mod` file. Structure your project around domain concepts.

```
myapp/
├── go.mod            # module definition
├── go.sum            # dependency checksums (auto-generated)
├── main.go           # entry point
├── cmd/              # multiple executables (optional)
│   └── server/
│       └── main.go
├── internal/         # private packages (not importable externally)
│   ├── handler/
│   │   ├── user.go
│   │   └── user_test.go
│   ├── model/
│   │   └── user.go
│   └── store/
│       └── user.go
└── pkg/              # public reusable packages
    └── validator/
        └── validator.go
```

```go
// go.mod — declares module name and Go version
module github.com/yourname/myapp

go 1.22

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/jackc/pgx/v5 v5.5.0
)
```

```go
// Import your own packages
import (
    "github.com/yourname/myapp/internal/handler"
    "github.com/yourname/myapp/internal/model"
    "github.com/yourname/myapp/pkg/validator"
)

// internal/ is enforced by the compiler:
// code outside your module CANNOT import internal/
```

- Package name = directory name (by convention)
- **Exported** identifiers start with an uppercase letter: `User`, `Handler`, `Config`
- **Unexported** identifiers start with lowercase: `user`, `parseToken`, `db`
- `internal/` is special — the compiler prevents external packages from importing it
- Avoid deeply nested package structures — Go prefers flat and simple
- One package per directory — multiple files in one package are fine
