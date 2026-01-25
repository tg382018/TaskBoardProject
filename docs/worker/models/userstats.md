# 📊 UserStats Model (Schema)

The `UserStats` model maintains high-performance, denormalized counters for user activity. This allows the frontend to display statistics instantly without performing expensive aggregations on every request.

---

## 🛠️ Tracked Counters

The schema tracks various integers representing user productivity and engagement.

### 🔹 Schema Fields:

- `projectsCreated`
- `projectsJoined`
- `tasksCreated`
- `tasksAssigned`
- `tasksCompleted`
- `commentsAdded`

---

## ⚡ Increment Logic

The model includes a static helper method to ensure thread-safe updates:

```javascript
// Example helper logic in UserStats.js
userStatsSchema.statics.incrementStat = function (userId, field) {
    return this.findOneAndUpdate({ userId }, { $inc: { [field]: 1 } }, { upsert: true, new: true });
};
```

> [!IMPORTANT]
> **Upsert Strategy:** If a user doesn't have a stats record yet, the system will automatically create one on the first increment event.
