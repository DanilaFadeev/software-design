---
title: "Functional Programming"
description: "An introduction to functional programming in Java, covering lambdas, functional interfaces, and the java.util.function package."
lead: "An introduction to functional programming in Java, covering lambdas, functional interfaces, and the java.util.function package."
date: 2026-05-02T15:50:07+02:00
lastmod: 2026-05-08T00:15:54+02:00
draft: false
menu:
  backend:
    parent: ""
    identifier: "functional-programming-e1fc5b6baee0ea98ff1422ed18af9af0"
weight: 250
toc: true
type: docs
layout: single
---

## Functional Programming

*Functional programming* (FP) is a declarative programming paradigm that models software using pure functions, immutable data, and function composition.

The core principles of FP:

- **Pure Functions.** Functions are pure and deterministic — they always return the same output for a given input and produce no side effects.

- **Recursion.** Recursion is used for iteration instead of traditional loops. A recursive function calls itself until it reaches the base case.

- **Immutability.** Once an object is created, it cannot be changed. To change its value, you create a new object with the desired modification.

- **Higher-Order Functions.** Functions can be used like any other value — passed as arguments, returned from other functions, and stored in data structures.

- **Function Composition.** Multiple functions can be combined to create a new function, and chained to perform complex transformations on data without modifying it.

Java 8 introduced functional programming support through the [`java.util.function`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/function/package-summary.html) package.

## Lambda Expressions

**Lambda expressions** (lambdas) form the core unit of functional programming in Java. In FP, functions are "first-class citizens" — they can be created, stored, referenced, and passed around just like objects. In other words, a lambda expression is an anonymous function (without a name or access modifiers).

A lambda expression is used to implement a **functional interface**.

### Functional Interfaces

Lambdas in Java can replace certain anonymous inner classes. A lambda expression's type must be a **functional interface** — an anonymous class that doesn't implement a functional interface cannot be written as a lambda.

