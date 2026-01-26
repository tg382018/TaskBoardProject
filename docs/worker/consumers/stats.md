# 📊 Stats Consumer (User & Project)

The Stats consumer is responsible for maintaining real-time aggregated metrics for users and projects. It listens for lifecycle events and updates the secondary "Stat Counters" collections.

---

## 🛠️ Aggregation Logic

The consumer uses a high-speed `incrementStat` pattern to update counters. Instead of re-calculating everything, it performs atomic `$inc` operations in MongoDB.

### 🔹 Tracked Metrics:

- **Project Stats:** Count of projects created or joined.
- **Task Lifecycle:** Counts for `tasksCreated`, `tasksDeleted`, and `tasksAssigned`.
- **Engagement:** Tracking the volume of contributions per user.

### 🔹 Logic Matrix:

- **`task.created`** -> Increments `tasksCreated` for the creator.
- **`task.updated`** -> Detects if an assignee was added and increments `tasksAssigned`.
- **`project.deleted`** -> Increments `projectsDeleted` for historical tracking.

---

## ⚡ Performance Optimization

> [!TIP]
> **Atomic Increments:** By using Mongoose `findOneAndUpdate` with `$inc`, we ensure that even if multiple tasks are created simultaneously, the user's total count remains accurate and thread-safe.

---

> [!NOTE]
> These statistics are the foundation for the User Productivity dashboard seen in the frontend application.
