---
title: "Linked List"
description: ""
lead: ""
date: 2024-02-04T09:49:18+01:00
lastmod: 2024-02-04T09:49:18+01:00
draft: false
menu:
  computer-science:
    parent: ""
    identifier: "linked-list-a6d3167b71b0cd1c90ecf318464c03b0"
weight: 130
toc: true
type: docs
layout: single
---

## Overview

**Linked List** is a dynamic **linear** data structure that stores a collection of data elements.

The **Linked List** consists of the _nodes_. The list _node_ is an object that stores some valuable data and a reference (pointer) to the next node. All the nodes are linked to the list.

![Data Structures - Single Linked List](data-stuctures-singly-linked-list.png)

### Advantages

- **Dynamic memory allocation.** The memory is allocated and de-allocated according to the actual usage. It doesn't use extra space.
- **Constant time Insert/Remove.** Inserts and removes takes constant time, unlike _arrays_. However, it takes `O(N)` time to traverse to the target element.
- **Fundamental structure.** Linked List has a straightforward logic and can be used for other data structures implementation (e.g., Stack, Queue, Graph, and HashMap).

{{< tabs "singly-linked-list-node" >}}
{{< tab "Java" >}}
```java
class Node<E> {
  public E data;
  public Node next;
}
```
{{< /tab >}}
{{< /tabs >}}

### Time Complexity

| Case/Operation | Insert | Remove | Search | 
| -------------- | ------ | ------ | ------ |
| Worst          | `O(1)` | `O(1)` | `O(N)` |

### Common Operations

- **Insertion**
- **Deletion**
- **Traversing**

### Types

The **Linked List** might be implemented in the following ways:

- Singly Linked List
- Doubly Linked List
- Circular Linked List

## Doubly Linked List

**Double-Linked List** contains the nodes with the two pointers - to the previous and next list elements.

![Data Structures - Doubly Linked List](data-stuctures-doubly-linked-list.png)

{{< tabs "double-linked-list-node" >}}
{{< tab "Java" >}}
```java
class Node<E> {
  public E data;
  public Node next;
  public Node prev;
}
```
{{< /tab >}}
{{< /tabs >}}

## Circular Linked List

In the **Circular Linked List**, the last node points to the first node, forming a circular loop.

{{< alert icon="👉" context="info" >}}
The complete **SinglyLinkedList** implementation is available {{< source "here" "/computer-science/data-structures/" >}}.
{{< /alert >}}
