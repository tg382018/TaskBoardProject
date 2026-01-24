import { create } from "zustand";

/**
 * UI Store - manages global UI state
 * - Sidebar collapse state
 * - Modal visibility states
 */
export const useUiStore = create((set) => ({
    // Sidebar
    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

    // Mobile sidebar
    mobileSidebarOpen: false,
    setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
    toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),

    // Global loading state
    globalLoading: false,
    setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));
