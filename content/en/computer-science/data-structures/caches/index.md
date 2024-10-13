---
title: "Caches"
description: ""
lead: ""
date: 2024-10-12T22:48:58+02:00
lastmod: 2024-10-12T22:48:58+02:00
draft: false
menu:
  computer-science:
    parent: ""
    identifier: "caches-962bfb9441861dcf1d34d72ee148f6b1"
weight: 200
toc: true
type: docs
layout: single
---

**Cache Algorithms** (or **cache replacement policies** / **cache replacement algorithms**) are optimized instructions or strategies for computers and hardware to manage a cache of information. The main purpose of these algorithms is to decide which cached element must be __evicted__ (removed) from the cache when the space is full. It is essential for high-performance software, like operation systems, databases, web servers, etc.

The most common cache replacement algorithms:

- Queue-based Policies
  - **FIFO** (First-In-First-Out)
  - **FILO** (First in last out)
  - **SIEVE**
- Recency-based Policies
  - **LRU** (Least Recently Used)
  - **MRU** (Most Recently Used)
  - **SLRU** (Segmented LRU)
  - **CLOCK** (Second Chance):
- Frequency-based Policies
  - **LFU** (Least Frequently Used)
  - **LFRU** (Least frequent recently used)
- Other
  - **RR** (Random Replacement)
  - **ARC** (Adaptive Replacement Cache)

### Least Recently Used (LRU)

**LRU** picks an item that is least recently used and removes it in order to free space for the new data, when the cache memory is full.

- **Doubly Linked List** allows us to move nodes (representing cache entries) efficiently between the head and the tail.
- **HashMap** provides `O(1)` time complexity for lookups, and the linked list allows `O(1)` time for insertions and deletions from both ends.

{{< tabs "lru" >}}
{{< tab "LRUCache" >}}
```java
import java.util.HashMap;
import java.util.Map;

public class LRUCache<K, V> {
  private int size = 0;
  private int capacity;
  private Node head;
  private Node tail;
  private Map<K, Node> cache = new HashMap<>();

  public LRUCache(int capacity) {
    this.capacity = capacity;
  }

  public V get(K key) {
    // Check the key for existence
    Node node = cache.get(key);
    if (node == null) return null;

    // Evict the value we found and put it to the front
    detach(node);
    prepend(node);

    return node.value; // Return out the found value
  }

  public void put(K key, V value) {
    Node node = cache.get(key);
    if (node == null) {
      node = new Node(key, value);  // Create a new node
      cache.put(key, node);         // Add to cache map
      size++;                       // Increase cache size
      prepend(node);                // Add to the front
      trimCache();                  // Ensure cache non-overflow
    } else {
      // Update and move it to the front
      node.value = value;
      detach(node);
      prepend(node);
    }
  }

  private void trimCache() {
    if (size <= capacity) return;

    cache.remove(tail.key);
    detach(tail);
    size--;
  }
}
```
{{< /tab >}}
{{< tab "Node" >}}
```java
private class Node {
  K key;
  V value;
  Node next;
  Node prev;

  public Node(K key, V value) {
    this.key = key;
    this.value = value;
  }
}
```
{{< /tab >}}
{{< tab "Utils" >}}
```java
public class LRUCache<K, V> {
  /*
   * Detaches a node from the doubly-linked list
   */
  private void detach(Node node) {
    if (node.next != null) node.next.prev = node.prev;
    if (node.prev != null) node.prev.next = node.next;

    if (node == head) head = head.next;
    if (node == tail) tail = tail.prev;

    node.next = null;
    node.prev = null;
  }

  /*
   * Inserts a node at the beginning of the doubly-linked list
   */
  private void prepend(Node node) {
    if (head == null) {
      head = tail = node;
      return;
    }

    node.next = head;
    head.prev = node;
    head = node;
  }
}
```
{{< /tab >}}
{{< /tabs >}}

{{< alert icon="👉" >}}
The complete **LRUCache** implementation and examples are available {{< source "here" "/computer-science/data-structures/LRUCache.java" >}}.
{{< /alert >}}

In Java, **LRU** cache can be implemented using a **LinkedHashMap**, which maintains the insertion order of elements and has the ability to remove the eldest entry when a new entry is added beyond a predefined capacity.

```java
class LRUCache<K, V> extends LinkedHashMap<K, V> {
  @Override
  protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
    return size() > capacity; // Remove the eldest entry if the cache size exceeds the capacity
  }
}
```
