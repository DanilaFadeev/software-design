---
title: "SOLID"
description: ""
lead: "SOLID is a set of rules and practices for Object-Oriented system design"
date: 2023-07-01T12:03:03+03:00
lastmod: 2023-07-01T12:03:03+03:00
draft: false
images: []
menu:
  architecture:
    parent: "design-principles"
    identifier: "solid-9e516ef8c15e178399ea94745505346e"
weight: 310
toc: true
type: docs
layout: single
---

**SOLID** describes the basic principles of designing Object-Oriented programs and was initially introduced by Robert Martin (a.k.a Uncle Bob) in 2000.

**SOLID** is an acronym meaning the following statements:

- **S**ingle Responsibility principle 
- **O**pen-Closed principle
- **L**iskov Substitution principle
- **I**nterface Segregation principle
- **D**ependency Inversion principle

## 👷‍♂️ Single Responsibility

{{< alert context="info" >}}
A class should **do exactly one thing** and, therefore, have only **one reason to change**.
{{< /alert >}}

### Problem

Assuming we design a bookstore application that stores book details and produces invoices that can be printed or saved.

The first simple implementation might look like below:

```typescript
class Book {
  public title: string;
  public author: string;
  public price: number;

  constructor(title: string, author: string, price: number) {}
}

class Invoice {
  constructor(public book: Book, public quantity: number) {}

  public calculateTotalPrice(): number {
    // Calculate the total price based on book and quantity
  }

  public print(): void {
    // Print invoice details to display
  }

  public save(): void {
    // Save invoice details to disk or database
  }
}
```

This implementation violates the **Single Responsibility** principle because the **Invoice** class does more than one thing. It means that it has a few reasons to be changed:

- If we have to change the total _price calculation logic_
- If we need a different print _output format_ or source
- If we want to change a _persistence storage_

### Solution

As soon as the **Invoice** class has more than a single responsibility, we need to split it into separate functional classes doing their own job:

```typescript
class Book {
  public title: string;
  public author: string;
  public price: number;

  constructor(title: string, author: string, price: number) {}
}

class Invoice {
  constructor(public book: Book, public quantity: number) {}

  public calculateTotalPrice(): number {
    // Calculate the total price based on book and quantity
  }
}

class InvoicePrinter {
  constructor(private invoice: Invoice) {}

  public print(): void {
    // Print invoice details to display
  }
}

class InvoicePersistence {
  constructor(private invoice: Invoice) {}

  public save(): void {
    // Save invoice details to disk or database
  }
}
```

## 🔒 Open-Closed

{{< alert context="info" >}}
A class should be **open for extension** and **closed for modification**.
{{< /alert >}}

_Modification_ is a change of the existing class logic, and _extension_ means adding new functionality. To avoid the risks of breaking class dependencies, we should be able to implement a new logic without  changing its underlying codebase.

### Problem

Let's imagine we need to extend the **InvoicePersistence** class with additional persistence storage - a database. The simplest solution would be to add a corresponding method to the existing class.

This approach violates an **Open-Closed** principle because we need to change the codebase of the existing class and add more logic there.

{{< tabs "open-closed-problem-tabs" >}}
{{< tab "Before" >}}
```typescript
class InvoicePersistence {
  constructor(private invoice: Invoice) {}

  public save(): void {
    // Some logic to write into a file goes here
  }
}
```
{{< /tab >}}
{{< tab "After" >}}
```typescript
class InvoicePersistence {
  constructor(private invoice: Invoice) {}

  public saveToFile(): void {
    // Some logic to write into a file goes here
  }

  public saveToDatabase(): void {
    // Some logic to make a DB insert query goes here
  }
}
```
{{< /tab >}}
{{< /tabs >}}

The most significant change here is the renaming of a `save()` method that might be used by other application modules.

### Solution

To avoid changing the initial **InvoicePersistence** by adding more available data storages, we need to declare a generic extendable interface. Every new data storage could be developed in a separate class implementing this interface.

