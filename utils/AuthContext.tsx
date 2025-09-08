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
  login: (token: string, username: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const fetchUser = async (username: string, authToken: string) => {
    return null;
    try {
      const response = await fetch(`${baseURL}/secure/user/v1/${username}`, {
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
      if (cookieEmail) {
        setUserEmail(cookieEmail);
      }
      if (cookieUsername) {
        fetchUser(cookieUsername, cookieToken);
      }
    }
  }, []);

  const login = (newToken: string, username: string, email: string) => {
    document.cookie = `token=${newToken}`;
    document.cookie = `username=${username}`;
    document.cookie = `email=${email}`;
    setToken(newToken);
    setIsAuthenticated(true);
    fetchUser(username, newToken);
  };

  const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setToken(null);
    setUser(null);
    setUserEmail(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, userEmail, login, logout }}
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
