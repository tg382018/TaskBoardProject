# 📊 State Management

TaskBoard uses a **hybrid state strategy** combining Zustand for client state and TanStack Query for server state.

---

## 🔄 TanStack Query Patterns

- **Automatic caching** with configurable stale times
- **Background refetching** for fresh data
- **Optimistic updates** for instant UI feedback
- **Query invalidation** on mutations

> [!TIP]
> Socket events trigger `queryClient.invalidateQueries()` for real-time sync without polling.