{{< tabs "open-closed-solution-tabs" >}}
{{< tab "Before" >}}
```typescript
class InvoicePersistence {
  constructor(private invoice: Invoice) {}

  public save(): void {
    // Some logic to write into a file goes here
  }
}
```
{{< /tab >}}
{{< tab "After" >}}
```typescript
interface InvoicePersistence {
  save(invoice: Invoice): void;
}

class FileInvoicePersistence implements InvoicePersistence {
  public save(invoice: Invoice): void {
    // Some logic to write into a file goes here
  }
}

class DatabaseInvoicePersistence implements InvoicePersistence {
  public save(invoice: Invoice): void {
    // Some logic to make a DB insert query goes here
  }
}

```
{{< /tab >}}
{{< /tabs >}}

As a result, the application can rely on the **InvoicePersistence** interface without coupling with its concrete implementations.

```typescript
class ApplicationMenu {
  constructor(private storage: InvoicePersistence) {}

  public onSavePress() {
    this.storage.save();
  }
}
```

## 🔀 Liskov Substitution

{{< alert context="info" >}}
Subclasses should be **substitutable** for their base classes.
{{< /alert >}}

A parent class should be replaceable by its child classes without a lack of initial functionality. The subclass should be able to produce the same actions as its parent class. It means the **Child** class should extend the **Parent** methods behavior but not redefine it.

In other words, we can say:

> **Child** class shouldn't require more than its **Parent** class and shouldn't provide less than its **Parent** class.

The most common case that violates the **Liskov Substitution** principle is an inheritance of some class and mocking its particular methods with `NotImplemented` exceptions. This implementation might work in the short term, but after can break when some logic is expecting the actual result from this mock.

### Problem

In this example, we need to write a database connection client that will be used by our system. At the initial stage, our application works only with relational databases.

```typescript
class DatabaseConnection {
  constructor(protected connectionUri: string) {}

  public connect(): void {
    console.log(`Connecting to the ${this.connectionUri} DB`);
  }

  public query(query: string): void {
    console.log(`Fetch data with "${query}" query`);
  }
}

class PostgreSQLConnection extends DatabaseConnection {
  public connect(): void {
    console.log(`Connecting to the PostgreSQL`);
  }

  public query(query: string): void {
    console.log(`Fetch PostgreSQL data with "${query}" query`);
  }
}
```

Meanwhile, we have some additional service that works with the document-oriented MongoDB database. To follow the common `DatabaseConnection` interface, we extend it to implement a new required MongoDB-specific connection.

```typescript
class MongoDBConnection extends DatabaseConnection {
  public connect(): void {
    console.log(`Connecting to the MongoDB`);
  }

  public query(_query: string): void {
    throw new Error(`String query is not supported on MongoDB`)
  }

  public collectionQuery(query: object): void {
    console.log(`Fetch MongoDB data with ${JSON.stringify(query)} query`);
  }
}
```

During the implementation, we realize MongoDB doesn't support string-format queries and requires an object. The only thing we can do is to disable the parent's `query(query: string)` method and create a new `collectionQuery` which is specific for the non-relational database.

The issue appears once an application module relies on the common **DatabaseConnection** class interface and tries to call the `query()` method with a string argument. The logic will not expect that some **DatabaseConnection** implementations can't work with the SQL string queries, and the corresponding operation will fail.

### Solution

The **MongoDBConnection** class violates the **Liskov Substitute** principle because it changes the expected behavior of the `query()` method. The non-relational database connector can’t extend the existing one aimed to work with the relational SQL databases.

We must split these two concepts to have correct interface implementations.

```typescript
class DatabaseConnection {
  constructor(protected connectionUri: string) {}

  public connect(): void {
    console.log(`Connecting to the ${this.connectionUri} DB`);
  }
}

class RelationalDatabaseConnection extends DatabaseConnection {
  public query(query: string): void {
    console.log(`Fetch data with "${query}" query`);
  }
}

class NonrelationalDatabaseConnection extends DatabaseConnection {
  public collectionQuery(query: object): void {
    console.log(`Fetch data with ${JSON.stringify(query)} query`);
  }
}

class PostgreSQLConnection extends RelationalDatabaseConnection {}

class MongoDBConnection extends NonrelationalDatabaseConnection {}
```

