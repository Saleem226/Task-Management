import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

export const useProtectedRoute = (allowedRoles: ("ADMIN" | "USER")[]) => {
  const { token, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!token) {
        router.push("/login");
      } else if (role && !allowedRoles.includes(role)) {
        router.push(role === "ADMIN" ? "/admin" : "/dashboard");
      }
    }
  }, [token, role, isLoading, router, allowedRoles]);

  return { token, role, isLoading };
};
