# ⚡ Real-time Updates

TaskBoard uses **Socket.io** for instant data synchronization across all connected clients.

---

## 🔌 Socket Provider

The `SocketProvider` establishes and manages the WebSocket connection:

- Authenticates via cookie on connect
- Manages reconnection logic
- Provides socket instance via context

---

## 📡 Socket Events

| Event                  | Trigger        | UI Effect            |
| :--------------------- | :------------- | :------------------- |
| `task.created`         | New task added | Refresh task list    |
| `task.updated`         | Task modified  | Update task in place |
| `comment.added`        | New comment    | Append to comments   |
| `project.member.added` | Member invited | Refresh member list  |

> [!TIP]
> Joining a project room (`socket.emit("project:join", id)`) subscribes to all its events.
