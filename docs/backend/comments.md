# 💬 Real-time Comments & Feedback Module

The Comments module enables seamless collaboration within TaskBoard. It provides a structured, high-concurrency engine for task discussions and feedback loops, powered by instant synchronization.

---

## 🛠️ Core Capabilities

### 🔹 1. Instant Reaction & Feedback

Communication is the heartbeat of collaboration. The system ensures that every comment is validated and stored with precise timestamps to maintain a chronological record of task discussions.

> [!TIP]
> **Optimistic UI:** While the API processes the comment, the frontend uses optimistic updates to show the message instantly, providing a zero-latency feel for the end user.

### 🔹 2. Project-Scoped Security

Comments are never broadcasted globally. They are strictly scoped to their parent `projectId` and `taskId`.

- **Authorization:** Only project members can post or view comments.
- **Data Integrity:** Cascading logic ensures that if a task is deleted, all associated comments are purged in the background to prevent "orphaned" data.

### 🔹 3. The Real-time Pulse (Socket Bridge)

This module is a heavy user of the **Socket Bridge Pattern**:

- **Room Targeting:** Comments are broadcasted to a specialized room format: `project:${projectId}`.
- **Event Flow:** `API Save` -> `Bridge Logic` -> `Socket Emission`. This ensures that everyone currently viewing the task sees the new comment without manual refreshing.

---

## 🔐 Technical Implementation Details

| Feature           | Implementation             | Side Effect                            |
| :---------------- | :------------------------- | :------------------------------------- |
| **Post Comment**  | `POST /comments`           | Emits `comment.created` to Socket Room |
| **List Comments** | `GET /comments?taskId=xxx` | Retrieves comments for a specific task |

> [!NOTE]
> **Current Limitations:** Edit and delete operations for comments are not yet implemented. Comments are currently immutable after creation.

---

## 📡 API Endpoints

| Endpoint    | Method | Description                                   | Auth Required |
| ----------- | ------ | --------------------------------------------- | ------------- |
| `/comments` | POST   | Create a new comment                          | ✅            |
| `/comments` | GET    | List comments (requires `taskId` query param) | ✅            |

### Request/Response Examples

**Create Comment:**

```json
// POST /comments
{
    "content": "This is a comment on the task.",
    "taskId": "507f1f77bcf86cd799439011"
}
```

**List Comments:**

```
GET /comments?taskId=507f1f77bcf86cd799439011
```

---

## 📊 Flow Diagrams

### Comment & Feedback Lifecycle

This diagram illustrates the journey of a comment from the initial POST request to the real-time broadcast across all team members' devices.

![Sequence Diagram: Real-time Comment Propagation](/docs/images/comment.png)

---

> [!NOTE]
> All comments are subject to the global **Rate Limiting** layer to prevent spam and ensure system stability during peak collaboration hours.
