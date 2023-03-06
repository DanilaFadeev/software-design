---
title: "JWT Token"
description: "JSON Web Tokens explanation and usage"
lead: ""
date: 2023-02-21T13:26:53+03:00
lastmod: 2023-02-21T13:26:53+03:00
draft: false
menu:
  backend:
    parent: ""
    identifier: "jwt-a75cab8f049eb2decf18f6573faba7f1"
weight: 40
toc: true
type: docs
layout: single
---

## Overview

**JWT (JSON Web Token)** is a standard [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519) that defines a secure way for information transmission in a JSON object form. This piece of data can be digitally signed using a _secret keyword_ (symmetrical **HMAC**) or _public/private keys_ (asymmetrical **RSA** or **ECDSA**).

**JWT Tokens** are primarily used for the identification of the authenticated user. These tokens are generated on the server side and returned to the client for further storage and usage.

### Purpose

The general purpose of **JWT Tokens** is to allow the server to verify the user making a request. By the signing process, produced on the server side, the server ensures the token validity using the private key or secret keyword.

Basically, the token contains some information that the server can verify. For example, it could be the current user identifier, email address, token expiration time, etc. That informational part of the token is not encrypted and can be used by the client for self-identification.

There main functions provided by **JWT Tokens**:

- **Authorization.** A **JWT token** can be included in every client's request to verify the client and provide granular access to the server's resources.

- **Information exchange.** As soon as a **JWT Token** is signed, it can be used to share information between services.

### 👍 Advantages

- **Secure.**
  The JWT Tokens are signed with an encryption algorithm, ensuring that the token payload wasn't modified by the client or hackers.

- **Stored only on the client.**
  The server generates a JWT Token and returns it to the client without storing it on a database or any other server storage.

- **Stateless.**
  The JWT Token is self-descriptive and contains valuable information in its payload. It's quick to verify without requesting an authentication service or a database.

- **Issuer isolation.**
  JWT Tokens can be generated anywhere, for example, by an isolated authentication microservice. The rest of the services only need the used _public key_ to verify the token's signature.

- **JSON-based.**
  As stands by their name, JWT Tokens use JSON data format, which is widely used in service communication and can be easily integrated into existing systems.

### 👎 Disadvantages

- **Not Revocable.**
  Because of the token statelessness, it's impossible to revoke the JWT token if a user logs out. The only option is introducing a _Black List_ storage to track revoked tokens and deny the requests.

- **Compromised Secret Key.**
  The tokens are signed with a _secret key_ which needs to be protected. If someone steals the key, he can generate and sign any token data to perform critical system operations.

- **Short-lived.**
  The token should have a minimum expiration time. It requires a refresh mechanism to re-generate the tokens automatically without asking a user to re-login every time.

## Structure

**JWT Token** consists of the three Base64-encoded strings concatenated with a dot (`.`):

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJ3ZWJzaXRlIjoiU29mdHdhcmUgRGVzaWduIiwiYXV0aG9yIjoiRGFuaWxhIEQifQ.BPsnuuzAwyB9IW7bP_k5FHLgidgsQRXP8oONyE_XdRg
```

![JWT Token Structure](jwt-structure.png)

### Header
  
Holds the token metadata. Typically has two fields: `typ` (the type of the token, which is `JWT` in most cases) and `alg` (the used signing algorithm).

```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

### Payload

Contains the **claims** and additional data.

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022
}
```

### Signature

The token signature string. Received by signing the encoded **header** and **payload** using a _secret_ and chosen algorithm. The signature ensures that the **JWT Token** is valid and the message's content hasn't been changed during the data exchange process.

```javascript
// HMAC
HMACSHA256(BASE_64_URL(header) + '.' + BASE_64_URL(payload), secret) 

// RSA/ECDSA
RSASHA256(BASE_64_URL(header) + '.' + BASE_64_URL(payload), publicKey, privateKey) 
```

## JWT Claims

**Claims** are statements about an entity (typically, the user) and additional data. There are three types of claims:

- **Registered claims.** Predefined recommended claims provided useful information, which is defined by [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1)
- **Public claims.** Custom well-known claims defined on [IANA JSON Web Token Registry](https://www.iana.org/assignments/jwt/jwt.xhtml)
- **Private claims.** Custom claims, determined by the issuer to share information between services

### Registered Claims

| Name | Description | Example |
| --- | --- | --- |
| `iss` | Issuer | `https://accounts.google.com` |
| `sub` | Subject | `10769150350006150715113082367` |
| `aud` | Audience | `1234987819200.apps.googleusercontent.com` |
| `exp` | Expiration Time | `1353604926` |
| `nbf` | Not Before | `1353601592` |
| `iat` | Issued At | `1353601026` |
| `jti` | JWT ID | `8f146d72-50cb-4206-ac44-b58d736aea64` |

## Implementation

#### 1. Generate payload

Create a JSON _payload_:

```json
{
  "iat": 1676993462954,
  "exp": 1677598323060,
  "userId": "63f4e4ddecdd327eca2b2921"
}
```

#### 2. Generate header

Decide the signing algorithm and create the JWT Token _header_:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

For the current example, the `HS256` signing algorithm will be used (means `HMAC+SHA256`).

#### 3. Create a signature

- Convert the "header" to Base64 format:

