# ⏱️ Daily Summary Job (Cron)

The Daily Summary job is a scheduled task that aggregates user activity over a 24-hour window to provide high-level productivity insights.

---

## 🛠️ Execution Loop

The job is scheduled via `node-cron` to run once every 24 hours (default: 00:00 TR Time / 21:00 UTC).

### 🔹 Processing Pipeline:

1. **Fetch:** Retrieves all `EventLog` entries from the last 24 hours.
2. **Grouping:** Sorts and groups events by the `userId` or `creatorId` involved.
3. **Summarization:** Translates raw events (like `task.updated`) into readable messages (e.g., "Changed status of task X to Done").
4. **Persistence:** Saves the final summary into the `UserDailySummary` collection.

---

## 📊 Summary Structure

| Field          | Purpose                                                   |
| :------------- | :-------------------------------------------------------- |
| **activities** | Chronological list of formatted messages.                 |
| **stats**      | Total counts for the day (Tasks created, Comments added). |
| **date**       | The specific day this snapshot represents.                |

---

> [!TIP]
> **Manual Triggering:** In development environments, this job can be manually triggered via a POST request to the Worker's Admin server (`:4000/trigger-daily-summary`) to test reporting logic without waiting for midnight.
