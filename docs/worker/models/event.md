# 📑 Event Model (Schema)

The `EventLog` model is the primary data structure for the Worker's analytics layer. It captures a raw snapshot of everything that happens in the system.

---

## 🛠️ Schema Definition

The model is designed to be highly flexible, using the **Mixed Type** pattern for the payload to support various event structures.

### 🔹 Fields:

- **`type` (String):** The event routing key (e.g., `task.created`).
- **`payload` (Mixed):** The full original data object from RabbitMQ.
- **`processedAt` (Date):** Timestamp of when the Worker received the message.

---

> [!NOTE]
> This model is shared between the **Analytics Consumer** (for writing) and the **Daily Summary Job** (for reading), acting as the central audit stream of the Worker system.
