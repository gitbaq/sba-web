"use client";
import { User } from "@/types/types";
import { isTokenExpired } from "@/utils/authUtils";
import { createContext, useContext, useEffect, useState } from "react";
import { baseURL } from "./endpoints/endpoints";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  userEmail: string | null;
  username: string | null;
  isAdmin: boolean;
  login: (token: string, username: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Comma-separated emails allowed to edit. Username `admin` is always allowed. */
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

  const fetchUser = async (name: string, authToken: string) => {
    try {
      const response = await fetch(`${baseURL}/secure/user/v1/${name}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const cookieUsername = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="))
      ?.split("=")[1];
    const cookieEmail = document.cookie
      .split("; ")
      .find((row) => row.startsWith("email="))
      ?.split("=")[1];

    if (cookieToken && !isTokenExpired(cookieToken)) {
      setToken(cookieToken);
      setIsAuthenticated(true);
      if (cookieEmail) setUserEmail(decodeURIComponent(cookieEmail));
      if (cookieUsername) {
        const name = decodeURIComponent(cookieUsername);
        setUsername(name);
        void fetchUser(name, cookieToken);
      }
    }
  }, []);

  const login = (newToken: string, name: string, email: string) => {
    document.cookie = `token=${newToken}; path=/`;
    document.cookie = `username=${encodeURIComponent(name)}; path=/`;
    document.cookie = `email=${encodeURIComponent(email)}; path=/`;
    setToken(newToken);
    setIsAuthenticated(true);
    setUsername(name);
    setUserEmail(email);
    void fetchUser(name, newToken);
  };

  const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setToken(null);
    setUser(null);
    setUserEmail(null);
    setUsername(null);
    setIsAuthenticated(false);
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
