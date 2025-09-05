"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
};

type UserContextType = {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export function UserProvider({
  children,
  serverProfile,
}: {
  children: ReactNode;
  serverProfile: UserProfile | null;
}) {
  const [user, setUser] = useState<UserProfile | null>(serverProfile);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
