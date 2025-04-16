"use client";

import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { getToken } from "@/utils/services";
import { Users } from "@/types/dto/users/Users";
import { TokenType } from "@/types/enums/TokenType";
import AppContextData from "@/types/enums/AppContextData";
import { Progress } from "@/components/ui/progress";

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

  useEffect(() => {
    const token = getToken(TokenType.USER);
    const userToken: Users | null = token ? (JSON.parse(token) as Users) : null;

    if (!userToken && !publicRoutes.includes(pathname)) {
      redirect("/login");
      return;
    }

    if (!userToken) {
      setLoading(false);
      return;
    }

    setUser(userToken);
    setLoading(false);
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
