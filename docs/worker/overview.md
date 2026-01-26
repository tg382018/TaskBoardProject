# 🏗️ Worker System Overview

The **Worker Service** is the asynchronous engine of TaskBoard. While the API Service handles user interactions and immediate data persistence, the Worker Service manages all time-consuming, background, and scheduled tasks.

---

## 🏛️ Role in the Ecosystem

The Worker operates as a separate Node.js process (containerized independently) that communicates with the rest of the system via **RabbitMQ** and shared databases.

### 🔹 Key Responsibilities:

- **Offloading Latency:** Handles operations like email sending and expensive image processing that would otherwise slow down the API.
- **Data Enrichment:** Listens to system events to update analytics and user statistics in the background.
- **Scheduled Maintenance:** Runs periodic jobs (Crons) to generate summaries and perform system cleanups.
- **Cross-Service Sync:** Acts as a relay provider using the **Socket Bridge** to push updates from the background to the frontend.

---

## 🛠️ Performance & Scalability

> [!TIP]
> **Horizontal Scaling:** Because the Worker is decoupled via RabbitMQ, we can spin up multiple instances of the Worker container to handle high bursts of background events without touching the API capacity.

| Aspect            | Strategy                     |
| :---------------- | :--------------------------- |
| **Communication** | AMQP (RabbitMQ)              |
| **Persistence**   | MongoDB                      |
| **Fast State**    | Redis                        |
| **Isolation**     | Independent Docker Container |

---

## 📂 System Map

The Worker is organized into specialized layers:

1. **Consumers:** Listeners for specific message patterns.
2. **Services:** Core logic providers (Mailer, Notifier).
3. **Jobs:** Time-based scheduled tasks (Cron).
4. **Models:** Independent data schemas for tracking events and stats.

---

> [!IMPORTANT]
> The Worker Service is the **only** component authorized to perform heavy writes on the `UserStats` and `EventLog` collections, maintaining a clear "Command-Result" separation from the main API modules.`
