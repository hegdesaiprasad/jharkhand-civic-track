import React, { createContext, useContext, useState, useEffect } from "react";
import { Authority } from "@/types";

interface AuthContextType {
  authority: Authority | null;
  login: (authority: Authority) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authority, setAuthority] = useState<Authority | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("authority");
    if (stored) {
      setAuthority(JSON.parse(stored));
    }
  }, []);

  const login = (auth: Authority) => {
    setAuthority(auth);
    localStorage.setItem("authority", JSON.stringify(auth));
  };

  const logout = () => {
    setAuthority(null);
    localStorage.removeItem("authority");
  };

  return (
    <AuthContext.Provider
      value={{
        authority,
        login,
        logout,
        isAuthenticated: !!authority,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
