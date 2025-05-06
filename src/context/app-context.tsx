"use client";

import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { getToken } from "@/utils/services";
import { Users } from "@/types/dto/users/Users";
import { TokenType } from "@/types/enums/TokenType";
import AppContextData from "@/types/enums/AppContextData";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { api } from "@/services/api";

interface SettingsProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextData>({
  user: null,
  setUser: () => {},
  loading: true,
  userId: NaN,
  setUserId: () => {},
});

export function AppContextProvider({ children }: SettingsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<Users | null>(null);
  const [userId, setUserId] = useState<number>(NaN);

  const publicRoutes = ["/login", "/register"];

  const updateUserData = async () => {
    try {
      const token = getToken(TokenType.USER);
      if (!token && !publicRoutes.includes(pathname)) {
        redirect("/login");
        return;
      }

      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch latest user data
      const response = await api.getCurrentUser();
      const userData = response.user;

      // Check if role has changed
      if (user && user.role !== userData.role) {
        toast.info('Your role has been updated');
      }

      setUser(userData);
      setUserId(userData.id);
      setLoading(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      if (!publicRoutes.includes(pathname)) {
        redirect("/login");
      }
    }
  };

  useEffect(() => {
    updateUserData();

    // Set up polling interval to check for role changes
    const pollInterval = setInterval(updateUserData, 30000); // Check every 30 seconds

    // Listen for changes to both user data and token in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "USER" || e.key === "token") {
        updateUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [pathname, router]);

  const value: AppContextData = {
    user,
    setUser,
    loading,
    userId,
    setUserId,
  };

  return (
    <AppContext.Provider value={value}>
      {loading ? <Progress /> : children}
    </AppContext.Provider>
  );
}
