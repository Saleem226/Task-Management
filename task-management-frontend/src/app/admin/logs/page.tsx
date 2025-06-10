"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import axios from "axios";
import { API_ENDPOINTS } from "@/apis/apiEndpoints";

interface Event {
  id: string;
  taskId?: string;
  action: string;
  userId: string;
  userEmail: string;
  userRole: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export default function LogsPage() {
  const { token, role, isLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!token || role !== "ADMIN") {
      router.push("/login");
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.events.getAll, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error("Fetch events error:", err);
        setError("Failed to load event logs");
      }
    };

    fetchEvents();
  }, [token, role, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!token || role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Event Logs</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border p-4 rounded-lg">
                {event.taskId && (
                  <p>
                    <strong>Task ID:</strong> {event.taskId}
                  </p>
                )}
                <p>
                  <strong>Action:</strong> {event.action}
                </p>
                <p>
                  <strong>User:</strong> {event.userEmail} ({event.userRole})
                </p>
                <p>
                  <strong>Details:</strong> {JSON.stringify(event.details)}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(event.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
