---
title: "Algorithms Analyses"
description: ""
lead: ""
date: 2023-09-03T14:13:23+02:00
lastmod: 2023-09-03T14:13:23+02:00
draft: false
menu:
  computer-science:
    parent: ""
    identifier: "algorithms-analyses-04e47a04294d0bd666a5ca74d322ff3d"
weight: 10
toc: true
type: docs
layout: single
---

## 📐 Algorithm complexity

### Time complexity

**Time complexity** specifies how long it will take to execute an algorithm as a function of its input size. It provides an **upper-bound** on the running time of an algorithm.

### Space complexity

**Space complexity** specifies the total amount of memory required to execute an algorithm as a function of the size of the input.

## 📈 Order Of Growth

### Classifications

| order of growth | name | description | example | 
| --- | --- | --- | --- |
| **1** | Constant | statement | add two numbers |
| **log N** | Logarithmic | divide in half | binary search |
| **N** | Linear | loop | find the maximum |
| **N log N** | Linearithmic | divide and conquer | mergesort |
| **N<sup>2</sup>** | Quadratic | double loop | check all pairs |
| **N<sup>3</sup>** | Cubic | triple loop | check all triples |
| **2<sup>n</sup>** | Exponential | exhaustive search | check all subsets |

![Time Complexity Chart](time-complexity-chart.png)

### Simplification

1. **Drop constants.** Constants do not affect the algorithm's growth rate relative to its input.

{{< alert >}}
O(3n<sup>2</sup>) -> O(n<sup>2</sup>)
{{</ alert>}}


2. **Lower-Order terms.** There is a focus on the _dominant term_ that contributes the most to the growth rate.

{{< alert >}}
O(n<sup>2</sup> + 5n + 10) -> O(n<sup>2</sup>)
{{</ alert>}}

3. **Use Summation for Multiple operations.** Multiple operations with a different time complexity can be summed.

{{< alert >}}
O(n) and O(log n) -> O(n + log n) -> O(n) (because of the _dominant term_)
{{</ alert>}}

4. **Drop Non-Dominant Terms in Additions.** We need to leave only the terms that dominate the growth rate.

{{< alert >}}
O(n<sup>2</sup> + n) -> O(n<sup>2</sup>)
{{</ alert>}}

5. **Multiplication rule for Nested arrays.**

{{< alert >}}
O(n) loop with a nested O(m) loop -> O(n * m)
{{</ alert>}}

6. **Consider the Worst-Case Scenario.** Big O notation focuses on the worst-case scenarios, so it needs to be simplified based on the worst-case analysis.

## 🔭 Asymptotic Notations

There are mathematical notations used to describe an algorithm's performance in relation to the amount of input data:

- **Big O** - worst case (upper-bound on cost)
- **Big Ω** (Omega) - best case (lower-bound on cost)
- **Big Θ** (Theta) - average case ("expected" cost)

### Big O

**Big O** notation represents an algorithm's <u>worst-case</u> complexity. It defines how the performance of the algorithm will change as an input size grows.

## Resources

- 📝 [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
- 📝 [Big O Cheat Sheet – Time Complexity Chart](https://www.freecodecamp.org/news/big-o-cheat-sheet-time-complexity-chart/)
