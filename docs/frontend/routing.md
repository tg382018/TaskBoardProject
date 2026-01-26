# 🧭 Routing & Navigation

TaskBoard uses **React Router v7** with protected routes and layout-based organization.

---

## 📍 Route Table

| Path            | Component     | Auth Required |
| :-------------- | :------------ | :------------ |
| `/login`        | Login         | ❌            |
| `/register`     | Register      | ❌            |
| `/dashboard`    | Dashboard     | ✅            |
| `/projects`     | ProjectsList  | ✅            |
| `/projects/:id` | ProjectDetail | ✅            |
| `/tasks/:id`    | TaskDetail    | ✅            |
| `/profile`      | Profile       | ✅            |
| `/docs`         | Documentation | ❌            |

---

## 🛡️ Protected Routes

Routes requiring authentication are wrapped with a guard that:

1. Checks for valid session cookies
2. Redirects to `/login` if unauthorized
3. Preserves the intended destination for post-login redirect

> [!NOTE]
> Authentication state is managed by Zustand store and synced with cookie-based sessions.
