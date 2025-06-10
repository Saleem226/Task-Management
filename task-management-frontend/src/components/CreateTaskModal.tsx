"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { TaskStatus } from "@/types/tasks";
import { useAuth } from "@/context/auth";
import { API_ENDPOINTS } from "@/apis/apiEndpoints";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTaskModal({ onClose, onCreated }: Props) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState<TaskStatus>("PENDING");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(API_ENDPOINTS.users.getAll, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    };
    fetchUsers();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await axios.post(
      API_ENDPOINTS.tasks.create,
      { title, description, assignedToId: assignedTo, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    onCreated(); // refresh task list
    onClose(); // close modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">Create Task</h2>

        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full p-2 border rounded"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        >
          <option value="">Assign to...</option>
          {users.map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
