"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type Role = "ADMIN" | "USER";

interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  token: string | null;
  role: Role | null;
  setToken: (token: string) => void;
  register: (
    email: string,
    password: string,
    role: "ADMIN" | "USER"
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    const decoded = jwtDecode<JwtPayload>(newToken);
    setTokenState(newToken);
    setRole(decoded.role);
  };

  const register = async (
    email: string,
    password: string,
    role: "ADMIN" | "USER"
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      }
    );
    console.log("\n🚀 ~\n response:\t", response);
    if (!response.ok) throw new Error("Registration failed");
    const data = await response.json();
    setToken(data.accessToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTokenState(null);
    setRole(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      try {
        const decoded = jwtDecode<JwtPayload>(stored);
        setTokenState(stored);
        setRole(decoded.role);
      } catch {
        logout(); // in case of corrupt token
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, role, setToken, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
};
