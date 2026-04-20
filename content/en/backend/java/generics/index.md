---
title: "Generics<E>"
description: "A deep dive into Java Generics — parameterized types, type erasure, wildcards, and type inference with practical examples."
lead: ""
date: 2026-04-17T19:34:28+02:00
lastmod: 2026-04-17T19:34:28+02:00
draft: false
menu:
  backend:
    parent: ""
    identifier: "generics-b692b67794e8b9a5f73398309f55dfe8"
weight: 999
toc: true
type: docs
layout: single
---

## Overview

**Generics** let you create classes, interfaces, and methods that work the same way across different types of objects. They are also referred to as **_parameterized types_**. The term **generic** comes from the idea that some general algorithms can be applied to different types of objects. Generics provide stronger type checks at compile time and eliminate manual type casting.

## Syntax

The most common example is the collections framework, which uses generics to allow storing different types without introducing a separate class for every possible type.

```java
public class List<E> {
  public E get(int index) { /* ... */ }
}

List<Date> dates = new ArrayList<>();
List<User> users = new LinkedList<>();
```

The identifier `E` between the angle brackets (`<>`) is a **_type parameter_**. It means that the `List` class is generic and requires specifying a Java type as an argument to create its instance. In the example above, the generic parameter `E` represents the type of the contained elements.

Completing the type by providing its type parameter is called **_instantiating the type_**.

Another popular example is the `Map` interface, which requires two generic parameters specifying types for the **key** and the **value**:

```java
public class Map<K, V> {
  public V put(K key, V value) { /* ... */ }
}
```

Generics can also be applied to interfaces:

```java
public interface Pair<K, V> {
    public K getKey();
    public V getValue();
}

public class PairImpl<K, V> implements Pair<K, V> { /* ... */ }

Pair<String, Integer> pair = new PairImpl<>("Key", 25);
```

### Naming Conventions

By convention, type parameter names are single uppercase letters. The most commonly used names are:

- `E` - Element (heavily used in the Java Collections Framework)
- `K` - Key
- `V` - Value
- `N` - Number
- `T` - Type
- `S`, `U`, `V` - 2nd, 3rd, 4th types

### Primitive Type Parameters

Type parameters must be class types, so it's not possible to parameterize a generic class with a primitive type such as `int` or `boolean`. However, Java provides autoboxing of primitive types, which makes it possible to use them when working with generic values:

```java
// Must be defined as wrapper types
Map<Integer, Boolean> isPrime = new HashMap<>();

// Primitive types are autoboxed automatically
isPrime.put(1, false);
isPrime.put(2, true);
isPrime.put(3, true);
isPrime.put(4, false);
isPrime.put(5, true);

boolean isOnePrime = isPrime.get(1);
```

The reason for this restriction is the internal generics implementation using **type erasure**. At runtime, Java replaces the generic type with `Object` (or an upper bound type). Since primitives are not subtypes of `Object`, they cannot be used in this system.

## Internal Implementation

The design goal for the **generics** implementation was to introduce new syntax with no impact on performance or backward compatibility, which required avoiding significant changes to compiled classes.

### Type Erasure

To accomplish this, Java introduces an erasure mechanism based on the idea that parameterized type logic is applied statically at compile time but does not need to be carried into the compiled classes. The Java compiler erases generic information from the output binary classes and does not retain it. This means the Java runtime has no knowledge of generics at all.

Because generics are not available at runtime, it was not possible to use the `instanceof` operator with generic types before **Java 23**:

```java
List<Integer> numbers = new ArrayList<>();
numbers instanceof List<Integer>; // error before Java 23
```

Starting in Java 23 (JEP 455), the rules for `instanceof` with generic types were relaxed. If the compiler can already see from the static type of the variable that the check is safe — meaning no unchecked cast warning would be produced — it now allows the generic `instanceof`. In the example above, since `numbers` is already declared as `List<Integer>`, the compiler knows the check is trivially safe and permits it. The result is always `true` because at runtime Java still erases the generic type, so it just checks `instanceof List` under the hood.

### Example

The Java compiler erases the generic angle brackets and replaces type parameters with `Object` (or the upper bound). After decompiling the `.class` file, there is no information about generic types.

{{< tabs "generics-type-erasure-tabs" >}}
{{< tab "Source Code" >}}

