# 📦 Shared Packages Architecture

TaskBoard uses a **monorepo** structure with shared packages to ensure consistency across applications.

---

## 📊 Package Overview

![Packages Overview](/docs/images/frontend/packages-overview.png)

---

## 🔗 Import Paths

| Package       | Import Path                  |
| :------------ | :--------------------------- |
| UI Components | `@packages/ui`               |
| Schemas       | `@packages/common/schemas`   |
| Constants     | `@packages/common/constants` |

> [!TIP]
> Shared validation schemas ensure frontend and backend enforce identical rules.
