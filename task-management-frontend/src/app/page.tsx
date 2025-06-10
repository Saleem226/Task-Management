"use client";

import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { role } = useAuth();
  const router = useRouter();

  if (role === "ADMIN") {
    router.push("/admin");
  } else if (role === "USER") {
    router.push("/dashboard");
  } else {
    router.push("/login");
  }

  return <></>;
}
