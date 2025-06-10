/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/auth";
import { API_ENDPOINTS } from "@/apis/apiEndpoints";

type TaskEvent = {
  id: string;
  title: string;
  status: string;
};

export const useSocket = (
  onTaskEvent: (
    task: TaskEvent,
    type: "created" | "updated" | "deleted"
  ) => void
) => {
  const { token } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(API_ENDPOINTS.socket, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    socket.on("task.created", (task: TaskEvent) => {
      console.log("📦 Task Created", task);
      onTaskEvent(task, "created");
    });

    socket.on("task.updated", (task: TaskEvent) => {
      console.log("🔄 Task Updated", task);
      onTaskEvent(task, "updated");
    });

    socket.on("task.deleted", (task: TaskEvent) => {
      console.log("🔄 Task deleted", task);
      onTaskEvent(task, "deleted");
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token]);
};
