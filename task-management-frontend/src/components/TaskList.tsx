"use client";
import { Task } from "@/types/tasks";

interface Props {
  tasks: Task[];
  isAdmin: boolean;
  onUpdateStatus?: (taskId: string, status: Task["status"]) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (task: Task) => void; // new
}

export default function TaskList({
  tasks,
  isAdmin,
  onUpdateStatus,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="p-4 border rounded shadow-sm">
          <div className="flex justify-between">
            <h2 className="font-bold">{task.title}</h2>
            {isAdmin && (
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(task)}
                    className="text-blue-500 text-sm"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">{task.description}</p>
          <p className="text-xs text-gray-500">Status: {task.status}</p>
          {isAdmin && task.assignedTo && (
            <p className="text-xs text-gray-500">
              Assigned to: {task.assignedTo.email}
            </p>
          )}
          {!isAdmin && onUpdateStatus && (
            <select
              className="mt-2 border rounded p-1 text-sm"
              value={task.status}
              onChange={(e) =>
                onUpdateStatus(task.id, e.target.value as Task["status"])
              }
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          )}
        </div>
      ))}
    </div>
  );
}
