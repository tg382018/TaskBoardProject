# 🚀 Worker Bootstrap & Startup

The initialization of the Worker service follows a reliable pattern designed to ensure that it never misses a message from the queue while maintaining a healthy connection to the infrastructure.

---

## 🛠️ The Startup Lifecycle

### 🔹 1. Infrastructure Handshake

The Worker's `index.js` first establishes connections to the heart of the system:

- **MongoDB:** Connects to the primary store for state and statistics.
- **Redis:** Connects to the caching layer for OTP storage and rapid lookups.
- **RabbitMQ:** Connects to the event bus and asserted the standard **TaskBoard Topology**.

> [!CAUTION]
> If the RabbitMQ connection fails, the Worker will retry for a specific duration before exiting. It will **not** start processing if the broker is unavailable.

### 🔹 2. Specialized Consumer Activation

Once the infrastructure is ready, the `startTaskboardConsumer` function is triggered. This step is critical:

- It creates the `worker.taskboard` queue.
- It binds the queue to the `taskboard.events` exchange.
- It begins the "Consume" loop, allowing messages to flow in.

### 🔹 3. Cron Job Scheduling

Finally, the Server starts the **Cron Engine** (`node-cron`). This schedules tasks like the **Daily Summary** to ensure they run at specific intervals (e.g., every midnight).

---

## 📊 Worker Startup Matrix

| Phase     | Component                   | Criticality |
| :-------- | :-------------------------- | :---------- |
| **Infra** | MongoDB / Redis / Rabbit    | 🔴 Blocked  |
| **Queue** | Asserting Exchange & Queue  | 🔴 Blocked  |
| **Jobs**  | Cron Registration           | 🟡 Warning  |
| **Admin** | Worker Admin Server (:4000) | ⚪ Optional |

---

> [!NOTE]
> In development mode, the Worker also spins up a small **Admin HTTP Server** on port 4000, allowing developers to manually trigger background jobs via POST requests for testing purposes.
