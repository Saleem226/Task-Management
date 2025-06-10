"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // new import
import "react-toastify/dist/ReactToastify.css"; // new import
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import TaskList from "@/components/TaskList";
import axios from "axios";
import { Task } from "@/types/tasks";
import { useSocket } from "@/hooks/useSocket";
import { API_ENDPOINTS } from "@/apis/apiEndpoints";

export default function UserDashboard() {
  const { token, isLoading } = useProtectedRoute(["USER"]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const res = await axios.get(API_ENDPOINTS.tasks.getAll, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  useSocket((task, type) => {
    toast.info(`Task ${type.toUpperCase()}: ${task.title}`, {
      position: "top-center",
      autoClose: 8000,
    });
    fetchTasks();
  });

  const updateStatus = async (taskId: string, status: Task["status"]) => {
    await axios.put(
      API_ENDPOINTS.tasks.update(taskId),
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks();
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  if (isLoading || !token) {
    return <div className="p-4 text-center">🔒 Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <TaskList tasks={tasks} isAdmin={false} onUpdateStatus={updateStatus} />
      <ToastContainer />
    </div>
  );
}
