import io from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// REST helper
export const fetchTasks = async () => {
  const res = await fetch(`${API_URL}/api/tasks`);
  return res.json();
};

export const createTask = async (task) => {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
};

// WebSocket connection
export const socket = io(API_URL, { transports: ["websocket"] });
