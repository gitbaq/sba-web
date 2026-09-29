"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AUDIENCE_STORAGE_KEY,
  AudienceId,
  isAudienceId,
} from "@/lib/audience";

type AudienceState = {
  audience: AudienceId | null;
  ready: boolean;
  setAudience: (id: AudienceId) => void;
  clearAudience: () => void;
};

export function useAudience(): AudienceState {
  const [audience, setAudienceState] = useState<AudienceId | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(AUDIENCE_STORAGE_KEY);
      setAudienceState(isAudienceId(stored) ? stored : null);
    } catch {
      setAudienceState(null);
    } finally {
      setReady(true);
    }
  }, []);

  const setAudience = useCallback((id: AudienceId) => {
    try {
      window.localStorage.setItem(AUDIENCE_STORAGE_KEY, id);
    } catch {
      /* ignore quota / private mode */
    }
    setAudienceState(id);
  }, []);

  const clearAudience = useCallback(() => {
    try {
      window.localStorage.removeItem(AUDIENCE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setAudienceState(null);
  }, []);

  return { audience, ready, setAudience, clearAudience };
}
