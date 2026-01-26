# 🏗️ Worker System Architecture

The **Worker Service** is the high-performance, asynchronous engine that powers background operations, scheduled tasks (Cron), and event-driven data processing for TaskBoard.

---

## 🏛️ 1. Architecture Logic: The Decoupled Engine

TaskBoard's Worker is designed as a standalone microservice that communicates with the main system via **RabbitMQ**. This separation ensures that heavy tasks do not impact the core API's responsiveness.

> [!TIP]
> **Performance Scaling:** The Worker service can be horizontally scaled independently to handle millions of background jobs without affecting user latency on the frontend.

### 🔹 Strategic Responsibilities

- ⚡ **Latency Offloading:** Handling I/O intensive tasks like Email sending or API notifications.
- 💾 **Data Aggregation:** Updating denormalized stats and analytics logs in real-time.
- ⏱️ **Scheduled Maintenance:** Executing time-based management jobs (Daily Summaries).

---

## 📡 2. Infrastructure Integrations

| Component    | Role           | Logic                                             |
| :----------- | :------------- | :------------------------------------------------ |
| **RabbitMQ** | Message Broker | Topic Exchange for flexible event routing         |
| **MongoDB**  | Primary Store  | Persistent storage for Audit Logs and Summaries   |
| **Redis**    | Speed Layer    | Temporary storage for OTPs and high-speed caching |

---

## 📊 Worker System Blueprint

This diagram visualizes the internal structure of the Worker and its interaction with infrastructure layers.

![Worker System Architecture Map](/docs/images/worker/worker-overview.png)

---

> [!IMPORTANT]
> The Worker service implements an **Idempotent processing strategy**, ensuring that retried tasks do not cause duplicate data side effects.
