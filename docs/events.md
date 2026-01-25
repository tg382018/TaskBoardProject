# 📡 Distributed Event System

The Event System is the asynchronous backbone of TaskBoard. It enables a decoupled architecture where heavy processing is offloaded to background workers, ensuring the core API remains responsive and stable.

---

## 🛠️ Core Mechanism: AMQP & RabbitMQ

TaskBoard utilizes **RabbitMQ** as its primary message broker. By implementing the **Advanced Message Queuing Protocol (AMQP)**, the system achieves reliable delivery and complex routing of system events.

### 🔹 1. The Producer Pattern (API Service)

When a critical state change occurs in the API (e.g., a new user registers), the system doesn't execute all consequential logic immediately. Instead:

- The API validates the primary action and saves it to MongoDB.
- A **Payload** is constructed containing the necessary metadata.
- The `publisher.js` utility dispatches this payload to a specific **Exchange** with a unique `routingKey`.

> [!TIP]
> **Performance:** This approach reduces API response times by up to 80% for operations involves emails or complex data processing.

### 🔹 2. The Consumer Pattern (Worker Service)

The **Background Worker** sits as a dedicated listener on the service's queues.

- **Persistent Queues:** Even if the Worker is offline, messages are held safely in RabbitMQ.
- **Parallel Processing:** Multiple worker instances can consume from the same queue to scale processing power horizontally.

### 🔹 3. Event Topologies & Routing

| Exchange Type       | Usage            | Strategy                                     |
| :------------------ | :--------------- | :------------------------------------------- |
| **Topic Exchange**  | Primary Events   | Routes based on wildcards (e.g., `user.*`)   |
| **Direct Exchange** | Targeted Actions | Routes to specific queues for immediate work |
| **Dead Letter**     | Recovery         | Handles failed messages for later inspection |

---

## 🔐 Reliability & Error Handling

> [!IMPORTANT]
> **Message Acknowledgment:** The system uses explicit ACKs. A message is only removed from the queue once the Worker confirms successful processing. If a crash occurs mid-process, the message is automatically requeued.

### 🔸 Exponential Backoff

If a transient failure occurs (e.g., an external email API is down), the Worker implements an exponential backoff strategy to retry the operation without overwhelming the system.

---

## 📊 Event Flow Architecture

The following diagram illustrates the lifecycle of an event—from the initial API trigger through the RabbitMQ broker to final execution in the Worker service.

![Sequence Diagram: Distributed Event Lifecycle](/docs/images/events.png)

---

> [!CAUTION]
> Direct modification of the **Exchange Bindings** or **Queue Arguments** requires a synchronized deployment of both API and Worker services to prevent message "black-holing."
