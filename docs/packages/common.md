# 🔗 @packages/common - Shared Logic

Validation schemas and constants shared between frontend and backend.

---

## 📋 Validation Schemas

| Schema          | File                | Used In              |
| :-------------- | :------------------ | :------------------- |
| `authSchema`    | `auth.schema.js`    | Login, Register, OTP |
| `taskSchema`    | `task.schema.js`    | Task CRUD            |
| `projectSchema` | `project.schema.js` | Project CRUD         |
| `commentSchema` | `comment.schema.js` | Comments             |
| `userSchema`    | `user.schema.js`    | Profile updates      |

---

## 🎯 Constants

```javascript
// constants.js
export const TaskStatus = {
    TODO: "Todo",
    IN_PROGRESS: "InProgress",
    DONE: "Done",
};

export const TaskPriority = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
};
```

> [!IMPORTANT]
> Using shared constants prevents frontend/backend enum mismatches.
