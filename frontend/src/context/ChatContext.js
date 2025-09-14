import { createContext, useState, useEffect } from "react";
import { socket, fetchTasks } from "../services/api";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Initial load
    fetchTasks().then(setTasks);

    // Listen for task updates
    socket.on("task_update", (updatedTasks) => setTasks(updatedTasks));

    // Listen for chat
    socket.on("chat_response", (msg) => {
      setMessages((prev) => [...prev, { sender: "agent", text: msg }]);
    });

    return () => {
      socket.off("task_update");
      socket.off("chat_response");
    };
  }, []);

  const sendMessage = (msg) => {
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    socket.emit("chat_message", msg);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, tasks }}>
      {children}
    </ChatContext.Provider>
  );
};
