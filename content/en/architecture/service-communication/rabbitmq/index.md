---
title: "RabbitMQ"
description: ""
lead: ""
date: 2020-09-25T08:48:57+00:00
lastmod: 2020-09-25T08:48:57+00:00
draft: false
images: []
menu:
  architecture:
    parent: "service-communication"
weight: 40
toc: true
type: docs
layout: single
---

## Introduction

**RabbitMQ** is an open-source distributed message broker written in Erlang that facilitates
efficient message delivery and complex routing scenarios. RabbitMQ typically runs as a cluster of
nodes where queues are distributed across nodes.

RabbitMQ natively implements **AMQP 0.9.1** and uses plug-ins to offer additional protocols like 
**AMQP 1.0**, **HTTP**, **STOMP**, and **MQTT**. RabbitMQ ecosystem has a lot of client libraries
in different programming languages.

RabbitMQ is perfect for web servers that need rapid request-response. It also shares loads between 
workers under high load (20K+ messages/second). RabbitMQ can also handle background jobs or 
long-running tasks like PDF conversion, file scanning, or image scaling.

The current article explains the basic concepts and features of the RabbitMQ message broker.
RabbitMQ is shipped with **AMQP 0.9.1** protocol, so it's recommended to look at the
[AMQP description](/architecture/service-communication/amqp) first.

## Queues

