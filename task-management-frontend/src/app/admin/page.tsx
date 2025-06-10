/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import TaskList from "@/components/TaskList";
import axios from "axios";
import { Task } from "@/types/tasks";
import CreateTaskModal from "@/components/CreateTaskModal";
import EditTaskModal from "@/components/EditTaskModal";
import { API_ENDPOINTS } from "@/apis/apiEndpoints";

export default function AdminPage() {
  const { token, role, isLoading } = useProtectedRoute(["ADMIN"]);
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTasks = async () => {
    const res = await axios.get(API_ENDPOINTS.tasks.getAll, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  const deleteTask = async (taskId: string) => {
    await axios.delete(API_ENDPOINTS.tasks.delete(taskId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  useEffect(() => {
    if (!isLoading && role !== "ADMIN") {
      // redirect non-admins away from the admin page
      router.push("/dashboard");
    }
  }, [isLoading, role, router]);

  if (isLoading || !token) {
    return <div className="p-4 text-center">🔒 Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Tasks (Admin)</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          + Create Task
        </button>
      </div>

      <TaskList
        tasks={tasks}
        isAdmin={true}
        onDelete={deleteTask}
        onEdit={(task) => setEditTask(task)}
      />

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreated={fetchTasks}
        />
      )}

      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onUpdated={fetchTasks}
        />
      )}
    </div>
  );
}
