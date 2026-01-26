# 🎧 Taskboard Master Consumer & Event Relay

The **Taskboard Master Consumer** is the "Central Nervous System" of the worker service. It manages complex event subscription patterns and orchestrates the parallel execution of specialized handlers.

---

## ⚡ 1. The Real-time Pulse: Event Distribution

The master consumer binds to the **taskboard.events** exchange, listening for specific patterns across our business modules.

### 🔹 Binding Patterns

- `task.#` (CRUD operations on items)
- `otp.#` (Security & Authentication events)
- `comment.#` (Engagement & Discussion spikes)
- `project.#` (Workspace management changes)

> [!NOTE]
> We use **Topic Exchanges** allowing specific listeners to "opt-in" to only the relevant streams of data, optimizing resource consumption.

---

## 📊 Event Processing Flow

This sequence diagram tracks exactly how a raw byte stream from RabbitMQ is transformed into system-wide updates.

![Taskboard Consumer Processing Flow](/docs/images/worker/taskboard-consumer.png)

---

## 🛠️ 2. Parallel Handler Orchestration

Instead of linear execution, the TaskBoard consumer utilizes a **Broadcast-Notify Pattern**:

1. **Validation:** Checks event schema integrity.
2. **Parallel Dispatch:** Executes Mail, Notify, Analytics, and Stats handlers simultaneously using `Promise.all` logic.
3. **Reliable ACK:** An acknowledgment is only sent to RabbitMQ when all internal operations achieve a "Success" state.

> [!TIP]
> **Fault Tolerance:** If any single handler fails, the entire message is safely rejected and can be rerouted to a Dead Letter Queue (DLQ).
