# ✅ Tasks & Life Cycle Module

The Tasks module is the fundamental unit of work within TaskBoard. It provides a robust engine for managing, assigning, and tracking individual activities with millisecond precision and real-time synchronization.

---

## 🛠️ Core Capabilities

### 🔹 1. Precision Task CRUD

Management of task data is handled with strict schema validation. Every task is linked to a `projectId`, ensuring multi-tenant isolation and secure access control.

> [!TIP]
> **Data Integrity:** We use atomic updates to ensure that concurrent status changes (e.g., two users moving a task to "Done") are handled gracefully without data races.

### 🔹 2. Dynamic Status & Priority

- **Workflow State:** Tasks follow a defined lifecycle with three states:
    - `Todo` - Not started
    - `InProgress` - Currently being worked on
    - `Done` - Completed
- **Prioritization:** Three priority levels for task weighting:
    - `Low` - Lower priority items
    - `Medium` - Default priority
    - `High` - Urgent items requiring immediate attention
- **Assignments:** Real-time assignment logic that notifies users when they are added to a task.
- **Tags:** Support for up to 10 custom tags per task for organization.

### 🔹 3. Instant Real-time Synchronization

The Tasks module is the primary consumer of the **Socket Bridge**.

- **Broadcast:** Every update (title change, status move, or assignment) triggers an immediate project-wide broadcast.
- **Deltas:** Instead of reloading the page, the frontend receives specific event deltas, making the UI feel like a native desktop application.

---

## 🔐 Technical Implementation Details

| Feature         | Implementation      | Socket Event   |
| :-------------- | :------------------ | :------------- |
| **Create Task** | `POST /tasks`       | `task.created` |
| **List Tasks**  | `GET /tasks`        | -              |
| **Get Task**    | `GET /tasks/:id`    | -              |
| **Update Task** | `PATCH /tasks/:id`  | `task.updated` |
| **Delete Task** | `DELETE /tasks/:id` | `task.deleted` |

> [!IMPORTANT]
> **Ownership & Permission:** A task can only be modified by members of the parent project. Unauthorized attempts are rejected at the middleware level with a `403 Forbidden` status.

---

## 📡 API Endpoints

| Endpoint     | Method | Description                                        | Auth Required |
| ------------ | ------ | -------------------------------------------------- | ------------- |
| `/tasks`     | POST   | Create a new task                                  | ✅            |
| `/tasks`     | GET    | List tasks (filter by projectId, status, priority) | ✅            |
| `/tasks/:id` | GET    | Get task details                                   | ✅            |
| `/tasks/:id` | PATCH  | Update task (title, status, priority, assignee)    | ✅            |
| `/tasks/:id` | DELETE | Delete a task                                      | ✅            |

### Request/Response Examples

**Create Task:**

```json
// POST /tasks
{
    "title": "Implement login page",
    "description": "Create the login form with validation",
    "projectId": "507f1f77bcf86cd799439011",
    "priority": "High",
    "tags": ["frontend", "auth"]
}
```

**Update Task Status:**

```json
// PATCH /tasks/:id
{
    "status": "InProgress"
}
```

**List Tasks with Filters:**

```
GET /tasks?projectId=xxx&status=Todo&priority=High
```

---

## 📊 Flow Diagrams

### Task Operations Lifecycle

A comprehensive look at how tasks move from creation to completion, including validation and database state transitions.

![Flowchart: Task Lifecycle & CRUD](/docs/images/tasks.png)

---

> [!NOTE]
> All task interactions are logged into the system audit trail (in development), allowing teams to see the historical progression of work through the workspace.
