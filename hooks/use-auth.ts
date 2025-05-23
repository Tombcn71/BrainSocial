"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  return {
    user,
    isLoading,
    isAuthenticated,
    accessToken: session?.accessToken,
  };
}
