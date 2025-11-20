import React, { createContext, useContext, useState, useEffect } from "react";
import { Authority } from "@/types";
import { authAPI } from "@/services/api";

interface AuthContextType {
  authority: Authority | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedAuthority = localStorage.getItem("authority");

      if (token && storedAuthority) {
        try {
          // Immediately set the user from localStorage to prevent logout on refresh
          const parsedAuthority = JSON.parse(storedAuthority);
          setAuthority(parsedAuthority);

          // Then verify token is still valid in the background
          try {
            const user = await authAPI.getMe();
            setAuthority(user); // Update with fresh data
          } catch (error) {
            // Token is invalid, clear storage
            console.error("Token verification failed:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("authority");
            setAuthority(null);
          }
        } catch (error) {
          // Error parsing stored data, clear it
          localStorage.removeItem("token");
          localStorage.removeItem("authority");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("authority", JSON.stringify(user));
      setAuthority(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const logout = () => {
    setAuthority(null);
    localStorage.removeItem("token");
    localStorage.removeItem("authority");
  };

  return (
    <AuthContext.Provider
      value={{
        authority,
        login,
        logout,
        isAuthenticated: !!authority,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
