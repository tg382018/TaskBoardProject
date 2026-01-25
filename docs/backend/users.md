# 👤 Users & Profiles Module

The Users module serves as the central identity and personalization layer of TaskBoard. It manages user metadata, profile preferences, and system-wide productivity statistics.

---

## 🛠️ Core Capabilities

### 🔹 1. Profile Management

Users can manage their digital identity with built-in safeguards. The module handles profile updates, avatar orchestration, and preference persistence.

> [!TIP]
> **Privacy First:** Sensitive data (like email addresses) is handled with strict access control, ensuring that user information is only visible to authorized project members when collaboration requires it.

### 🔹 2. Productivity Analytics

The system tracks high-level user activity to generate personal productivity insights:

- **Task completion rates:** Historical data on how many tasks a user finishes.
- **Engagement metrics:** Tracking comments and project contributions.
- **Data Source:** Statistics are aggregated from **MongoDB** and optimized for retrieval via **Redis caching**.

### 🔹 3. Identity Verification & Lifecycle

Beyond simple profile edits, the module integrates with the security kernel:

- **Verification Status:** Tracking if a user has completed the two-step verification process.
- **Account Recovery:** Hooks for managing account-level changes following secure OTP verification.

---

## 🔐 Technical Implementation Details

| Feature            | Implementation             | Side Effects                    |
| :----------------- | :------------------------- | :------------------------------ |
| **Profile Update** | REST PATCH `/users/me`     | Updates JWT if metadata changes |
| **Get Statistics** | REST GET `/users/me/stats` | Triggers Redis Cache check      |
| **Self Deletion**  | REST DELETE `/users/me`    | Publishes `user.deleted` event  |

> [!IMPORTANT]
> **State Consistency:** When a user profile is updated, the **Socket Bridge** may be used to propagate the new "Display Name" or "Avatar" to any active project rooms the user is currently collaborating in.

---

## 📊 Flow Diagrams

### User Profile & Stats Flow

A deep dive into how user data is retrieved, modified, and how statistics are computed across the storage layers.

![Sequence Diagram: Profile & Stats Lifecycle](/docs/images/user.png)

---

> [!NOTE]
> All user-related endpoints are strictly limited to the **Authenticated Owner**, preventing any horizontal privilege escalation where one user can modify another's profile.
