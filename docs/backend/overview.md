# 🏗️ Master Backend Architecture & System Design

Welcome to the **TaskBoard Technical Architecture Hub**. This document provides an in-depth exploration of the core systems that power our real-time collaboration engine.

---

## 🏛️ 1. Architecture Philosophy: The Modular Monolith

TaskBoard is architected as a **Modular Monolith** managed via **pnpm workspaces** and structured as a monorepo. This hybrid approach combines the simplicity of a single codebase with the strict isolation of microservices.

> [!NOTE]
> **Why this choice?** It allows for extreme developer velocity while ensuring that individual modules are "Detachable"—ready to be spun into dedicated microservices as the system scales.

### 🔹 The Business Domain Layer

Our logic is encapsulated within self-contained modules in `src/modules`. Each operates its own ecosystem:

- 🔐 **Auth Module:** Handling secure onboarding, OTP verification, and cookie-based session management.
- 📁 **Projects & Tasks:** The high-concurrency core workflow engine.
- 💬 **Comments & Stats:** Real-time engagement and data-aggregation layers.

---

## 🔐 2. The Shared Logic Kernel (Core Utilities)

Standardized utilities form the foundation of our system, ensuring that security and communication patterns remain consistent across all modules.

| Utility        | Responsibility                      | Technology                          |
| :------------- | :---------------------------------- | :---------------------------------- |
| **Security**   | Salting, Hashing & Cookie-Based JWT | `Bcrypt`, `JWT`, `httpOnly Cookies` |
| **Validation** | Request Schema Validation           | `Ajv` (JSON Schema)                 |
| **Messaging**  | AMQP Logic & Payload Marshalling    | `RabbitMQ`, `Buffer`                |
| **Real-time**  | Event Routing & Room Management     | `Socket.io`, `Bridge`               |

> [!IMPORTANT]
> **Security First:** No password ever hits the database in plain text. Tokens are delivered via `httpOnly` cookies to prevent XSS attacks. Password hashes are automatically stripped from all API responses.

---

## 📡 3. Asynchronous Backbone: RabbitMQ & Worker

To maintain a **<100ms API response time**, TaskBoard offloads all non-blocking operations to an asynchronous processing layer.

### 🚀 **Execution Pipeline:**

1. **User Action:** API validates and commits to MongoDB.
2. **Event Dispatch:** The `publisher.js` broadcasts an event to the **RabbitMQ Exchange**.
3. **Queueing:** Messages are held in persistent queues based on their `routingKey`.
4. **Background Execution:** The **Worker Service** consumes messages to perform high-latency tasks:
    - 📧 **Communications:** Sending OTPs and welcome emails.
    - 📊 **Analytics:** Recalculating project status and user productivity.
    - 📄 **Reporting:** Generating daily summaries and exports.

---

## ⚡ 4. Real-Time Propagation via Socket Bridge

Real-time sync is governed by a **Bridge Pattern** that translates internal system state changes into live client updates.

> [!TIP]
> **Room Isolation:** We use `rooms.js` to ensure that data is only broadcasted to authorized participants in specific projects, maintaining strict data privacy at the socket level.

- **The Bridge:** Acts as a traffic controller, receiving events from both the API and the Worker.
- **Propagation:** Translates payloads into `socket.emit()` calls directed at specific `projectRoom` identifiers.

---

## 💾 5. The Dual-Storage Foundation

We optimize for both **Cold Storage** (persistence) and **Hot Storage** (performance) by leveraging two distinct database engines.

### 🍃 **MongoDB: Source of Truth**

- Stores persistent entities (Users, Tasks, Projects, Sessions).
- Flexible schema allows for rapid iteration of task attributes.

### ⚡ **Redis: High-Performance Cache**

- **OTP Manager:** Storing verification codes with strict 3-minute TTLs.
- **Rate Limiter:** Protecting the infrastructure from abuse and DDoS attempts.
- **Session Cache:** Quick validation of active sessions.

---

## 🔒 6. Cookie-Based Authentication

> [!IMPORTANT]
> TaskBoard uses **httpOnly cookies** for token delivery, providing enterprise-grade security.

| Feature                | Implementation                                |
| :--------------------- | :-------------------------------------------- |
| **Token Storage**      | `httpOnly` cookies (not localStorage)         |
| **XSS Protection**     | Tokens inaccessible to JavaScript             |
| **CSRF Protection**    | `sameSite: strict` cookie flag                |
| **Session Management** | Multi-device session tracking with revocation |

---

## 📊 Master System Architecture Map

The visual below illustrates the end-to-end journey of data through our stack—from the business modules to the infrastructure layer.

![Master Backend Architecture](/docs/images/backend.png)

---

> [!CAUTION]
> Unauthorized changes to the **Infrastructure Layer** or the **AMQP Exchange Topology** can lead to system-wide desynchronization. Always consult the `packages/common/` before making changes.
