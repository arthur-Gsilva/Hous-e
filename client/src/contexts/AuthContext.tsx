"use client";

import { getProfile } from "@/services/profile";
import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { logout as logoutServer } from "@/services/profile";

type User = { id: number; email: string; admin: boolean } | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isError: boolean;
  refetchUser: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isError: false,
  refetchUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getProfile,
    retry: false, 
  });


  const logout = async () => {
    await logoutServer()
    queryClient.removeQueries(); 
    queryClient.setQueryData(["user"], null); 
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isError,
        refetchUser: refetch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