After that, the system will know what kind of database it uses. So, it can call an appropriate provided method to run a query.

## 👬 Interface Segregation

{{< alert context="info" >}}
Many client-specific interfaces are better than a single general-purpose interface.
{{< /alert >}}

Clients should not be forced to implement interface definitions they don't need. If the client does not use some method, the changes in this method shouldn’t affect it. It means the clients shouldn't depend on methods they don't use. It helps to avoid changes in the client code when some irrelevant method is updated.

### Problem

UI applications can be implemented using a _server-side rendering_ (SSR) approach or rendered on a client side. We have an application that uses both of them, so we need to reuse some mechanisms in the client and server codebase.

One of these shared modules is a **Router** that allows navigating between the website pages. Most of its methods are similar for server and client, so we decided to declare a single common interface.

```typescript
interface IRouter {
  parseUrl(url: string): URL;
  navigate(route: string): void;
  getQueryParams(url: string): [string, string][];
  addEventListener(event: string, handler: () => void): void;
}
```

This interface fits the **Router** implementation on the client side but is a bit overwhelming for the server. The server application cannot listen to router events, making `addEventListener()` redundant. But as soon as this method is declared in the **IRouter** interface, we must implement it somehow.

```typescript
class ServerRouter implements IRouter {
  parseUrl(url: string): URL {
    return new URL(url);
  }
  navigate(route: string): void {
    fetch(route);
  }
  getQueryParams(url: string): [string, string][] {
    const sort = this.parseUrl(url).searchParams.get('sort') || '';
    return [['sort', sort]];
  }
  addEventListener(_event: string, _handler: () => void): void {
    throw new Error("Method is not supported.");
  }
}
```

As we see, the `addEventListener()` is mocked with the exception, which violates the **Liskov Substitution** principle and means that the **Interface Segregation** is also ignored.

### Solution

To solve the problem, we should split our generic **IRouter** interface into two, which will be appropriate for the particular modules.

```typescript
interface IRouter {
  parseUrl(url: string): URL;
  navigate(route: string): void;
  getQueryParams(url: string): [string, string][];
}

interface IClientRouter extends IRouter {
  addEventListener(event: string, handler: () => void): void;
}
```

Unlike the client, the server doesn't support the `addEventListener()` method, so it shouldn't implement it. We leave all the common methods in the generic **IRouter** interface and create a new one for the client module.

Now, the client and server can use the specific interfaces.

```typescript
class ServerRouter implements IRouter {
  parseUrl(url: string): URL { /* ... */ }
  navigate(route: string): void { /* ... */ }
  getQueryParams(url: string): [string, string][] { /* ... */ }
}

class ClientRouter implements IClientRouter {
  parseUrl(url: string): URL { /* ... */ }
  navigate(route: string): void { /* ... */ }
  getQueryParams(url: string): [string, string][] { /* ... */ }
  addEventListener(event: string, handler: () => void): void { /* ... */ }
}
```

As an alternative option, we can use interface composition over inheritance. As a result, each module will decide which interfaces it follows.

```typescript
interface IRouterNavigator {
  parseUrl(url: string): URL;
  navigate(route: string): void;
  getQueryParams(url: string): [string, string][];
}

interface IRouterListener {
  addEventListener(event: string, handler: () => void): void;
}

class ServerRouter implements IRouterNavigator { /* ... */ }
class ClientRouter implements IRouterNavigator, IRouterListener {/* ... */}
```

## 🥷 Dependency Inversion

{{< alert context="info" >}}
A class should **depend on interfaces or/and abstract classes** rather than concrete classes.
{{< /alert >}}

The class shouldn't be coupled with its dependencies via concrete implementations. It should use an abstract interface instead.

**High-level modules** must not depend on **low-level modules**, but they should depend on abstractions.

### Problem

Our simple application extracts some data from a database and shows it to the user. For the first MVP version, the development team chose the MySQL database to store all the data.

