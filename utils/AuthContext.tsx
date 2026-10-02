"use client";
import { User } from "@/types/types";
import { isTokenExpired } from "@/utils/authUtils";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { baseURL } from "./endpoints/endpoints";
import { readJson } from "@/lib/http";

/** Read a cookie value without truncating on `=` (JWT payloads can contain padding). */
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split("; ")) {
    if (part.startsWith(prefix)) {
      const raw = part.slice(prefix.length);
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
  }
  return null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  userEmail: string | null;
  username: string | null;
  isAdmin: boolean;
  login: (token: string, username: string, email: string) => void;
  logout: () => void;
  /** Clear session after API 401 (e.g. JWT signed with an old secret). */
  handleUnauthorized: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Username `admin` always allowed. Optional emails via NEXT_PUBLIC_ADMIN_EMAILS.
 * Later: replace with ROLE_ADMIN from the API user payload. */
function computeIsAdmin(username: string | null, email: string | null): boolean {
  if (username && username.toLowerCase() === "admin") return true;
  const allowed = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (email && allowed.includes(email.toLowerCase())) return true;
  return false;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const logout = useCallback(() => {
    clearCookie("token");
    clearCookie("username");
    clearCookie("email");
    setToken(null);
    setUser(null);
    setUserEmail(null);
    setUsername(null);
    setIsAuthenticated(false);
  }, []);

  const handleUnauthorized = useCallback(() => {
    logout();
  }, [logout]);

  const fetchUser = useCallback(
    async (name: string, authToken: string) => {
      try {
        const response = await fetch(`${baseURL}/secure/user/v1/${name}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.ok) {
          const userData = await readJson(response, null);
          if (userData) setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    },
    [handleUnauthorized]
  );

  useEffect(() => {
    const cookieToken = readCookie("token");
    const cookieUsername = readCookie("username");
    const cookieEmail = readCookie("email");

    if (cookieToken && !isTokenExpired(cookieToken)) {
      setToken(cookieToken);
      setIsAuthenticated(true);
      if (cookieEmail) setUserEmail(cookieEmail);
      if (cookieUsername) {
        setUsername(cookieUsername);
        void fetchUser(cookieUsername, cookieToken);
      }
    } else if (cookieToken) {
      // Expired or undecodable — drop stale localhost cookie.
      logout();
    }
  }, [fetchUser, logout]);

  const login = (newToken: string, name: string, email: string) => {
    writeCookie("token", newToken);
    writeCookie("username", name);
    writeCookie("email", email);
    setToken(newToken);
    setIsAuthenticated(true);
    setUsername(name);
    setUserEmail(email);
    void fetchUser(name, newToken);
  };

  const isAdmin = computeIsAdmin(username, userEmail);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        userEmail,
        username,
        isAdmin,
        login,
        logout,
        handleUnauthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
