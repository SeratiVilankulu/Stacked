import { useCallback, useEffect, useState } from "react";
import api from "../lib/api.js";
import { AuthContext } from "./auth-context.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Starts as true so the nav can hold back until we know the answer, instead of flashing the Sign In button for a moment on every page load.
  const [isLoading, setIsLoading] = useState(true);

  // Asks the server who is signed in. The auth cookie is httpOnly, so the browser attaches it automatically and JS never has to read it.
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/user");
      const loaded = res.data?.data?.user ?? null;
      setUser(loaded);
      return loaded;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await refreshUser();
      if (!cancelled) setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
