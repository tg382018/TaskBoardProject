# 📊 Statistics & Data Insights Module

The Statistics module is the analytical powerhouse of TaskBoard. It provides high-performance data aggregation and visualization capabilities, allowing users and managers to track productivity through a specialized dual-storage caching engine.

---

## 🛠️ Core Capabilities

### 🔹 1. High-Performance Aggregation

Generating statistics involves complex computations across multiple collections (Tasks, Comments, User logs). To ensure zero impact on system throughput, we use specialized **MongoDB Aggregation Pipelines**.

> [!TIP]
> **Performance Optimization:** Instead of recalculating every metric on every request, we use a **Read-Aside Caching** strategy. Global and user-specific stats are computed once and stored as high-speed keys in Redis.

### 🔹 2. Specialized Metric Tracking

- **Task Velocity:** Measures the rate of completion across different project stages.
- **Engagement Heatmaps:** (Upcoming) Visualizing peak activity hours for team collaboration.
- **Project Sustainability:** Tracking task creation vs. completion to identify bottlenecks.

### 🔹 3. Intelligent Invalidation

The system ensures that statistics remain accurate without constant re-computation:

- **Event-Driven Refresh:** Certain events (like task completion) trigger specific invalidation flags in the cache.
- **TTL (Time To Live):** Redis keys are set with specific expirations to ensure a periodic "fresh" computation of data.

---

## 🔐 Technical Implementation Details

| Component            | Responsibility         | Performance Target         |
| :------------------- | :--------------------- | :------------------------- |
| **Data Engine**      | MongoDB Aggregations   | Reliable Persistence       |
| **Cache Layer**      | Redis (Key-Value)      | <10ms Response Time        |
| **Analytics Worker** | Background Computation | Offloaded from Main Thread |

> [!IMPORTANT]
> **Data Privacy:** Statistics are strictly scoped. Users can only view stats for projects they have explicit membership in, preventing unauthorized data exposure across workspaces.

---

## 📊 Flow Diagrams

### Statistics Computation Lifecycle

This diagram illustrates the process of state checking (Redis Cache-Hit) and the fallback aggregation logic (MongoDB Cache-Miss).

![Sequence Diagram: Stats Aggregation & Cache Flow](/docs/images/stats.png)

---

> [!NOTE]
> Detailed user productivity stats are strictly private and are only accessible through authorized session contexts.
