"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export type AdminSidebarMode = "expanded" | "icon" | "hidden";

const STORAGE_KEY = "sba-admin-sidebar-mode";

type Ctx = {
  mode: AdminSidebarMode;
  setMode: (mode: AdminSidebarMode) => void;
  /** Desktop: cycle expanded → icon → hidden → expanded. Mobile: expanded ↔ hidden. */
  cycleMode: () => void;
  isMobile: boolean;
};

const AdminSidebarModeContext = createContext<Ctx | null>(null);

function readStored(): AdminSidebarMode | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "expanded" || v === "icon" || v === "hidden") return v;
  } catch {
    /* ignore */
  }
  return null;
}

function isMobileViewport() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
  );
}

export function AdminSidebarModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  // Start hidden to avoid a flash-open sheet on mobile before hydrate.
  const [mode, setModeState] = useState<AdminSidebarMode>("hidden");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (isMobileViewport()) {
      // Mobile: never icon rail; default closed.
      setModeState(stored === "expanded" ? "expanded" : "hidden");
    } else {
      setModeState(stored ?? "expanded");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (isMobile && mode === "icon") {
      setModeState("hidden");
    }
  }, [isMobile, mode, hydrated]);

  const setMode = useCallback((next: AdminSidebarMode) => {
    const resolved =
      isMobileViewport() && next === "icon" ? "hidden" : next;
    setModeState(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, resolved);
    } catch {
      /* ignore */
    }
  }, []);

  const cycleMode = useCallback(() => {
    setModeState((prev) => {
      let next: AdminSidebarMode;
      if (isMobileViewport()) {
        next = prev === "expanded" ? "hidden" : "expanded";
      } else if (prev === "expanded") {
        next = "icon";
      } else if (prev === "icon") {
        next = "hidden";
      } else {
        next = "expanded";
      }
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ mode, setMode, cycleMode, isMobile }),
    [mode, setMode, cycleMode, isMobile]
  );

  return (
    <AdminSidebarModeContext.Provider value={value}>
      {children}
    </AdminSidebarModeContext.Provider>
  );
}

export function useAdminSidebarMode() {
  const ctx = useContext(AdminSidebarModeContext);
  if (!ctx) {
    throw new Error(
      "useAdminSidebarMode must be used within AdminSidebarModeProvider"
    );
  }
  return ctx;
}

/** Safe for navbar when not on admin surface. */
export function useAdminSidebarModeOptional() {
  return useContext(AdminSidebarModeContext);
}