```java
public class GenericsRuntimeErasure {
    static void main() {
        List<Date> dates = new ArrayList<>();
        dates.add(new Date());
        dates.add(new Date());
        IO.println(dates instanceof List<Date>);
    }
}
```

{{< /tab >}}
{{< tab "Decompiled" >}}

```java
public class GenericsRuntimeErasure {
    static void main() {
        ArrayList var0 = new ArrayList();
        var0.add(new Date());
        var0.add(new Date());
        IO.println(var0 instanceof List);
    }
}
```

{{< /tab >}}
{{< /tabs >}}

## Raw Types

Every generic class has a **raw type**, which is the base Java type from which all generic type information has been removed and type variables replaced by a general Java type. For example, the raw type of `List<Integer>` is simply `List`.

### Bounded Types

It is possible to define a limitation (**_bound_**) on a type parameter, specifying that the element type must be a subtype of another class. Bounded type parameters allow invoking methods defined in the bound:

```java
class NaturalNumber<T extends Integer> {
    public boolean isEven(T number) {
        // .intValue() comes from the Integer class
        return number.intValue() % 2 == 0;
    }
}
```

When a bound is defined, the erasure is more restrictive than `Object` — the compiler replaces the type parameter with the upper bound type instead. In the example below, `T` is erased to `Date`, which is called the **_upper bound_**. This means the parameterized type can only be instantiated with `Date` or one of its subclasses.

{{< tabs "generics-raw-types-tabs" >}}
{{< tab "Source Code" >}}

```java
public class DateFormatter<T extends Date> {
    public String format(T date) {
        return date.getYear() + "/" + date.getMonth();
    }
}
```

{{< /tab >}}
{{< tab "Decompiled" >}}

```java
public class DateFormatter {
    public String format(Date var1) {
        return var1.getYear() + "/" + var1.getMonth();
    }
}
```

{{< /tab >}}
{{< /tabs >}}

{{< alert icon="📝" context="info" >}}

Decompiling the example above with `javap` will still show the generic signature `<T extends Date>` in the output. This is because Java class files store generic information in a separate `Signature` attribute — metadata that tools like `javap` and decompilers read and reconstruct for display. The JVM itself ignores this metadata at runtime and only executes the erased bytecode, where `T` is simply `Date`.

{{< /alert >}}

### Multiple Bounds

It is also possible to define a type parameter with multiple bounds, separated by `&`. In this case, the type argument must be a subtype of all listed bounds.

```java
class FileExplorer<T extends Readable & Closeable> {}
FileExplorer<Reader> fileExplorer; // Reader implements both Readable and Closeable
```

## Parameterized Type Relationships

Parameterized types share a common raw type, so `List<Integer>` is just a `List` at runtime. Because of this, the following raw type assignments are allowed, though they produce compiler warnings:

```java
// Assigning a raw type to a parameterized type:
//     Warning: Raw use of parameterized class 'ArrayList'
//     Warning: Unchecked assignment: 'java.util.ArrayList' to 'java.util.List<java.lang.Integer>'
List<Integer> first = new ArrayList();
first.add(10);

// Assigning a parameterized type to its raw type:
//     Warning: Raw use of parameterized class 'List'
List list = new ArrayList<Date>();
// Warning: Unchecked call to 'add(E)' as a member of raw type 'java.util.List'
list.add(10);
```

{{< alert icon="📝" context="info" >}}

**Unchecked** means that the compiler does not have enough type information to perform the necessary type checks to ensure type safety.

{{< /alert >}}
<br/>
However, more complex type relationships have an important rule:

> Inheritance applies only to the "**base**" (raw) generic type and not to the **_type parameters_**. In other words, assignability works only when two generic types are instantiated with identical **_type parameters_**.

```java
Collection<Integer> parent;

List<Integer> intChild = new ArrayList<>();
parent = intChild; // OK — List extends Collection

List<Double> doubleChild = new ArrayList<>();
parent = doubleChild; // ERROR: incompatible types: List<Double> cannot be converted to Collection<Integer>

Collection<Number> numbers;
List<Integer> integers = new ArrayList<>();
numbers = integers; // ERROR — inheritance does not apply to type parameters
```

## Type Inference

**Type inference** is the compiler's ability to determine the types of arguments and return types based on method invocations and their corresponding declarations. The inference algorithm tries to find the most specific type that works with all of the arguments.

```java
static <T> T pick(T a1, T a2) {
    return a1 != null ? a1 : a2;
}

// Compiler infers the result type as Serializable
var result = pick("str", new ArrayList<String>());
```

