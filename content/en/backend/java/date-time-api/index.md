---
title: "Date Time API"
description: "Overview of the Java Date-Time API and its core classes"
lead: "Overview of the Java Date-Time API and its core classes"
date: 2026-04-25T11:39:00+02:00
lastmod: 2026-04-25T11:39:00+02:00
draft: false
menu:
  backend:
    parent: ""
    identifier: "date-time-api-c186b675286e60238bb589050db5baa4"
weight: 70
toc: true
type: docs
layout: single
---

## Overview

Java provides a set of APIs to simplify working with dates and times. The Date-Time API uses the Gregorian calendar as its default representation for date and time (ISO-8601).

Most Date-Time objects are **immutable**, which makes them thread-safe by definition. Modified values are returned as new object instances rather than mutating the original.

The `java.time` package, introduced in Java 8, provides a comprehensive set of classes covering the majority of date-related operations. It replaces the deprecated `Date` and `Calendar` classes, which had design problems and lacked important features.

{{< alert context="info" >}}
Alternative calendar systems are available in the [`java.time.chrono`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/chrono/package-summary.html) package.
{{< /alert >}}

### Packages

- [`java.time`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/package-summary.html). Core package including classes for date, time, time zones, instants, durations, and clocks.
- [`java.time.chrono`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/chrono/package-summary.html). Calendar systems not based on the default ISO-8601 (for example, Japanese and Thai Buddhist calendars).
- [`java.time.format`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/format/package-summary.html). Date-time parsing and formatting.
- [`java.time.temporal`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/temporal/package-summary.html). Provides access to date and time using fields, units, and date-time adjusters. Primarily used for frameworks and custom libraries.
- [`java.time.zone`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/zone/package-summary.html). Support for time zones, their offsets, and rules.

### Naming Conventions

By design, the Date-Time API method names follow a consistent naming convention across different classes.

| Prefix | Method Type | Use |
| --- | --- | --- |
| `of` | **static** | Creates an instance where the factory primarily validates the input parameters rather than converting them. |
| `from` | **static** | Converts the input parameters to an instance of the target class, which may involve losing information from the input. |
| `parse` | **static** | Parses an input string to produce an instance of the target class. |
| `format` | **instance** | Uses the specified formatter to format the values in the temporal object to produce a string. |
| `get` | **instance** | Returns a part of the target object's state. |
| `is` | **instance** | Queries the state of the target object. |
| `with` | **instance** | Returns a copy of the target object with one element changed; this is the immutable equivalent of a setter on a JavaBean. |
| `plus` | **instance** | Returns a copy of the target object with an amount of time added. |
| `minus` | **instance** | Returns a copy of the target object with an amount of time subtracted. |
| `to` | **instance** | Converts this object to another type. |
| `at` | **instance** | Combines this object with another. |

## Initialization

There are two ways to represent time — *human time* (year, month, day, hour, etc.) and *machine time* (nanoseconds elapsed since an origin point, called the epoch). Choosing the right class depends on which aspect of time you need (date, time, or time zone).

### Date-Time Representation

Here is a summary of the temporal classes provided by the Date-Time API:

| Class/Enum | Content | String representation |
| --- | --- | --- |
| [Instant](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/Instant.html) | Seconds and nanoseconds since epoch | `2026-04-26T17:07:30.941491Z` |
| [LocalDate](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/LocalDate.html) | Year, Month, Day | `2026-04-26` |
| [LocalTime](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/LocalTime.html) | Hour, Min, Sec | `19:09:13.396470` |
| [Month](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/Month.html) (enum) | Month | `MAY` |
| [MonthDay](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/MonthDay.html) | Month, Day | `--04-26` |
| [Year](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/Year.html) | Year | `2026` |
| [YearMonth](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/YearMonth.html) | Year, Month | `2026-04` |
| [DayOfWeek](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/DayOfWeek.html) | Day | `MONDAY` |
| [LocalDateTime](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/LocalDateTime.html) | Year, Month, Day, Hour, Min, Sec | `2026-04-26T19:09:13.396470` |
| [OffsetTime](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/OffsetTime.html) | Hour, Min, Sec, Zone Offset | `19:19:58.823558+02:00` |
| [OffsetDateTime](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/OffsetDateTime.html) | Year, Month, Day, Hour, Min, Sec, Zone Offset | `2026-04-26T19:19:01.928752+02:00` |
| [ZonedDateTime](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/ZonedDateTime.html) | Year, Month, Day, Hour, Min, Sec, Zone Offset, Zone ID | `2026-04-26T19:10:58.471238+02:00[Europe/Warsaw]` |
| [Duration](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/Duration.html) | Day, Hour, Min, Sec | `PT20H` (20 hours) |
| [Period](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/Period.html) | Year, Month, Day | `P10D` (10 days) |

