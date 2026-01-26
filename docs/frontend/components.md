# 🎨 UI Components

TaskBoard uses a layered component architecture with shared and app-specific components.

---

## 📦 Shared Components (@packages/ui)

Reusable across the entire monorepo:

| Component         | Description                          |
| :---------------- | :----------------------------------- |
| `Button`          | Primary, secondary, ghost variants   |
| `Card`            | Container with header/content/footer |
| `Dialog`          | Modal dialogs                        |
| `Input` / `Label` | Form inputs                          |
| `Table`           | Data tables                          |
| `Badge`           | Status indicators                    |
| `Skeleton`        | Loading placeholders                 |

---

## 🎯 App-Specific Components

Located in `apps/web/src/app/components/ui/`:

| Component      | Description          |
| :------------- | :------------------- |
| `AlertDialog`  | Confirmation dialogs |
| `DropdownMenu` | Context menus        |
| `Select`       | Dropdown selects     |
| `Toast`        | Notifications        |

---

## 📊 Widgets

Dashboard widgets in `components/widgets/`:

- **UserStatsWidget** - User productivity stats
- **DailySummaryWidget** - Daily activity feed

> [!NOTE]
> Shared components are imported from `@packages/ui`, app-specific from `@/app/components/ui`.
