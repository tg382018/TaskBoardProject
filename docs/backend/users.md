# 👤 Users & Profiles Module

The Users module serves as the central identity and personalization layer of TaskBoard. It manages user metadata, profile preferences, and daily activity summaries.

---

## 🛠️ Core Capabilities

### 🔹 1. Profile Management

Users can manage their digital identity with built-in safeguards. The module handles profile updates with strict validation.

> [!TIP]
> **Privacy First:** Sensitive data (like email addresses) is handled with strict access control, ensuring that user information is only visible to authorized project members when collaboration requires it.

> [!IMPORTANT]
> **Security Enhancement:** User password hashes are automatically stripped from all API responses using Mongoose `toJSON` transforms, preventing accidental data exposure.

### 🔹 2. Daily Summary

The system provides personalized daily activity summaries for users:

- **Task Overview:** Summary of tasks assigned, completed, and in progress
- **Project Activity:** Recent changes across user's projects
- **Engagement Metrics:** Tracking comments and contributions

### 🔹 3. Identity Verification & Lifecycle

Beyond simple profile edits, the module integrates with the security kernel:

- **Verification Status:** Tracking if a user has completed the two-step OTP verification process.
- **Cookie-Based Sessions:** Profile data is resolved from the secure `accessToken` cookie.

---

## 🔐 Technical Implementation Details

| Feature            | Implementation             | Description                           |
| :----------------- | :------------------------- | :------------------------------------ |
| **Get Profile**    | `GET /users/me`            | Returns current user's profile data   |
| **Update Profile** | `PATCH /users/me`          | Updates user name (2-50 chars)        |
| **Daily Summary**  | `GET /users/daily-summary` | Returns personalized activity summary |

> [!NOTE]
> **Statistics Endpoint:** User statistics are available via the dedicated Stats module at `GET /stats/me`.

---

## 📡 API Endpoints

| Endpoint               | Method | Description                | Auth Required |
| ---------------------- | ------ | -------------------------- | ------------- |
| `/users/me`            | GET    | Get current user profile   | ✅            |
| `/users/me`            | PATCH  | Update profile (name)      | ✅            |
| `/users/daily-summary` | GET    | Get daily activity summary | ✅            |

### Request/Response Examples

**Update Profile:**

```json
// PATCH /users/me
{
    "name": "John Updated"
}
```

---

## 📊 Flow Diagrams

### User Profile & Stats Flow

A deep dive into how user data is retrieved, modified, and how statistics are computed across the storage layers.

![Sequence Diagram: Profile & Stats Lifecycle](/docs/images/user.png)

---

> [!NOTE]
> All user-related endpoints are strictly limited to the **Authenticated Owner**, preventing any horizontal privilege escalation where one user can modify another's profile.