### Enums

- **[DayOfWeek](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/DayOfWeek.html)** consists of 7 constants from `MONDAY` (1) to `SUNDAY` (7). It also provides helpful methods for working with its values:

```java
DayOfWeek.MONDAY.plus(1); // TUESDAY
DayOfWeek.TUESDAY.minus(3); // SATURDAY

DayOfWeek.WEDNESDAY.getDisplayName(TextStyle.FULL, Locale.US);   // Wednesday
DayOfWeek.WEDNESDAY.getDisplayName(TextStyle.NARROW, Locale.US); // W
DayOfWeek.WEDNESDAY.getDisplayName(TextStyle.SHORT, Locale.US);  // Wed
```

- **[Month](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/Month.html)** consists of 12 constants from `JANUARY` (1) to `DECEMBER` (12) and provides handy methods:

```java
Month.MAY.maxLength(); // 31

Month.MAY.getDisplayName(TextStyle.SHORT, Locale.US);    // May
Month.MAY.getDisplayName(TextStyle.NARROW, Locale.US);   // M
Month.AUGUST.getDisplayName(TextStyle.SHORT, Locale.US); // Aug
```

### Date

There are 4 classes for representing date information without storing a specific time or time zone: `LocalDate`, `YearMonth`, `MonthDay`, and `Year`. They come with methods for retrieving extra information about the stored dates.

#### LocalDate

`LocalDate` represents a year-month-day in the ISO calendar. It's useful for storing specific dates without concern for the exact time.

```java
// Constructors (for "2026-04-28")
LocalDate.now();
LocalDate.of(2026, Month.APRIL, 28);
LocalDate.of(2026, 4, 28);
LocalDate.parse("2026-04-28");
LocalDate.ofYearDay(2026, 118);

// Methods
date.getDayOfWeek(); // TUESDAY
date.getDayOfYear(); // 118
LocalDate.of(2023, Month.APRIL, 28).getEra(); // CE
LocalDate.of(-2000, Month.APRIL, 28).getEra(); // BCE
```

#### YearMonth

`YearMonth` represents a specific month within a specific year. Because it knows the exact year, it can determine the correct number of days in that month (accounting for leap years, for example).

```java
// Constructors
YearMonth.now();                        // 2026-04
YearMonth.of(2026, 1);                  // 2026-01
YearMonth.of(2026, Month.FEBRUARY);     // 2026-02
YearMonth.parse("2024-03");             // 2024-03

// Methods
YearMonth.of(2026, Month.FEBRUARY).isLeapYear();    // false
YearMonth.of(2026, Month.FEBRUARY).lengthOfYear();  // 365
YearMonth.of(2026, Month.FEBRUARY).lengthOfMonth(); // 28

YearMonth.of(2028, Month.FEBRUARY).isLeapYear();    // true
YearMonth.of(2028, Month.FEBRUARY).lengthOfYear();  // 366
YearMonth.of(2028, Month.FEBRUARY).lengthOfMonth(); // 29
```

### Date & Time

#### LocalTime

`LocalTime` stores only the time of day, without a date. It's a good fit for representing things like business hours, the scheduled time for a recurring task, or a countdown.

```java
// Constructors
LocalTime.now();                    // 10:30:59.146659
LocalTime.of(10, 30);               // 10:30
LocalTime.of(10, 30, 59);           // 10:30:59
LocalTime.of(10, 30, 59, 385);      // 10:30:59.000000385
LocalTime.parse("10:30:59.123456"); // 10:30:59.123456
LocalTime.of(25, 0); // DateTimeException: Invalid value for HourOfDay (valid values 0 - 23): 25
```

#### LocalDateTime

[`LocalDateTime`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/LocalDateTime.html) stores both date and time, but without any time zone information. As the name suggests, it combines `LocalDate` and `LocalTime`. Its primary use case is representing specific local events (in local time). It's also a common choice on the server side when the server operates in UTC and does not need to track time zones.

