"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * useAsyncSafe prevents state updates on unmounted components and provides an isMounted check.
 */
export function useAsyncSafe() {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeCallback = useCallback(
    <T extends (...args: unknown[]) => unknown>(callback: T) => {
      return (...args: Parameters<T>) => {
        if (isMountedRef.current) {
          return callback(...args);
        }
      };
    },
    []
  );

  return { isMounted: () => isMountedRef.current, safeCallback };
}
