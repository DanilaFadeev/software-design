---
title: "Stream API"
description: ""
lead: ""
date: 2024-04-28T12:03:04+02:00
lastmod: 2024-04-28T12:03:04+02:00
draft: false
menu:
  backend:
    parent: ""
    identifier: "stream-api-11d04c1fe52973ddf988a6bac9f4e7d2"
weight: 300
toc: true
type: docs
layout: single
---

A **Stream** represents a sequence of elements and provides different kinds of operations to perform upon those elements. 

## Processing

### Stream Operations

**Stream** operations are either <u>intermediate</u> (returns a **Stream** object and can be chained) or <u>terminal</u> (returns void or non-stream result).

A **Stream** pipeline is executed only when there is a _terminal operation_ (like `count()`, `collect()`, `forEach()`, etc.). Otherwise, no operation on the stream will be performed. Once the _terminal operation_ is performed, the Stream is finished and can't be reused.

Any **Stream** can potentially have an unlimited number of elements going through it. In cases where it's possible, stream elements are processed individually as they arrive:

```java
persons.stream()
  .filter(person -> {
    Boolean isMatched = person.age > 30;
    System.out.println(person + ", FILTER MATCH: " + isMatched);
    return isMatched;
  })
  .map(person -> {
    System.out.println("Extract age: " + person.age);
    return person.age;
  })
  .map(personAge -> {
    String ageStr = personAge + " y.o.";
    System.out.println("Convert to a string: " + ageStr);
    return ageStr;
  })
  .toList();

/********** OUTPUT: **********
// Person: { name: Terry Medhurst, age: 50, weight: 75.4 }, FILTER MATCH: true
// Extract age: 50
// Convert to a string: 50 y.o.
// Person: { name: Sheldon Quigley, age: 28, weight: 74.0 }, FILTER MATCH: false
// Person: { name: Terrill Hills, age: 38, weight: 105.3 }, FILTER MATCH: true
// Extract age: 38
// ...
```

### Processing Order

A **Stream** object's processing can be <u>sequential</u> or <u>parallel</u>.

- **Sequential Mode.** The elements are processed in the same order they arrive. For the ordered stream sources (SortedMap, List, etc.), the processing order is guaranteed.

- **Parallel Mode.** The order of elements processing is not guaranteed because multiple threads on multiple cores can be used.

## Initialization

1. The **Collection** interface provides two methods to generate a **Stream**: `stream()` and `parallelStream()`:

```java
List<String> namesList = List.of("Terry", "Sheldon", "Terrill", "Miles", "Mavis");
Stream<String> namesStream = namesList.stream();
```

2. Create a new **Steam** object from the list of items using `Stream.of()`:

```java
Stream<String> namesStream = Stream.of("Terry", "Sheldon", "Terrill", "Miles", "Mavis");
```

3. Convert an array to a stream using `Arrays.stream()`:

```java
String[] names = { "Terry", "Sheldon", "Terrill", "Miles", "Mavis" };
Stream<String> namesStream = Arrays.stream(names);
```

4. Create **Stream** using built-in **IntStream**/**DoubleStream**/**LongStream** classes functionality:

```java
IntStream numbers = IntStream.range(0, 10);       // 10 is exclusive
IntStream numbers = IntStream.rangeClosed(0, 10); // 10 is inclusive
```

## Closing

General **Streams** doesn't have to be closed. It's required to close streams that work with IO-channels:

```java
try (Stream<String> lines = Files.lines(Paths.get("somePath"))) {
  lines.forEach(System.out::println);
}
```

The **Stream** interface declares the `onClose()` method which will be called when the stream is closed:

```java
public Stream<String>streamAndDelete(Path path) throws IOException {
  return Files.lines(path).onClose(() -> someClass.deletePath(path));
}
```

## Examples

{{< alert icon="👉" >}}
**Stream API** usage examples are available {{< source "here" "/backend/java/streams" >}}.
{{< /alert >}}

## Resources

- 📝 [Reflectoring.io - Comprehensive Guide to Java Streams](https://reflectoring.io/comprehensive-guide-to-java-streams/)
- 📹 [Amigoscode - Functional Programming with Java Streams API](https://youtu.be/f5j1TaJlc0w?si=zja9rq_buB3x6do5)
