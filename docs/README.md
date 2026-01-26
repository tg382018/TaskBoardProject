# TaskBoard Documentation

A real-time collaborative project management application built with modern web technologies. TaskBoard enables teams to organize tasks, track progress, and communicate seamlessly through an intuitive interface.

---

## 🛠️ Technologies

| Layer         | Technologies                                          |
| :------------ | :---------------------------------------------------- |
| **Frontend**  | React 19, Vite, TanStack Query, Zustand, Tailwind CSS |
| **Backend**   | Node.js, Express, MongoDB, Redis, RabbitMQ            |
| **Real-time** | Socket.io                                             |
| **Auth**      | JWT (Cookie-based), OTP Verification                  |

---

## 🖥️ Frontend

- [Architecture Overview](frontend/overview.md)
- [Routing & Navigation](frontend/routing.md)
- [State Management](frontend/state-management.md)
- [Authentication Flow](frontend/auth.md)
- [Real-time Updates](frontend/realtime.md)
- [UI Components](frontend/components.md)

---

## 🔧 Backend

### Core

- [Architecture Overview](backend/overview.md)
- [Server Startup](startup.md)

### Modules

- [Authentication](backend/auth.md)
- [Projects](backend/projects.md)
- [Tasks](backend/tasks.md)
- [Users](backend/users.md)
- [Comments](backend/comments.md)
- [Statistics](backend/stats.md)

### Infrastructure

- [Event System](events.md)
- [Real-time Sockets](sockets.md)

---

## ⚙️ Worker

- [Worker Overview](worker/overview.md)
- [Taskboard Consumer](worker/consumers/taskboard.md)
- [Daily Summary Job](worker/jobs/daily-summary.md)

---

## 📦 Packages

- [Packages Overview](packages/overview.md)
- [@packages/ui](packages/ui.md)
- [@packages/common](packages/common.md)

---

## 📮 API Testing

- [Postman Collection](postman/README.md)