{{< tabs "header-base64-source" >}}
{{< tab "Node.js" >}}
```javascript
Buffer.from(JSON.stringify(header)).toString('base64url');
// Result: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```
{{</ tab >}}
{{< tab "Python" >}}
```python
from json import dumps
from base64 import b64encode

b64encode(dumps(header, separators=(',', ':')).encode('utf-8'))
# Result: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```
{{</ tab >}}
{{</ tabs >}}

- Convert the "payload" to Base64 format:

{{< tabs "payload-base64-source" >}}
{{< tab "Node.js" >}}
```javascript
Buffer.from(JSON.stringify(payload)).toString('base64url');
// Result: eyJpYXQiOjE2NzY5OTM0NjI5NTQsImV4cCI6MTY3NzU5ODMyMzA2MCwidXNlcklkIjoiNjNmNGU0ZGRlY2RkMzI3ZWNhMmIyOTIxIn0
```
{{</ tab >}}
{{< tab "Python" >}}
```python
from json import dumps
from base64 import b64encode

b64encode(dumps(payload, separators=(',', ':')).encode('utf-8'))
# Result: eyJpYXQiOjE2NzY5OTM0NjI5NTQsImV4cCI6MTY3NzU5ODMyMzA2MCwidXNlcklkIjoiNjNmNGU0ZGRlY2RkMzI3ZWNhMmIyOTIxIn0
```
{{</ tab >}}
{{</ tabs >}}

- Generate a signature using the `jwt-secret-key` secret keyword

{{< tabs "sign-jwt-source" >}}
{{< tab "Node.js" >}}
```javascript
const crypto = require('crypto');

crypto
  .createHmac('sha256', 'jwt-secret-key')
  .update(`${headerBase64}.${payloadBase64}`)
  .digest('base64url');

// Result: 2Y5lJXMXetgOjUN2EuAohRGkXqq7IVuVkMf0ilhjqUw
```
{{</ tab >}}
{{< tab "Python" >}}
```python
import hmac
import hashlib
from base64 import b64encode

b64encode(
  hmac.new(
    b"jwt-secret-key",
    f"{headerBase64}.{payloadBase64}".encode("utf-8"),
    hashlib.sha256
  ).digest()
)

# Result: 2Y5lJXMXetgOjUN2EuAohRGkXqq7IVuVkMf0ilhjqUw
```
{{</ tab >}}
{{</ tabs >}}

#### 4. Assemble

Get the final JWT token by joining the generated strings with a dot (`.`) separator - `<header>.<payload>.<signature>`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzY5OTM0NjI5NTQsImV4cCI6MTY3NzU5ODMyMzA2MCwidXNlcklkIjoiNjNmNGU0ZGRlY2RkMzI3ZWNhMmIyOTIxIn0.2Y5lJXMXetgOjUN2EuAohRGkXqq7IVuVkMf0ilhjqUw
```

#### 5. Verify

Every time a client produces a request, it will have the generated token that has to be validated.

The validation process consists of the following steps:
- Decode the first part of the JWT token (header) and check the used algorithm
- Using the algorithm above, create a signature of `<header>.<payload>` part following _Step 4 - Generate a signature_
- Compare the generated signature with the one provided in the client's JWT Token
- If the signatures are identical, decode the `<payload>` part and take the data from it

{{< tabs "verify-jwt-source" >}}
{{< tab "Node.js" >}}
```javascript
const crypto = require('crypto');

const [headerBase64, payloadBase64, signature] = jwtToken.split('.');

const signatureVerify = crypto
  .createHmac('sha256', 'jwt-secret-key')
  .update(`${headerBase64}.${payloadBase64}`)
  .digest('base64url');

if (signatureVerify !== signature) {
  throw new Error('Invalid Token');
}

JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());
/* Result: {
  iat: 1676993462954,
  exp: 1677598323060,
  userId: '63f4e4ddecdd327eca2b2921'
} */
```
{{</ tab >}}
{{< tab "Python" >}}
```python
import json
import hmac
import hashlib
from base64 import b64encode, b64decode

header_base_64, payload_base_64, signature = jwt_token.split(".")

hmac_digest = hmac.new(
  b"jwt-secret-key",
  f"{header_base_64}.{payload_base_64}".encode("utf-8"),
  hashlib.sha256
).digest()

signature_verify = b64encode(hmac_digest).decode("utf-8")

if signature_verify != signature:
  raise Exception("Invalid Token")

json.loads(b64decode(payload_base_64).decode('utf-8'))
# Result: {
#  'iat': 1676993462954,
#  'exp': 1677598323060,
#  'userId': '63f4e4ddecdd327eca2b2921'
# }
```
{{</ tab >}}
{{</ tabs >}}

## Usage

The generated **JWT token** must be stored on the client side and included in every request to the server. JWT doesn't have a standard binding defining how the JWT should be passed. In most cases, the JWT is transported via HTTP(S) protocol using an `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

## Examples

{{< alert icon="👉" >}}
JWT Tokens implementation examples in **Node.js** are available {{< source "here" "/backend/jwt-token/" >}}.
{{< /alert >}}

## Resources
- 📝 [Introduction to JSON Web Tokens](https://jwt.io/introduction)
- 📝 [What is a JWT? Understanding JSON Web Tokens](https://supertokens.com/blog/what-is-jwt)
- 📹 [JWT - JSON Web Token Crash Course (NodeJS & Postgres)](https://www.youtube.com/watch?v=T0k-3Ze4NLo&ab_channel=HusseinNasser)

<!--
TODO:
1. Refresh Tokens
2. Best practices
-->