```java
// Constructors
LocalDateTime.now(); // 2026-04-28T23:54:36.956841
LocalDateTime.of(LocalDate.now(), LocalTime.now()); // from a date and time

LocalDateTime.of(
  int year,
  [int | Month] month, // 1-12 or Month enum
  int dayOfMonth,
  int hour,
  int minute,
  [int second,]        // optional
  [int nanoOfSecond]   // optional
);

// Methods
LocalDateTime datetime = LocalDateTime.now(); // 2026-04-29T00:02:13.075615
datetime.toLocalDate(); // 2026-04-29
datetime.toLocalTime(); // 00:02:13.075615
```

## Instant

The [`Instant`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/Instant.html) class represents a single point on the timeline measured in nanoseconds. It is typically used to record timestamps. It counts time from the [**EPOCH**](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/Instant.html#EPOCH) (1970-01-01T00:00:00Z) and stores the value as a `long` for epoch-seconds and an `int` for the nanosecond adjustment, because the full nanosecond precision does not fit in a single `long`.

> An instant captured before the EPOCH has a negative epoch-second value.

```java
Instant now = Instant.now();
now.getEpochSecond(); // 1777635968 (long)
now.getNano();        // 864807000 (int)
now.toString();       // 2026-05-01T11:46:08.864807Z

Instant.MIN; // -1000000000-01-01T00:00:00Z
Instant.MAX; // +1000000000-12-31T23:59:59.999999999Z
```

`Instant` is machine-oriented and does not expose human calendar fields. To work with human units of time (hours, months, etc.), convert it to an appropriate class first:

```java
Instant now = Instant.now();
now.getMonth(); // ERROR: Cannot resolve method 'getMonth' in 'Instant'

ZoneId zoneId = ZoneId.systemDefault();
LocalDateTime date = LocalDateTime.ofInstant(now, zoneId);
date.getMonth(); // MAY
```

## Time Zone and Offset

A **time zone** is a region of the Earth where the same standard time is used. Each time zone is identified by a `region/city` format and an offset from Greenwich Mean Time (UTC):

- `America/Los_Angeles` (−08:00)
- `Europe/London` (+00:00)
- `Africa/Lagos` (+01:00)
- `Asia/Bangkok` (+07:00)

### Time Zone API

[`ZoneId`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/ZoneId.html) is the primary time zone class. It holds the time zone identifier and provides the rules for converting between an `Instant` and a `LocalDateTime`.

```java
ZoneId defaultZone = ZoneId.systemDefault();
defaultZone.getId();    // Europe/Warsaw
defaultZone.getRules(); // ZoneRules[currentStandardOffset=+01:00]

Set<String> allZones = ZoneId.getAvailableZoneIds();
allZones.size();            // 604
allZones.iterator().next(); // "Asia/Aden"

var event = LocalDateTime.now().truncatedTo(ChronoUnit.HOURS); // 2026-05-01T22:00
event.atZone(ZoneId.of("Asia/Tokyo"));                    // 2026-05-01T22:00+09:00[Asia/Tokyo]
event.atZone(ZoneId.of("Europe/Paris"))
     .withZoneSameInstant(ZoneId.of("Europe/Paris"));     // 2026-05-01T15:00+02:00[Europe/Paris]
```

### Offset API

[`ZoneOffset`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/ZoneOffset.html) represents a fixed offset from UTC without any time zone rules (no daylight saving time adjustments). Use it when you need to store a raw offset rather than a named time zone.

```java
ZoneOffset offset = ZoneOffset.of("+02:00");
ZoneOffset.UTC;   // +00:00
ZoneOffset.MIN;   // -18:00
ZoneOffset.MAX;   // +18:00
```

## Parse and Format

Temporal-based classes provide a `parse()` method for parsing date strings and a `format()` method for converting the stored date to a string representation.

### Date Formatting

The primary formatting class is [`DateTimeFormatter`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/format/DateTimeFormatter.html). It is constructed with a date format pattern and can then be passed to both `parse()` and `format()` methods. It provides many predefined formatters, but custom ones can be defined as well.

`DateTimeFormatter` instances are immutable and thread-safe. It is good practice to store them as static constants.

```java
LocalDateTime now = LocalDateTime.now();
now.format(DateTimeFormatter.ISO_DATE);      // 2026-05-01
now.format(DateTimeFormatter.ISO_TIME);      // 14:17:57.454085
now.format(DateTimeFormatter.ISO_WEEK_DATE); // 2026-W18-5

DateTimeFormatter custom = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm a");
now.format(custom); // 01-05-2026 02:17 PM

try {
  now.format(DateTimeFormatter.ISO_ZONED_DATE_TIME);
} catch (DateTimeException e) {
  // java.time.temporal.UnsupportedTemporalTypeException:
  // Unsupported field: OffsetSeconds
  // LocalDateTime has no zone info — use ZonedDateTime instead
}
```

### Parsing

By default, the `parse()` method on temporal classes uses `ISO_LOCAL_DATE` (or the equivalent local format for that class). To specify a different format, pass a `DateTimeFormatter` as the second argument.

```java
LocalDateTime.parse("2026-05-01T15:34:21"); // 2026-05-01T15:34:21
LocalDateTime.parse("01/05/26 03:34 PM");   // DateTimeParseException: Text '01/05/26 03:34 PM' could not be parsed at index 0

DateTimeFormatter custom = DateTimeFormatter.ofPattern("dd/MM/yy hh:mm a");
LocalDateTime.parse("01/05/26 03:34 PM", custom); // 2026-05-01T15:34
```

## Period and Duration

[`Duration`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/Duration.html) and [`Period`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/Period.html) both represent an amount of time, but at different scales. `Duration` measures time using time-based values (seconds, nanoseconds), while `Period` uses date-based values (years, months, days).

### Duration

`Duration` is well-suited for machine-oriented time measurements, such as capturing the elapsed time between two `Instant` timestamps.

- Can be negative if the start point is later than the end point.
- Does not account for time zones or daylight saving time.

```java
Duration.ofNanos(1_000_000);    // PT0.001S
Duration.ofMillis(1000);        // PT1S
Duration.ofSeconds(600);        // PT10M
Duration.ofSeconds(600, 1000);  // PT10M0.000001S
Duration.ofMinutes(60);         // PT1H
Duration.ofHours(6);            // PT6H
Duration.ofDays(10);            // PT240H

Instant start = Instant.now();
Thread.sleep(2500);
Instant end = Instant.now();
Duration.between(start, end); // PT2.505S
Duration.between(end, start); // PT-2.505S
```

### Period

`Period` uses human-oriented time measurement and provides methods for retrieving individual components (such as `getMonths()` and `getDays()`). The total period is represented by all three units together: years, months, and days.

To make `Period` calculations respect time zone information (such as daylight saving time transitions), use it with `ZonedDateTime` objects.

```java
Period.ofDays(100); // P100D
Period.ofWeeks(8);  // P56D
Period.ofMonths(9); // P9M
Period.ofYears(26); // P26Y

LocalDate issuedAt = LocalDate.of(2000, 7, 10);
Period period = Period.between(issuedAt, LocalDate.now()); // P25Y9M21D
period.getYears();  // 25
period.getMonths(); // 9
period.getDays();   // 21
```

## Date Manipulation

The `java.time` classes provide a consistent set of methods for comparing and modifying dates and times. The desired time unit can be specified using the [`ChronoUnit`](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/temporal/ChronoUnit.html) enum from `java.time.temporal`.

```java
LocalDateTime start = LocalDateTime.now();
LocalDateTime end = start.plus((int)(Math.random() * 100), ChronoUnit.SECONDS);
ChronoUnit.SECONDS.between(start, end); // e.g. 86
```

### Changing Dates

```java
LocalDate date = LocalDate.now();               // 2026-05-01
date.plusDays(10).plusMonths(2).plusYears(3);   // 2029-07-11
date.minusDays(1).minusMonths(5).minusYears(5); // 2020-11-30

LocalTime time = LocalTime.now();                   // 21:27:34.842299
time.truncatedTo(ChronoUnit.HOURS);                 // 21:00
time.plusSeconds(10).plusMinutes(20).plusHours(10); // 07:47:44.842299
time.atDate(LocalDate.now());                       // 2026-05-01T21:27:34.842299
```

### Comparing Dates

```java
LocalDateTime d1 = LocalDateTime.of(2026, 6, 1, 12, 55, 10);
LocalDateTime d2 = LocalDateTime.of(2028, 12, 4, 10, 50, 23);

d1.isEqual(d2);   // false
d1.isAfter(d2);   // false
d1.isBefore(d2);  // true
d2.compareTo(d1); // positive (d2 is after d1)
d1.compareTo(d2); // negative (d1 is before d2)
```

## Resources

- 📝 [Dev.java - The Date Time API](https://dev.java/learn/date-time/)
- 📝 [Oracle Java SE 26 - java.time package](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/package-summary.html)
- 📝 [Baeldung - Introduction to the Java 8 Date/Time API](https://www.baeldung.com/java-8-date-time-intro)

<!--
TODO:
- Which class to use? - decision guide
- TemporalAdjusters
- Clock
- DateTimeFormatterBuilder
-->
