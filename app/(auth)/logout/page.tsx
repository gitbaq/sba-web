"use client";
import { useAuth } from "@/utils/AuthContext";
import { useEffect } from "react";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    window.location.reload();
  }, [logout]);

  return <div>Logging out...</div>;
}
