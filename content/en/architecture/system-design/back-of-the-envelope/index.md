---
title: "Back-of-the-Envelope"
description: ""
lead: ""
date: 2024-04-18T20:53:06+02:00
lastmod: 2024-04-18T20:53:06+02:00
draft: false
images: []
menu:
  architecture:
    parent: ""
    identifier: "back-of-the-envelope-4d5fcde182455ad2f535ddd8ecb31971"
weight: 10
toc: true
type: docs
layout: single
---

The Back-of-the-Envelope technique is used to estimate system's capacity or performance requirements. This rough calculation helps to identify potential bottlenecks in the proposed solution.

## Important Numbers

### Power of two

| Power | Approximate value | Full name | Short name |
| --- | --- | --- | --- |
| 10 | 1 Thousand | 1 Kilobyte | 1 KB |
| 20 | 1 Million | 1 Megabyte | 1 MB |
| 30 | 1 Billion | 1 Gigabyte | 1 GB |
| 40 | 1 Trillion | 1 Terabyte | 1 TB |
| 50 | 1 Quadrillion | 1 Petabyte | 1 PB |

### Latency numbers

| Operation name | Time |
| --- | --- |
| L1 cache reference | 0.5 ns |
| Branch mispredict | 5 ns |
| L2 cache reference | 7 ns |
| Mutex lock/unlock | 100 ns |
| Main memory reference | 100 ns |
| Compress 1K bytes with Zippy | 10,000 ns = 10 µs |
| Send 2K bytes over 1 Gbps network | 20,000 ns = 20 µs |
| Read 1 MB sequentially from memory | 250,000 ns = 250 µs |
| Round trip within the same datacenter | 500,000 ns = 500 µs |
| Disk seek | 10,000,000 ns = 10 ms |
| Read 1 MB sequentially from the network | 10,000,000 ns = 10 ms |
| Read 1 MB sequentially from disk | 30,000,000 ns = 30 ms |
| Send packet CA (California) ->Netherlands->CA | 150,000,000 ns = 150 ms |

> 1 ns (nanosecond) = 10^-9 seconds<br/>
1 µs (microsecond) = 10^-6 seconds = 1,000 ns<br/>
1 ms (millisecond) = 10^-3 seconds = 1,000 µs = 1,000,000 ns<br/>

#### Conclusions:

- Memory is fast but the disk is slow
- Avoid disk seeks if possible
- Simple compression algorithms are fast
- Compress data before sending it over the internet if possible
- Data centers are usually in different regions, and it takes time to send data between them

### Availability Numbers

**High availability** is the ability of the system to be continuously operating for a desirable long period of time.

- SLA (service level agreement) is an agreement between a service provider and a client that defines the level of uptime the service will deliver.

| Availability % | Downtime per day | Downtime per week | Downtime per month | Downtime per year |
| --- | --- | --- | --- | --- |
| 99% | 14.40 minutes | 1.68 hours | 7.31 hours | 3.65 days |
| 99.99% | 8.64 seconds | 1.01 minutes | 4.38 minutes | 52.60 minutes |
| 99.999% | 864.00 | 6.05 seconds | 26.30 seconds | 5.26 minutes |
| 99.9999% | 86.40 milliseconds | 604.80 | 2.63 seconds | 31.56 seconds |

## Estimation Types

### 1. Load Estimation

Predicts the expected number of requests per second (**RPS**), data volume, or user traffic for the system.

{{< alert icon="📒" context="info" >}}
**Assumption**

Social media platform with 300 million monthly users and 50% of users use the platform daily. There are an average of 10 posts per user per day.
{{< /alert >}}

{{< alert icon="🧮" context="success" >}}
**Calculation**

Daily active users (DAU): 300M * 50% = 150M<br/>
Daily generated posts: 150M DAU * 10 posts/user = 1.5B posts/day<br/>
Requests per seconds (RPS): 1.5B posts/day / 86,000 sec/day ~= 17,500 req/sec
{{< /alert >}}

> 1 million requests / day = ~12 requests / second<br/>
Seconds in a day = 24h * 60m * 60s = 86400 = ~100,000 seconds

### 2. Storage Estimation

Estimate the amount of storage required to handle the generated data by the system.

{{< alert icon="📒" context="info" >}}
**Assumption**

Media sharing app with 500 million users and an average of 2 assets uploaded per day. An average asset size is 2MB.
{{< /alert >}}

{{< alert icon="🧮" context="success" >}}
**Calculation**

500M users * 2 assets/user * 2MB asset = 2 billion MB / day ~= 2 PB / day
{{< /alert >}}

> Single Char = 2 bytes<br/>
Long/Double = 8 bytes<br/>
Average resolution Image = 300 KB<br/>
Good resolution Image = 3 MB<br/>
Standard videos for streaming = 100 MB per minute of video

### 3. Bandwidth Estimation

Determines the network bandwidth needed to support the expected traffic and data transfer.

{{< alert icon="📒" context="info" >}}
**Assumption**

Streaming service with 100 million users streaming 1080p videos at Mbps.
{{< /alert >}}

{{< alert icon="🧮" context="success" >}}
**Calculation**

10 million users * 4 Mbps = 40,000,000 Mbps
{{< /alert >}}

### 4. Latency Estimation

Predict the response time and latency of the system based on its architecture and components.

{{< alert icon="📒" context="info" >}}
**Assumption**

An API that fetches statistics from 3 different sources, and the average latency per each source is 50ms, 100ms, and 200ms, respectively.
{{< /alert >}}

{{< alert icon="🧮" context="success" >}}
**Calculation**

Sequential fetching: 50ms + 100ms + 200ms = 350ms<br/>
Parallel fetching: max(50ms, 100ms, 200ms) = 200ms
{{< /alert >}}

### 5. Resource Estimation

Estimate the number of servers, instances, CPUs, or memory required to handle the load and maintain desired performance levels.

{{< alert icon="📒" context="info" >}}
**Assumption**

A web app that receives 10,000 requests/second, with each request requiring 10ms of CPU time. Each CPU core can handle 1,000 ms of processing per second.
{{< /alert >}}

{{< alert icon="🧮" context="success" >}}
**Calculation**

Total CPU time per seconds: 10,000 RPS * 10 ms/request = 100,000 ms/second<br/>
Required CPU cores: 100,000 ms/second / 1,000 ms/core = 100 CPU cors 
{{< /alert >}}

## Resources

- 📝 [ByteByteGo - Back-of-the-envelope Estimation](https://bytebytego.com/courses/system-design-interview/back-of-the-envelope-estimation)
- 📝 [Design Gurus - Back-of-the-Envelope Calculation in System Design Interviews](https://www.designgurus.io/blog/back-of-the-envelope-system-design-interview)
- 📝 [Latency Numbers Every Programmer Should Know](https://gist.github.com/jboner/2841832)
- 🌐 [Visualization of Latency Numbers](https://colin-scott.github.io/personal_website/research/interactive_latency.html)