This feature simplifies instantiating generic classes, because it is possible to provide an empty set of type parameters `<>` and let the compiler infer them from context:

```java
// Explicit type parameters
Map<String, Integer> hash = new HashMap<String, Integer>();

// Simplified with type inference
Map<String, Integer> hash = new HashMap<>();
```

### Target Types

**Target type** refers to the data type that the Java compiler expects based on the context of an expression. The compiler uses this context to automatically infer generic type parameters, so there is no need to specify them explicitly.

In the example below, `Collections.emptyList()` is inferred to return `List<String>` based on the assignment context:

```java
static <T> List<T> emptyList();
List<String> listOne = Collections.emptyList();
```

## Wildcards

The **wildcard** (defined with the `?` symbol) represents an **_unknown type_**. It can be used as the type of a parameter, field, or local variable, and sometimes as a return type. The wildcard is never used as a type argument for a generic method invocation, a generic class instance creation, or a supertype.

There are three types of wildcards in Java Generics: **Unbounded** Wildcards, **Upper Bounded** Wildcards, and **Lower Bounded** Wildcards.

### Upper Bounded Wildcards `<? extends A>`

**Upper bounded wildcards** are used to relax the restriction on a variable type.

- **Scenario**: A method must work on a list of `Number` and its subtypes (`Integer`, `Double`, `Float`).
- **Problem**: The definition `List<Number>` is tied only to `Number` and does not allow its subclasses. Calling `sumNumbers(new ArrayList<Integer>())` on a method declared as `sumNumbers(List<Number> numbers)` would produce: `Required type: List<Number>, Provided: ArrayList<Integer>`.
- **Solution**: Use an upper bounded wildcard `List<? extends Number>` to also accept any subtype of `Number` as the list element type.

```java
void main() {
    sumNumbers(List.<Integer>of(2, 3, 5));     // 10.0
    sumNumbers(List.<Double>of(2.5, 5.0, 3.8)); // 11.3
}

double sumNumbers(List<? extends Number> numbers) {
    double result = 0;
    for (Number number : numbers) result += number.doubleValue();
    return result;
}
```

### Unbounded Wildcards `<?>`

The unbounded wildcard `<?>` represents any unknown type and is equivalent to `<? extends Object>`.

- **Scenario**: A method needs to print all elements of a list using their default `.toString()` behavior, regardless of what the list contains.
- **Problem**: Defining `print(List<Object> list)` would not accept any list other than a `List<Object>`.
- **Solution**: Using an unbounded wildcard, `print(List<?> list)` accepts a list of any type.

```java
void main() {
    print(List.<Integer>of(2, 3, 5));
    print(List.<String>of("One", "Two", "Three"));
}

void print(List<?> items) {
    for (Object item : items) {
        IO.println(item);
    }
}
```

The two most common use cases for unbounded wildcards are:

- Defining a method that can be implemented using only functionality from the `Object` class.
- A generic class method that does not depend on the type parameter (such as `List.size()` or `List.clear()`).

### Lower Bounded Wildcard `<? super A>`

In contrast to upper bounded wildcards, a **lower bounded wildcard** restricts the unknown type to be a specific type or a supertype of that type.

- **Scenario**: A utility method needs to fill every element of a list with a default value.
- **Problem**: Declaring the method as `fill(List<T> list, T obj)` will only accept a list of the exact type. It would not be possible to pass a `List<Number>` when the fill value is an `Integer`, even though an `Integer` fits perfectly into a `List<Number>`.
- **Solution**: Use a lower bounded wildcard `? super T`, just like `Collections.fill()` does in the standard library.

```java
void main() {
    List<Integer> integers = new ArrayList<>(Arrays.asList(1, 2, 3));
    List<Number> numbers = new ArrayList<>(Arrays.asList(1.0, 2.0, 3.0));

    fill(integers, 0); // OK
    fill(numbers, 0);  // OK — Number list accepts Integer value
}

<T> void fill(List<? super T> list, T obj) {
    for (int i = 0; i < list.size(); i++) {
        list.set(i, obj);
    }
}
```

## Resources

- 📝 [dev.java - Generics](https://dev.java/learn/generics/)
- 📚 [Learning Java, 6th Edition by Marc Loy, Patrick Niemeyer, Daniel Leuck](https://www.oreilly.com/library/view/learning-java-6th/9781098145521/)
