# 🎧 TaskBoard Master Consumer

The **TaskBoard Consumer** is the primary entry point for all events entering the Worker system. It acts as a traffic controller, receiving raw messages and distributing them to specialized sub-handlers.

---

## 🛠️ Internal Mechanics

### 🔹 1. Topology Binding

The consumer asserts its presence in the RabbitMQ network by binding to multiple routing patterns:

- `task.*` (Creation, Update, Deletion)
- `otp.*` (One-Time Password requests)
- `comment.*` (New discussions)
- `project.*` (Workspace changes)

### 🔹 2. Sequential Dispatching

When a message arrives, the consumer executes a **Parallel-Execution Pattern**:

1. **Parse:** Converts the AMQP buffer to a JSON event.
2. **Dispatch:** Forwards the event to `handleMail`, `handleNotification`, `handleAnalytics`, and `handleStats` in sequence.
3. **Acknowledgment:** Sends a final `ACK` to RabbitMQ once all handlers have finished processing.

> [!TIP]
> **Safe Processing:** Each handler is wrapped in a try/catch block within the consumer to ensure that a failure in one (e.g., Mailer) doesn't prevent another (e.g., Stats) from running.

---

## 📊 Consumer Flow

| Layer             | Responsibility                            |
| :---------------- | :---------------------------------------- |
| **AMQP Receiver** | Physical message pickup from RabbitMQ     |
| **JSON Parser**   | Schema validation and metadata extraction |
| **Distributor**   | Orchestrating sub-handlers                |
| **ACK Manager**   | Queue cleanup and flow control            |

---

> [!IMPORTANT]
> The TaskBoard consumer ensures **Exactly-Once** processing (within the limits of the ACK system), preventing duplicate side effects in the secondary storage layers.`
