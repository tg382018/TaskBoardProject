# ⏱️ Daily Summary Engine (Cron)

The Summary Engine is a robust data-processing pipeline that transforms thousands of raw activity logs into insightful, human-readable productivity reports.

---

## 🚀 1. The Execution Lifecycle

Every day at **00:00 (TR Time)**, the cron mechanism triggers a specialized aggregation pipeline.

### 🔹 Step-by-Step Logic

- 🔍 **Scan:** Queries the **EventLog** for all activities within the last 24-hour window.
- 🧩 **Group:** Dynamically clusters activities based on unique user identities.
- ✍️ **Humanize:** Converts technical event codes into narrative messages (e.g., `task.created` -> _"Created Task X"_).
- 💾 **Commit:** Updates the `UserDailySummary` collection with a unique Date+User constraint.

---

## 📊 Data Aggregation Flow

This flowchart describes the extraction-transformation-loading (ETL) process of the daily job.

![Daily Summary Job Logic Map](/docs/images/worker/daily-summary.png)

---

## 📈 2. Denormalized Insights

Beyond just messages, the job computes a set of high-level statistics:

| Metric         | Description                                     |
| :------------- | :---------------------------------------------- |
| **Velocity**   | Ratio of Tasks Created vs. Updated              |
| **Engagement** | Frequency of comments and project participation |
| **Growth**     | New projects initialized or joined              |

> [!NOTE]
> Summaries are stored in a **ready-to-serve** format, allowing the frontend to display rich activity feeds without complex server-side joins.