All works as expected so far. But the problem comes when after some time, the team receives a request to switch the database from MySQL to PostgreSQL (it provides more field types, doesn't it?).

{{< tabs "dependency-inversion-problem-tabs" >}}
{{< tab "Before" >}}
```typescript
class MySQLConnection {
  public connect() {
    // Connecting to the MySQL database server
  }

  public query(_query: string) {
    // Run SQL query on the connected MySQL database
  }
}

class TaskManager {
  constructor(private mySqlConnection: MySQLConnection) {
    mySqlConnection.connect();
  }

  public showTasks(): void {
    const query = 'SELECT * FROM tasks';
    const tasks = this.mySqlConnection.query(query);

    console.table(tasks);
  }
}

const mySqlConnection = new MySQLConnection();
const taskManager = new TaskManager(mySqlConnection);
taskManager.showTasks();
```
{{< /tab >}}
{{< tab "After" >}}
```typescript
class PostgreSQLConnection {
  public connect() {
    // Connecting to the PostgreSQL database server
  }

  public query(_query: string) {
    // Run SQL query on the connected PostgreSQL database
  }
}

class TaskManager {
  constructor(private postgreSQLConnection: PostgreSQLConnection) {
    postgreSQLConnection.connect();
  }

  public showTasks(): void {
    const query = 'SELECT * FROM tasks';
    const tasks = this.postgreSQLConnection.query(query);

    console.table(tasks);
  }
}

const postgreSQLConnection = new PostgreSQLConnection();
const taskManager = new TaskManager(postgreSQLConnection);
taskManager.showTasks();
```
{{< /tab >}}
{{< /tabs >}}

We need to rewrite both existing classes to adjust the namings and rewrite the database connection implementation to follow the requirement.

### Solution

To not violate the **Dependency Inversion** principle, the **TaskManager** class shouldn't rely on a concrete database connection implementation. It should work with the concrete class via a generic interface that describes provided operations.

{{< tabs "dependency-inversion-solution-tabs" >}}
{{< tab "Before" >}}
```typescript
interface DBConnection {
  connect(): void;
  query(query: string): void;
}

class TaskManager {
  constructor(private dbConnection: DBConnection) {
    dbConnection.connect();
  }

  public showTasks(): void {
    const query = 'SELECT * FROM tasks';
    const tasks = this.dbConnection.query(query);

    console.table(tasks);
  }
}

class MySQLConnection implements DBConnection {
  public connect() {
    // Connecting to the MySQL database server
  }

  public query(_query: string) {
    // Run SQL query on the connected MySQL database
  }
}

const connection = new MySQLConnection();
const taskManager = new TaskManager(connection);
taskManager.showTasks();
```
{{< /tab >}}
{{< tab "After" >}}
```typescript
interface DBConnection {
  connect(): void;
  query(query: string): void;
}

class TaskManager {
  constructor(private dbConnection: DBConnection) {
    dbConnection.connect();
  }

  public showTasks(): void {
    const query = 'SELECT * FROM tasks';
    const tasks = this.dbConnection.query(query);

    console.table(tasks);
  }
}

class PostgreSQLConnection implements DBConnection {
  public connect() {
    // Connecting to the PostgreSQL database server
  }

  public query(_query: string) {
    // Run SQL query on the connected PostgreSQL database
  }
}

const connection = new PostgreSQLConnection();
const taskManager = new TaskManager(connection);
taskManager.showTasks();
```
{{< /tab >}}
{{< /tabs >}}

Connecting **TaskManager** class with the **MySQLConnection** one allows us to easily replace the underlying database connection logic without affecting the business logic. It significantly reduces the number of required codebase changes in case of switching the system's database.

## Examples

{{< alert icon="👉" >}}
The source code of the SOLID example implementations in **TypeScript** is available {{< source "here" "/architecture/design-principles/solid/" >}}.
{{< /alert >}}

## Resources

- 📝 [FreeCodeCamp - The SOLID Principles of Object-Oriented Programming Explained in Plain English](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/)
- 📝 [DigitalOcean - SOLID: The First 5 Principles of Object Oriented Design](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- 📝 [The S.O.L.I.D Principles in Pictures](https://medium.com/backticks-tildes/the-s-o-l-i-d-principles-in-pictures-b34ce2f1e898)
