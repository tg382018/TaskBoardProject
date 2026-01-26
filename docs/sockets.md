# ⚡ Real-time Synchronization Engine

The Real-time Synchronization engine, powered by **Socket.io**, provides the low-latency communication layer that makes TaskBoard feel like a native desktop application. It ensures that every project member sees updates the moment they happen.

---

## 🛠️ Core Architecture: The Bridge Pattern

Instead of allowing business modules to interact directly with the Socket.io server, TaskBoard implements a specialized **Bridge Pattern**. This decouples the API logic from the real-time transmission layer.

### 🔹 1. Namespace & Room Strategy

- **Namespace (`/realtime`):** Dedicated segment for all production collaboration traffic.
- **Project Rooms:** Users are automatically joined to rooms based on their active project context (e.g., `project:65a2...b3`).
- **Security:** Room memberships are verified against the user's JWT session at the moment of connection.

> [!TIP]
> **Privacy:** This isolation ensures that a user in "Project A" never receives socket updates for "Project B", providing strict data boundary enforcement at the network layer.

### 🔹 2. The Internal Relay (Bridge)

The Bridge acts as an internal listener that catches system-wide events and translates them into socket emissions.

1. **Trigger:** A task is moved to "Done" in the `TasksController`.
2. **Relay:** the Controller calls the `SocketBridge`.
3. **Dispatch:** The Bridge identifies the correct `projectId` and emits a `task.updated` event only to that project's room.

---

## 🔐 Technical Implementation Details

| Feature        | Implementation            | Client Event              |
| :------------- | :------------------------ | :------------------------ |
| **Connection** | JWT Handshake             | `connect`                 |
| **Room Join**  | Automatic on Project Load | `room.joined`             |
| **Data Sync**  | JSON Delta Payloads       | `*.updated` / `*.created` |

> [!IMPORTANT]
> **Token Handshake:** Socket connections are not anonymous. Every connection must pass a JWT verification handshake. If the token expires or is revoked, the socket is immediately disconnected.

---

## 📊 Socket Flow Architecture

The following diagram provides a visualization of the full-duplex communication cycle—showing how events flow from the API/Worker through the Bridge and finally to all connected clients.

![Sequence Diagram: Real-time Socket Synchronization](/docs/images/sockets.png)

---

> [!CAUTION]
> High-frequency socket emissions should be throttled or debounced at the Bridge level to prevent "Event Storms" that can saturate client-side rendering threads.