**Queues** are a buffer that stores messages. In RabbitMQ, queues follow **FIFO** ("First In, First
Out") manner. However, some RabbitMQ features could affect this behavior, and change the way of
receiving queue messages by consumers.

{{< alert icon="❗️" context="warning" >}}
**FIFO** ordering is not guaranteed for **priority** and **sharded queues**.
{{< /alert >}}

**Queue** supports two primary operations: 

- **enqueue** - add an item to the tail of the queue
- **dequeue** - extract an item from the head of the queue

### Optional Arguments

Along with standard **AMQP 0.9.1** queue arguments, RabbitMQ supports a bunch of optional ones
(called `x-arguments`):

| Argument | Description |
| --- | --- |
| `x-queue-type` | Quorum or Classic |
| `x-message-ttl` | TTL (time to live) for queue messages in ms |
| `x-max-length` | Maximum number of messages |
| `x-max-priority` | Declare priority queue and set maximum priority that queue should support |

### Temporary Queues

For some tasks, queues could be short-living and must be deleted once the consumer is disconnected.
There are a few options to make the queue deleted automatically:

- **Exclusive queues**

  Can be only used by its declaring connection. They are automatically deleted when declaring
	connection is closed. It's common to declare them without a name to make the server generate them. 

- **TTL queues**

  Used for data expiration and as a way of limiting the usage of system resources when consumers go
	offline or their throughput falls behind publishers.

- **Auto-delete queues**

  Will be automatically deleted when the last consumer is disconnected. If a queue never had
	consumers it won't be deleted.

### Priority Queues

Queues can have 0 or up to 255 priorities. A queue becomes a priority queue when `x-max-priority` 
argument is passed at the queue declaration time.

Then publishers could specify a **priority** attribute to publishing messages.

{{< alert icon="📝" context="info" >}}
It's recommended to have **up to 10 priorities** because the higher value will consume more resources. 
{{< /alert >}}

## Messages

### Message states

The message in a queue can have one of two states:

- Ready for delivery
- Delivered but not yet acknowledged by consumer

### Messages limit

There is a possibility to specify the length of a queue in bytes or messages count. That's could be
done using queue declaration arguments or via a queue policy. 

See more details at [Queue Length Limit](https://www.rabbitmq.com/maxlength.html).

## Publishers

Publishers publish messages to different destinations depending on the used protocol:

- **AMQP 0-9-1 Publishers** publish to exchanges
- **AMQP 1.0 Publishers** publish on a link
- **MQTT Publishers** publish to topic
- **STOMP Publishers** supports various publish destinations: topics, queues, AMQP 0-9-1 exchanges

Normally, publishers are long-living and usually open their connection during application startup
to publish multiple messages.

### Message Properties

Every delivery has message metadata and delivery information.

{{< details "<b>Delivery information</b> is set by RabbitMQ at routing and delivery time" >}}
| Property | Type | Description |
| --- | --- | --- |
| Delivery tag | Integer | Delivery identifier |
| Redelivered | Boolean | Set to `true` if this message was previously delivered and requeued |
| Exchange | String | Exchange which routed this message |
| Routing key | String | Routing key used by the publisher |
| Consumer tag | String | Consumer (subscription) identifier |
{{< /details >}}


{{< details "<b>Message metadata</b> is set by publishers at the time of publishing" >}}
| Property | Type | Description |
| --- | --- | --- |
| Delivery mode | Enum (1 or 2) |	2 for "persistent", 1 for "transient". Some client libraries expose this property as a boolean or enum. |
| Type | String | Application-specific message type, e.g. "orders.created" |
| Headers | Map (string => any) | An arbitrary map of headers with string header names |
| Content type | String | Content type, e.g. "application/json". Used by applications, not RabbitMQ |
| Content encoding | String | Content encoding, e.g. "gzip". Used by applications, not RabbitMQ |
| Message ID | String | Unique message ID |
| Correlation ID | String | Helps correlate requests with responses |
| Reply To | String | Carries response queue name |
| Expiration | String | Per-message TTL is milliseconds |
| Timestamp | Timestamp | Application-provided timestamp |
| User ID | String | User ID, validated if set |
| App ID | String |Application name |
{{< /details >}}

## Consumer Acknowledgements and Publisher Confirms

Delivery processing acknowledgements **from consumers to RabbitMQ** are known as acknowledgements in
messaging protocols.

Broker acknowledgements **from RabbitMQ to publishers** are a protocol extension called publisher
confirms.

When a consumer is registered, messages will be delivered by RabbitMQ using the `basic.delivery`
method. This method has a **delivery tag** that is identifies the delivery on a channel. Delivery
tags are scoped per channel.

Delivery tags are sequentially incremented positive integers which is used by client library to
acknowledge the delivery.

{{< alert icon="📝" context="info" >}}
Because delivery tags are scoped per channel, deliveries must be acknowledged **on the same channel**
they were received on
{{< /alert >}}

Manually sent acknowledgements can be positive or negative and use one of the following protocol
methods:

- `basic.ack` - positive acknowledgements which notifies RabbitMQ that a message was successfully
  processed and can be recorded as delivered and discarded
- `basic.reject` - negative acknowledgements which notifies RabbitMQ that a message wasn't
  successfully processed, however it's delivered and should be deleted
- `basic.nack` - negative acknowledgements (RabbitMQ extension to AMQP 0-9-1) that allows to batch
  acknowledgements for reducing the network traffic involved

{{< alert icon="📝" context="info" >}}
`basic.reject` and `basic.nack` supports `requeue` field that specifies if the message needs to be
requeued and redelivered
{{< /alert >}}

In automatic acknowledgement mode, a message is considered to be successfully delivered immediately
after it is sent. This mode is called **"fire-and-forget"** and provides higher throughput, but in
the other hand, it's unsafe because a message could be lost in case of **TCP** connection interruption.

## Moving to production

### Cluster Configuration

RabbitMQ cluster has a plenty of entities to be configured, such as **virtual hosts**, **users**,
**permissions**, **polices**, **topologies**, **queues**, **exchanges** and **binding**. Instead
of manual configuration of every mentioned thing, there is a possibility to seed all the required
configurations thought the [definitions file](https://www.rabbitmq.com/definitions.html).

It might be helpful for creation new environments and raising the cluster configuration as a file
using [Infrastructure as code](https://en.wikipedia.org/wiki/Infrastructure_as_code) approach.

**Definition files** can be imported/exports via UI Management tool, RabbitMQ CLI or HTTP API. They
are stored in a JSON format and could be used for the backups as well.

### Dealing With Environment

In the case of running a few environments on the same RabbitMQ cluster, each environment should use a separate [virtual host](https://www.rabbitmq.com/vhosts.html).

**Virtual host** provides a logical separation for the RabbitMQ resources, which means that all the
users, permissions, queues, etc. belong to a specific virtual host and are not shared with each other.

Virtual hosts can be managed via RabbitMQ CLI, HTTP API or UI Management tool.

{{< alert icon="📝" context="info" >}}
Virtual hosts provide only **logical** resource separation, not the **physical** one.
{{< /alert >}}

### Users

- Do not forget to remove the default **guest** user
- Use a separate user per application with corresponding permissions

### System Resources

By default, RabbitMQ will not accept any new messages if it's using more than 40% of available memory.
The rest of the memory is used by OS and file system to speed up cluster operations. This can be 
changed via `vm_memory_high_watermark` cluster configuration.

The default value of `disk_free_limit` is 50MB which is not sufficient for the production deployment
and could lead to data loss.

There are a few recommendations:
- Nodes hosting RabbitMQ cluster should have at least **256MiB** of available memory
- `vm_memory_high_watermark.relative` should have the value in range from **0.4** to **0.7**
- `disk_free_limit.relative` should have the value in range from **1.0** to **2.0**

### Logging and monitoring

The combination of [Prometheus and Grafana](https://www.rabbitmq.com/prometheus.html) is the highly 
recommended option for RabbitMQ monitoring.

All the logs from RabbitMQ cluster should be collected and aggregated if possible to investigate
unusual system behavior.

### Security

RabbitMQ nodes are securing communication between each other using shared **secret cookie file**, so
it's important to restrict this file access only to the OS user that running RabbitMQ and CLI tools.

There are two port categories used by RabbitMQ:
- Ports that are used by clients (AMQP, MQTT, STOMP, HTTP API)
- Other ports that are used by RabbitMQ for inner communication

That's important to restrict accessing internal ports from the public networks.

It's also recommended to use [TLS connection](https://www.rabbitmq.com/ssl.html) to encrypt traffic.

## Examples

{{< alert icon="👉" >}}
RabbitMQ usage examples in **Node.js** are available [here](https://github.com/DanilaFadeev/software-design-sources/tree/main/architecture/rabbitmq).
{{< /alert >}}

## Resources

- [RabbitMQ - Queues](https://www.rabbitmq.com/queues.html) 
- [RabbitMQ - Production Checklist](https://www.rabbitmq.com/production-checklist.html)
- [RabbitMQ - Publishers](https://www.rabbitmq.com/publishers.html)
- [RabbitMQ - Confirms](https://www.rabbitmq.com/confirms.html)
