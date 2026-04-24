---
title: "Strings"
description: "An overview of Java strings: creation, immutability, the String Pool, formatting, and the StringBuilder class."
lead: "Everything you need to know about working with strings in Java — from literals and formatting to the String Pool and StringBuilder."
date: 2026-04-22T00:00:30+02:00
lastmod: 2026-04-22T00:00:30+02:00
draft: false
menu:
  backend:
    parent: ""
    identifier: "strings-9c66a8f25677d8b22b5069cb6498d5fc"
weight: 50
toc: true
type: docs
layout: single
---

## Overview

Strings in Java are represented by [`java.lang.String`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html) class objects, which encapsulate a sequence of Unicode characters. Under the hood, these characters are stored in a plain Java `byte[]` array (since Java 9, as part of the [Compact Strings](https://openjdk.org/jeps/254) optimization), but the `String` class manages it and provides a rich access API.

Strings in Java are **immutable** — once a string is created, it cannot be changed. There are many operations available that appear to modify a string, but they actually return a new `String` object every time. For example, `.concat()` returns a brand-new `String` rather than modifying the original.

## Creation

### String Literals

Java automatically converts **_string literals_** into `String` objects.

```java
// String literal
String singleLine = "Software Design";

String multiLine1 =
  "Define a multi-line string\n" +
  "using concatenation";

// Concatenation
String title = "Software " + "Design"; // "Software Design"
```

For larger text blocks, Java 13 introduced **text blocks**. There is a special rule about leading spaces: the leftmost non-space character becomes the left "edge". All spaces to the left of that edge are ignored, while spaces to the right are retained.

```java
public static void main(String[] args) {
  String multiLine2 = """
    CAP theorem stands for:
      - Consistency
      - Availability
      - Partition tolerance
  """;
//  ^ the edge; all spaces to the left are ignored
}

/*
CAP theorem stands for:
  - Consistency
  - Availability
  - Partition tolerance
*/
```

### Creating From Other Types

It's also possible to construct strings from other types:

```java
char[] letters = new char[] { 'D', 'e', 's', 'i', 'g', 'n' };
String lettersStr = new String(letters); // "Design"

// Creating strings from primitive types
String intStr     = String.valueOf(111);   // "111"
String floatStr   = String.valueOf(3.14f); // "3.14"
String booleanStr = String.valueOf(false); // "false"
```

Calling `String.valueOf` with an object invokes the object's `toString()` method:

```java
Date date = new Date();

// Equivalent for non-null values:
String d1 = String.valueOf(date); // "Wed Apr 22 23:16:59 CEST 2026"
String d2 = date.toString();      // "Wed Apr 22 23:16:59 CEST 2026"

// But differs when the value is null:
Date empty = null;
String e1 = String.valueOf(empty); // "null"  (safe)
String e2 = empty.toString();      // NullPointerException!
```

### Format String

The static `String.format(String format, Object... args)` method allows you to build a new string from a template (called a **_format string_**), filled with any number of arguments. Arguments are inserted via **_format specifiers_**, which follow this syntax:

`%[flags][width][.precision]conversion`

- `conversion` — the argument type:
  - `b` (Boolean), `c` (Character), `d` (Integer), `e` (Scientific notation), `f` (Float), `s` (String)
- `flags` — format-specific options:
  - `-` (left-align), `+` (include sign), `0` (pad with zeros), `,` (grouping separators), `(` (parentheses for negatives), ` ` (space for positive sign)
- `width` — total minimum number of characters
- `precision` — number of digits to the right of the decimal point

```java
// 3.141593 3.141593e+00 3.141592653589793 true
String.format("%f %e %s %b", Math.PI, Math.PI, Math.PI, Math.PI);

// '3.142' '+3.1416' ' 3.1416'
String.format("'%.3f' '%+1.4f' '% 1.4f'", Math.PI, Math.PI, Math.PI);

// Right: '  3.14', Left: '3.14  ', Padded: '003.14'
String.format("Right: '%6.2f', Left: '%-6.2f', Padded: '%06.2f'", Math.PI, Math.PI, Math.PI);

String.format("%.4f %(.4f", -Math.PI, -Math.PI); // -3.1416 (3.1416)
String.format("%,d", 1999000000);                // 1,999,000,000

String.format("%b or %b", true, false); // true or false
// null is false, but Date is true
String.format("null is %b, but Date is %b", null, new Date());

// Fri Apr 24 21:10:01 CEST 2026 is a GOOD date
String.format("%s is a %s date", new Date(), "GOOD");
String.format("Today is %.3s", new Date()); // Today is Fri
```

{{< details "**Failed attempt: template strings**" >}}

To improve string formatting, Java 21 introduced a preview feature called template strings:

```java
String message = STR."\{user} has chosen option '\{option}'";
```

However, the feature was completely removed in Java 23 due to concerns about its processor-centric design, complexity, and unresolved design decisions.

You can read more about it on [Oracle - String Templates](https://docs.oracle.com/en/java/javase/21/language/string-templates.html) and in the [JEP 459 update post](https://mail.openjdk.org/pipermail/amber-spec-experts/2024-April/004106.html).

{{< /details >}}

## String Pool

The **String Pool** (also called the *intern pool*) is a special memory region inside the heap where the JVM stores string literals. It's a cache that avoids creating duplicate string objects with the same content.

When you write `String a = "Hello"` and later `String b = "Hello"`, the JVM doesn't allocate two separate objects — it reuses the same one from the pool, so `a == b` evaluates to `true`. This saves memory by ensuring that identical literals share a single instance.

```java
String a = "Hello";
String b = "Hello";
System.out.println(a == b);      // true  — same object from the pool
System.out.println(a.equals(b)); // true  — same content
```

However, strings created with `new String(...)` bypass the pool entirely and always produce a fresh heap object:

```java
String c = new String("Hello");
System.out.println(a == c);      // false — different objects
System.out.println(a.equals(c)); // true  — same content
```

This is exactly why you should **always compare strings with `.equals()`** rather than `==`. The `==` operator checks reference equality (same object), not value equality (same content).

You can manually push a string into the pool by calling `.intern()` on it. This returns the existing pooled instance if one exists, or adds the string to the pool and returns it:

```java
String d = new String("Hello").intern();
System.out.println(a == d); // true — now points to the pooled instance
```

## String Methods

<div class="table-compact">

| Method | Description | Example |
| --- | --- | --- |
| `char charAt()` | Returns the character at the specified index | `"hello".charAt(0) -> 'h'` |
| `int compareTo()` | Compares the string to another string lexicographically | `"A".compareTo("z") -> -57` |
| `int compareToIgnoreCase()` | Compares two strings lexicographically, ignoring case | `"A".compareToIgnoreCase("z") -> -25` |
| `String concat()` | Appends another string to the end of this string | `"foo".concat("bar") -> "foobar"` |
| `boolean contains()` | Checks whether the string contains the specified sequence | `"hello".contains("ell") -> true` |
| `String copyValueOf()` | Returns a string equivalent to the specified character array | `String.copyValueOf(new char[]{'h','i'}) -> "hi"` |
| `boolean endsWith()` | Checks whether the string ends with the specified suffix | `"hello".endsWith("lo") -> true` |
| `boolean equals()` | Compares the string with another string | `"hi".equals("hi") -> true` |
| `boolean equalsIgnoreCase()` | Compares the string with another string, ignoring case | `"Hello".equalsIgnoreCase("hello") -> true` |
| `byte[] getBytes()` | Encodes the string into a byte array | `"hi".getBytes() -> [104, 105]` |
| `void getChars()` | Copies characters from the string into a character array | `"hello".getChars(0, 3, buf, 0)` |
| `int hashCode()` | Returns the hash code for the string | `"hello".hashCode() -> 99162322` |
| `int indexOf()` | Returns the index of the first occurrence of a character or substring | `"hello".indexOf('l') -> 2` |
| `String intern()` | Returns the canonical pooled instance of the string | `new String("hi").intern() -> pooled "hi"` |
| `String join()` | Joins multiple strings with a delimiter | `String.join(", ", "a", "b", "c") -> "a, b, c"` |
| `boolean isBlank()` | Returns `true` if the string is empty or contains only whitespace | `"   ".isBlank() -> true` |
| `boolean isEmpty()` | Returns `true` if the string has zero length | `"".isEmpty() -> true` |
| `int lastIndexOf()` | Returns the index of the last occurrence of a character or substring | `"hello".lastIndexOf('l') -> 3` |
| `int length()` | Returns the number of characters in the string | `"hello".length() -> 5` |
| `Stream<String> lines()` | Returns a stream of lines split by line terminators | `"a\nb".lines() -> ["a", "b"]` |
| `boolean matches()` | Returns `true` if the entire string matches the given regex | `"hello".matches("[a-z]+") -> true` |
| `boolean regionMatches()` | Checks whether a region of this string matches a region of another | `"hello".regionMatches(0, "hello world", 0, 5) -> true` |
| `String repeat()` | Returns the string repeated a given number of times | `"ab".repeat(3) -> "ababab"` |
| `String replace()` | Replaces all occurrences of a character or substring | `"hello".replace('l', 'r') -> "herro"` |
| `String replaceAll()` | Replaces all substrings matching a regex with a replacement | `"a1b2".replaceAll("[0-9]", "#") -> "a#b#"` |
| `String replaceFirst()` | Replaces the first substring matching a regex with a replacement | `"a1b2".replaceFirst("[0-9]", "#") -> "a#b2"` |
| `String[] split()` | Splits the string around matches of the given regex | `"a,b,c".split(",") -> ["a","b","c"]` |
| `boolean startsWith()` | Checks whether the string begins with the specified prefix | `"hello".startsWith("he") -> true` |
| `String strip()` | Removes leading and trailing whitespace (Unicode-aware) | `"  hi  ".strip() -> "hi"` |
| `String stripLeading()` | Removes leading whitespace | `"  hi  ".stripLeading() -> "hi  "` |
| `String stripTrailing()` | Removes trailing whitespace | `"  hi  ".stripTrailing() -> "  hi"` |
| `String substring()` | Returns a substring between the given indices | `"hello".substring(1, 3) -> "el"` |
| `char[] toCharArray()` | Converts the string to a character array | `"hi".toCharArray() -> ['h','i']` |
| `String toLowerCase()` | Converts all characters to lowercase | `"HELLO".toLowerCase() -> "hello"` |
| `String toString()` | Returns the string itself | `"hello".toString() -> "hello"` |
| `String toUpperCase()` | Converts all characters to uppercase | `"hello".toUpperCase() -> "HELLO"` |
| `String trim()` | Removes leading and trailing characters with code point ≤ 32 | `"  hi  ".trim() -> "hi"` |
| `String valueOf()` | Returns the string representation of the given value | `String.valueOf(42) -> "42"` |

</div>

## StringBuilder

The [`StringBuilder`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/StringBuilder.html) class lets you work with strings as mutable objects. Internally it maintains a variable-length `char[]` array. That array can be modified in-place through various operations, which gives a significant performance benefit over repeated string concatenation — each `+` on a regular `String` creates a new object, while `StringBuilder` keeps modifying the same buffer.

Apart from `length`, `StringBuilder` also exposes a `capacity` property — the size of the pre-allocated buffer. It expands automatically when needed, similar to how `ArrayList` works. By default, a new `StringBuilder` starts with 16 extra characters of capacity (though you can specify a custom value).

```java
var sb = new StringBuilder();    // length =  0, capacity = 16
sb.append("software design");    // length = 15, capacity = 16
sb.append(":)");                 // length = 17, capacity = 34 (auto-expanded)

var cap = new StringBuilder(99); // length =  0, capacity = 99
```

{{< alert icon="📝" context="info" >}}
There is also a [`StringBuffer`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/StringBuffer.html) class, which is a thread-safe version of `StringBuilder`. Unless you are working in a concurrent context, prefer `StringBuilder` because `StringBuffer` carries synchronization overhead you don't need.
{{< /alert >}}

### StringBuilder Methods

> The key difference from **String** methods is that most **StringBuilder** methods return `this` (the same object), which enables method chaining like `sb.append("a").append("b").reverse()`.

<div class="table-compact">

| Method | Description | Example |
| --- | --- | --- |
| `StringBuilder append()` | Appends a value to the end of the sequence | `sb.append("hi") -> "hello hi"` |
| `StringBuilder appendCodePoint()` | Appends the string representation of a Unicode code point | `sb.appendCodePoint(72) -> "H"` |
| `int capacity()` | Returns the current capacity of the buffer | `new StringBuilder().capacity() -> 16` |
| `char charAt()` | Returns the character at the specified index | `sb.charAt(0) -> 'h'` |
| `IntStream chars()` | Returns a stream of char values from the sequence | `sb.chars() -> IntStream of char values` |
| `int codePointAt()` | Returns the Unicode code point at the specified index | `sb.codePointAt(0) -> 104` |
| `StringBuilder delete()` | Removes characters in the specified range | `sb.delete(1, 3) -> removes chars at index 1 and 2` |
| `StringBuilder deleteCharAt()` | Removes the character at the specified index | `sb.deleteCharAt(0) -> removes first char` |
| `void ensureCapacity()` | Ensures the buffer has at least the specified capacity | `sb.ensureCapacity(50)` |
| `void getChars()` | Copies characters from the sequence into a character array | `sb.getChars(0, 3, buf, 0)` |
| `int indexOf()` | Returns the index of the first occurrence of a substring | `sb.indexOf("lo") -> 3` |
| `StringBuilder insert()` | Inserts a value at the specified position | `sb.insert(2, "XY") -> inserts "XY" at index 2` |
| `int lastIndexOf()` | Returns the index of the last occurrence of a substring | `sb.lastIndexOf("l") -> 3` |
| `int length()` | Returns the length of the character sequence | `sb.length() -> 5` |
| `int offsetByCodePoints()` | Returns the index offset by a given number of code points | `sb.offsetByCodePoints(0, 2) -> 2` |
| `StringBuilder replace()` | Replaces characters in the specified range with a given string | `sb.replace(0, 2, "Hi") -> replaces chars 0–1 with "Hi"` |
| `StringBuilder reverse()` | Reverses the character sequence | `sb.reverse() -> "olleh" (from "hello")` |
| `void setCharAt()` | Sets the character at the specified index | `sb.setCharAt(0, 'H') -> changes first char to 'H'` |
| `void setLength()` | Sets the length of the character sequence, truncating or padding with null chars | `sb.setLength(3) -> truncates to first 3 chars` |
| `CharSequence subSequence()` | Returns a subsequence of the character sequence | `sb.subSequence(1, 3) -> "el"` |
| `String substring()` | Returns a substring of the character sequence | `sb.substring(1, 3) -> "el"` |
| `String toString()` | Converts the `StringBuilder` to a `String` | `sb.toString() -> "hello"` |
| `void trimToSize()` | Trims the capacity to the current length | `sb.trimToSize() -> capacity set to length` |

</div>
