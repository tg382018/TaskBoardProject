# 🎨 @packages/ui - Component Library

A collection of **shadcn/ui** based components shared across the frontend.

---

## 📦 Available Components (10)

| Component      | File              | Description               |
| :------------- | :---------------- | :------------------------ |
| **Button**     | `button.jsx`      | Multiple variants & sizes |
| **Badge**      | `badge.jsx`       | Status indicators         |
| **Card**       | `card.jsx`        | Container with sections   |
| **Dialog**     | `dialog.jsx`      | Modal windows             |
| **Input**      | `input.jsx`       | Text input                |
| **Label**      | `label.jsx`       | Form labels               |
| **ScrollArea** | `scroll-area.jsx` | Custom scrollbar          |
| **Sheet**      | `sheet.jsx`       | Side panels               |
| **Skeleton**   | `skeleton.jsx`    | Loading state             |
| **Table**      | `table.jsx`       | Data tables               |

---

## 🛠️ Utilities

### cn() - Class Name Merger

```javascript
import { cn } from "@packages/ui";

cn("base-class", condition && "conditional-class");
```

> [!NOTE]
> Components are built on **Radix UI** primitives with **Tailwind CSS** styling.
