"use client";

import { createContext, useContext, useState } from "react";

type UserProfile = {
  id: string;
  username: string;
  email: string;
  avatar_url?: string | null;
};

type UserContextType = {
  user: UserProfile | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
});

export function UserProvider({
  children,
  serverProfile,
}: {
  children: React.ReactNode;
  serverProfile: UserProfile | null;
}) {
  const [user] = useState<UserProfile | null>(serverProfile);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
