# 🔔 Notifier Consumer

The Notifier consumer is the link between the Worker's background world and the User's live experience. It filters system events and forwards relevant updates to the frontend via the **Socket Bridge**.

---

## 🛠️ Filtered Propagation

Not every background event should blink on the user's screen. The Notifier uses a strict **Broadcastable Guard** list:

- `task.created` / `task.updated` / `task.deleted`
- `comment.added` / `comment.deleted`
- `task.assigned`

### 🔹 Logic Flow:

1. **Filter:** Checks if `event.type` exists in the `BROADCASTABLE_EVENTS` list.
2. **Relay:** If valid, it forwards the entire payload to the **Notify Service**.
3. **Bridge Call:** The Notify service performs a `POST` request to the API's internal bridge.
4. **Socket Emission:** The API pushes the data to the specific Project Room.

---

## 📊 Broadcast Topology

| Category          | Event Types               | Audience              |
| :---------------- | :------------------------ | :-------------------- |
| **Tasks**         | Created, Updated, Deleted | All Project Members   |
| **Collaboration** | Comments Added            | All Project Members   |
| **Assignments**   | Task Assigned             | The specific Assignee |

---

> [!TIP]
> **Minimal Payload:** The notifier ensures that overhead is kept low by only broadcasting events that have a direct impact on the current view of the web application.
