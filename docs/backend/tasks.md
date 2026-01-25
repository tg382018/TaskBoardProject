# ✅ Tasks & Life Cycle Module

The Tasks module is the fundamental unit of work within TaskBoard. It provides a robust engine for managing, assigning, and tracking individual activities with millisecond precision and real-time synchronization.

---

## 🛠️ Core Capabilities

### 🔹 1. Precision Task CRUD

Management of task data is handled with strict schema validation. Every task is linked to a `projectId`, ensuring multi-tenant isolation and secure access control.

> [!TIP]
> **Data Integrity:** We use atomic updates to ensure that concurrent status changes (e.g., two users moving a task to "Done") are handled gracefully without data races.

### 🔹 2. Dynamic Status & Priority

- **Workflow State:** Tasks follow a customizable lifecycle (To Do -> In Progress -> Done).
- **Prioritization:** Native support for priority weighting to help teams focus on high-impact work.
- **Assignments:** Real-time assignment logic that notifies users the moment they are added to a task.

### 🔹 3. Instant Real-time Synchronization

The Tasks module is the primary consumer of the **Socket Bridge**.

- **Broadcast:** Every update (name change, status move, or comment) triggers an immediate project-wide broadcast.
- **Deltas:** Instead of reloading the page, the frontend receives specific event deltas, making the UI feel like a native desktop application.

---

## 🔐 Technical Implementation Details

| Feature            | Implementation           | Socket Event    |
| :----------------- | :----------------------- | :-------------- |
| **Status Change**  | REST PATCH `/:id/status` | `task.updated`  |
| **New Assignment** | REST PATCH `/:id`        | `task.assigned` |
| **Deletion**       | REST DELETE `/:id`       | `task.deleted`  |

> [!IMPORTANT]
> **Ownership & Permission:** A task can only be modified by members of the parent project. Unauthorized attempts are rejected at the middleware level with a `403 Forbidden` status.

---

## 📊 Flow Diagrams

### Task Operations Lifecycle

A comprehensive look at how tasks move from creation to completion, including validation and database state transitions.

![Flowchart: Task Lifecycle & CRUD](/docs/images/tasks.png)

---

> [!NOTE]
> All task interactions are logged into the system audit trail (in development), allowing teams to see the historical progression of work through the workspace.