A **functional interface** is an interface that has exactly one **abstract** method (**default** and **static** methods don't count). The optional `@FunctionalInterface` annotation explicitly marks the interface as functional and causes a compile-time error if the interface doesn't meet this requirement.

Functional interface examples from the JDK:

{{< tabs "functional-interfaces" >}}
{{< tab "Runnable" >}}
```java
@FunctionalInterface
public interface Runnable {
  void run(); // <----- the only abstract method
}
```
{{< /tab >}}
{{< tab "Consumer" >}}
```java
@FunctionalInterface
public interface Consumer<T> {
  void accept(T t); // <----- the only abstract method

  default Consumer<T> andThen(Consumer<? super T> after) {
    Objects.requireNonNull(after);
    return (T t) -> { accept(t); after.accept(t); };
  }
}
```
{{< /tab >}}
{{< tab "Predicate" >}}
```java
@FunctionalInterface
public interface Predicate<T> {
    boolean test(T t); // <----- the only abstract method

    default Predicate<T> and(Predicate<? super T> other) { /* ... */ }
    default Predicate<T> negate() { /* ... */ }
    default Predicate<T> or(Predicate<? super T> other) { /* ... */ }

    static <T> Predicate<T> isEqual(Object targetRef) { /* ... */ }
    static <T> Predicate<T> not(Predicate<? super T> target) { /* ... */ }
}
```
{{< /tab >}}
{{</ tabs >}}

> A lambda expression is an implementation of the single abstract method in a functional interface.

### Lambda Expression Syntax

- Full form: `(...parameters) -> { /* body */ }`
- Single argument: `parameter -> { /* body */ }`
- Immediate return: `(...parameters) -> result`

```java
// Block body, no return value
Runnable command1 = () -> {
  String str = "Runnable Lambda";
  IO.println(str);
};
command1.run(); // Runnable Lambda

// Block body, with return value
Callable<String> command2 = () -> { return "Callable Lambda"; };
IO.println(command2.call()); // Callable Lambda

// Expression lambda (immediate return)
Callable<String> command3 = () -> "Callable Lambda (Simplified)";
IO.println(command3.call()); // Callable Lambda (Simplified)

// Multiple arguments
Comparator<Integer> comparator1 = (a, b) -> a.compareTo(b);
IO.println(comparator1.compare(10, 15)); // -1

// Method reference
Comparator<Double> comparator2 = Double::compareTo;
IO.println(comparator2.compare(4.3, 3.44)); // 1
```

> Under the hood, a lambda expression is still translated into an object, so it doesn't provide a significant performance improvement on its own.

### Capturing Local Values

Inside a lambda, you can use variables from the enclosing scope, but with some constraints:

- A local variable used inside a lambda must be **final** or **effectively final** (i.e., never modified after assignment).
- The `this` keyword inside a lambda refers to the enclosing class, not the lambda itself.

This is because lambdas can only read variables from the outer scope — they cannot modify them. Reading an outer variable inside a lambda is called **capturing**. Lambdas capture the *value* of a variable, not a reference to it.

```java
// Works fine
String title = "Software Design";
Runnable runnable = () -> IO.println("Variable from outside: " + title);
runnable.run(); // Variable from outside: Software Design

// Compile error: Variable used in lambda expression should be final or effectively final
int employeesCount = 5;
Runnable printEmployees = () -> IO.println("Employees Total: " + employeesCount);
printEmployees.run();
employeesCount++; // this modification makes employeesCount non-effectively-final
```

### Serializing Lambdas

Lambda expressions can be stored in data structures and serialized.

```java
// Casting to both Comparator and Serializable tells the compiler to treat
// this lambda as serializable without needing a custom interface.
Comparator<Integer> comparator = (Comparator<Integer> & Serializable) (a, b) -> b - a;

// Serialize to a file
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("comparator.ser"))) {
    out.writeObject(comparator);
}

// Deserialize from the file
Comparator<Integer> restored;
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("comparator.ser"))) {
    restored = (Comparator<Integer>) in.readObject();
}

IO.println(restored.compare(5, 7)); // 2
```

## Built-in Functional Interfaces

[`java.util.function`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/function/package-summary.html) provides a set of standard functional interfaces covering common use cases, particularly in the Collections Framework and the Stream API.

They fall into 4 main categories:

- **Supplying** (`Supplier<T>`) — takes no arguments, returns a value.
- **Consuming** (`Consumer<T>`) — takes an argument, returns nothing.
- **Testing** (`Predicate<T>`) — takes an argument, returns a `boolean`.
- **Mapping** (`Function<T, R>`) — takes an argument, returns a transformed value.

### Supplying (`Supplier<T>`)

[`Supplier<T>`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/function/Supplier.html) returns (supplies) a value and takes no arguments. It describes a lambda that produces a value on each call — either a constant or something computed dynamically, such as a random number or a timestamp.

```java
@FunctionalInterface
public interface Supplier<T> {
  T get();
}

// Static value
Supplier<String> title = () -> "Software Design";
title.get(); // "Software Design"
title.get(); // "Software Design"

// Dynamic value
Supplier<Instant> timestamp = () -> Instant.now();
timestamp.get(); // 2026-05-05T21:39:27.588543Z
timestamp.get(); // 2026-05-05T21:39:29.228348Z
```

The key distinction is that instead of passing a **value**, you pass an **instruction** for how to obtain it. Common use cases:

- **Lazy initialization.** Create expensive objects only when they are actually needed.
- **Default values.** Compute a fallback value only if required.
- **Logging.** Build a dynamic log message only when the log threshold is met.
- **Dependency injection.** Inject a provider or factory rather than the value itself.

To avoid unnecessary boxing/unboxing, the JDK provides primitive-specialised variants:

```java
IntSupplier intValue = () -> 999; // similar to Supplier<Integer>
int intV = intValue.getAsInt(); // 999

BooleanSupplier booleanValue = () -> true; // similar to Supplier<Boolean>
boolean boolV = booleanValue.getAsBoolean(); // true

LongSupplier longValue = () -> 1_000_000L; // similar to Supplier<Long>
long longV = longValue.getAsLong(); // 1000000

DoubleSupplier doubleValue = () -> 0.995; // similar to Supplier<Double>
double doubleV = doubleValue.getAsDouble(); // 0.995
```

### Consuming (`Consumer<T>`)

[`Consumer<T>`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/function/Consumer.html) takes an argument but returns nothing. It is primarily used when you have a value and need to define what to do with it. Common scenarios:

- **Printing.** Define the output channel, for example `.forEach(System.out::println)`.
- **UI rendering.** Receive a new state and repaint the UI based on it.
- **Event handling.** Handle an event by providing a callback.
- **Persisting data.** Receive a resource and save it to external storage.

```java
@FunctionalInterface
public interface Consumer<T> {
  void accept(T t);
}

Consumer<String> logger = str -> {
  IO.println("[" + Instant.now().getEpochSecond() + "]: " + str);
};
logger.accept("Application started"); // [1778018884]: Application started
logger.accept("DB connected");        // [1778018893]: DB connected

// Specialized Consumers
IntConsumer consumeInt = intValue -> IO.println(intValue);
consumeInt.accept(10); // 10

LongConsumer consumeLong = longValue -> IO.println(longValue);
consumeLong.accept(1_000_000L); // 1000000

DoubleConsumer consumeDouble = doubleValue -> IO.println(doubleValue);
consumeDouble.accept(3.14); // 3.14
```

In the Collections API, `Iterable.forEach()` accepts a `Consumer` instance as its argument.

### Testing (`Predicate<T>`)

[`Predicate<T>`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/function/Predicate.html) tests an object and returns a `boolean` result. It is most commonly used to filter elements in a collection or stream.

```java
@FunctionalInterface
public interface Predicate<T> {
  boolean test(T t);
}

Predicate<String> isLongString = str -> str.length() > 5;
isLongString.test("short");   // false
isLongString.test("massive"); // true

// Specialized predicates
IntPredicate predicateInt = intValue -> intValue > 10;
predicateInt.test(999); // true

LongPredicate predicateLong = longValue -> longValue == 1L;
predicateLong.test(1); // true

DoublePredicate predicateDouble = doubleValue -> (int) doubleValue == doubleValue;
predicateDouble.test(25.33); // false
```

`Predicate` is widely used in the Collections Framework:

```java
List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
Predicate<Integer> isEven = i -> i % 2 == 0;

// Produce a new filtered list
List<Integer> even = numbers.stream().filter(isEven).toList();
IO.println(even); // [2, 4, 6]

// Modify the existing list in place
numbers.removeIf(isEven);
IO.println(numbers); // [1, 3, 5]
```

### Mapping (`Function<T, R>`)

[`Function<T, R>`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/function/Function.html) takes an object of type `T` and returns a transformed object of type `R`. It is the most general of the four categories — `Predicate<T>` is effectively a `Function<T, Boolean>`.

```java
@FunctionalInterface
public interface Function<T, R> {
  R apply(T t);
}

Function<String, Integer> toLength = s -> s.length();
toLength.apply("Software"); // 8
```

When the input and output types are the same, `UnaryOperator<T>` is a more expressive shorthand:

```java
UnaryOperator<String> toUpperCase = s -> s.toUpperCase();
toUpperCase.apply("hello"); // HELLO
```

To avoid boxing and unboxing overhead with primitives, the JDK provides specialised variants. The table below maps input (rows) to output (columns):

| | **T** | **int** | **long** | **double** |
| --- | --- | --- | --- | --- |
| **T** | `UnaryOperator<T>` | `IntFunction<T>` | `LongFunction<T>` | `DoubleFunction<T>` |
| **int** | `ToIntFunction<T>` | `IntUnaryOperator` | `LongToIntFunction` | `DoubleToIntFunction` |
| **long** | `ToLongFunction<T>` | `IntToLongFunction` | `LongUnaryOperator` | `DoubleToLongFunction` |
| **double** | `ToDoubleFunction<T>` | `IntToDoubleFunction` | `LongToDoubleFunction` | `DoubleUnaryOperator` |

## Method References

If a lambda just calls an existing method, it can be written as a **method reference**:

```java
// Lambda expression
Consumer<String> printer = s -> IO.println(s);

// Equivalent method reference
Consumer<String> printer = IO::println;
```

Method references fall into 4 categories:

- **Static** — reference to a static method (`RefType::staticMethod`)
- **Bound** — reference to a method on a specific object instance (`expr::instanceMethod`)
- **Unbound** — reference to an instance method, where the instance is the first argument (`RefType::instanceMethod`)
- **Constructor** — reference to a class constructor (`ClassName::new`)

```java
// Static method reference
DoubleUnaryOperator sqrt = Math::sqrt;  // a -> Math.sqrt(a)
IntBinaryOperator max = Integer::max;   // (a, b) -> Integer.max(a, b)

// Bound method reference
String prefix = "Hello";
Predicate<String> startsWith = prefix::equals; // s -> prefix.equals(s)

// Unbound method reference
Function<String, Integer> toLength = String::length; // s -> s.length()
Function<User, String> getId = User::getId; // user -> user.getId()
BiFunction<String, String, Integer> indexOf = String::indexOf; // (text, word) -> text.indexOf(word)

// Constructor method reference
Supplier<List<String>> makeList = ArrayList::new; // () -> new ArrayList<>()
Function<Integer, List<String>> makeSizedList = ArrayList::new; // size -> new ArrayList<>(size)
```

<!-- TODO: Combine Lambda Expressions (for example .and()) -->
<!-- TODO: Imperative examples done in Functional style -->
<!-- TODO: Pattern matching -->

## Resources

- 📝 [Dev Java - Lambda Expressions](https://dev.java/learn/lambdas/)
- 📹 [Implementing Lambda Expressions in Java with Brian Goetz](https://www.youtube.com/watch?v=Uns1db3Laq4)
- 📝 [Oracle - java.util.function package](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/function/package-summary.html)
