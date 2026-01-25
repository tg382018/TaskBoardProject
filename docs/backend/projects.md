# 📁 Projects & Workspaces Module

The Projects module serves as the primary organizational unit of TaskBoard. orchestrating how teams collaborate, manage resources, and track progress across isolated workspaces.

---

## 🛠️ Core Capabilities

### 🔹 1. Workspace Isolation

Each project functions as a secure container. Tasks, members, and activity logs are strictly scoped to their respective project IDs, ensuring data integrity across different teams or clients.

> [!TIP]
> **Performance Optimization:** We use MongoDB indexing on `projectId` fields across the Tasks and Comments collections to ensure near-instant retrieval even as data volume grows.

### 🔹 2. Dynamic Membership Management

The module handles a complex membership lifecycle:

- **Role-Based Access:** Standardizing permissions for Owners and Members.
- **Invitations:** (Upcoming) Automated member onboarding via email events.
- **Conflict Prevention:** Strict checks to ensure users aren't duplicated within a project and that owners cannot be removed without a transfer of ownership.

### 🔹 3. Event-Driven Propagation

Project-level changes are broadcasted system-wide to maintain synchronization:

- **RabbitMQ Integration:** When a project is deleted, a `project.deleted` event triggers the **Worker** to perform a "cascade delete" of all associated tasks and files.
- **Real-time Sync:** Team member additions or project name changes are immediately pushed to all active members via the **Socket Bridge**.

---

## 🔐 Technical Implementation Details

| Feature        | implementation           | Side Effects                      |
| :------------- | :----------------------- | :-------------------------------- |
| **Creation**   | REST POST `/projects`    | Publishes `project.created` event |
| **Membership** | REST POST `/:id/members` | Updates Socket Rooms via Bridge   |
| **Cleanup**    | REST DELETE `/:id`       | Asynchronous Task/Member purge    |

> [!IMPORTANT]
> **Data Safety:** To prevent accidental data loss, deletions are subject to strict **Owner-only** verification and a "Pre-flight" check on the client-side.

---

## 📊 Flow Diagrams

### Project Operations Lifecycle

This diagram illustrates the standard operations for creating, listing, and retrieving project data.

![Flowchart: Project CRUD Operations](/docs/images/projects1.png)

### Team & Membership Management

Detailed view of the logic behind adding members and the cascading effects of project deletion.

![Sequence Diagram: Membership & Deletion Flow](/docs/images/projects2.png)

---

> [!NOTE]
> All project-related routes are protected by the `authMiddleware`, ensuring that only authenticated users with valid sessions can access or modify workspace data.
