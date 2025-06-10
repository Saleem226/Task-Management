"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function Navbar() {
  const { token, role, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const homeLink =
    token && role === "ADMIN" ? "/admin" : token ? "/dashboard" : "/";

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={homeLink} className="text-xl font-bold">
          Task Manager
        </Link>
        <div className="space-x-4">
          {!isLoading && !token && (
            <>
              <Link href="/login" className="hover:text-blue-400">
                Log In
              </Link>
              <Link href="/signup" className="hover:text-blue-400">
                Sign Up
              </Link>
            </>
          )}
          {!isLoading && token && (
            <>
              <Link href="/profile" className="hover:text-blue-400">
                Profile
              </Link>
              {role === "ADMIN" && (
                <Link href="/admin/logs" className="hover:text-blue-400">
                  Logs
                </Link>
              )}
              <button onClick={handleLogout} className="hover:text-blue-400">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
