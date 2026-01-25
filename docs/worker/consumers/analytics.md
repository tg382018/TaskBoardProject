# 📉 Analytics & Log Consumer

The Analytics consumer acts as the "Black Box" of TaskBoard. Its sole responsibility is to maintain a permanent, immutable record of every critical action that occurs in the system for auditing and reporting purposes.

---

## 🛠️ Data Serialization

### 🔹 The EventLog Collection

Every event processed by this consumer is stored in the `EventLog` collection in MongoDB. This collection serves as a historical stream of data.

- **Timestamping:** Every log entry receives a `processedAt` date.
- **Payload Capture:** The entire original event payload is stored, allowing for future re-processing or debugging.

> [!NOTE]
> This collection is the primary data source for the **Daily Summary Cron Job**.

---

## 🔐 Architecture Benefits

> [!IMPORTANT]
> **Write-Heavy Isolation:** By moving the writing of audit logs to this consumer, we prevent the primary `Tasks` or `Projects` database operations from slowing down during high-traffic periods.
