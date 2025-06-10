export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  socket: `${API_BASE_URL}`,
  auth: {
    signup: `${API_BASE_URL}/auth/signup`,
    login: `${API_BASE_URL}/auth/login`,
  },
  tasks: {
    getAll: `${API_BASE_URL}/tasks`,
    create: `${API_BASE_URL}/tasks`,
    update: (id: string) => `${API_BASE_URL}/tasks/${id}`,
    delete: (id: string) => `${API_BASE_URL}/tasks/${id}`,
  },
  users: {
    getAll: `${API_BASE_URL}/users`,
    update: `${API_BASE_URL}/users/update`,
  },
  events: {
    getAll: `${API_BASE_URL}/events`,
  },
};
