import { handleUserMessage } from "../services/agentService.js";

export default function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("⚡ Client connected");

    socket.on("chat_message", async (msg) => {
      console.log("💬 User:", msg);
      const { reply, tasks } = await handleUserMessage(msg);

      // Send chat response back
      socket.emit("chat_response", reply);

      // Always sync tasks
      io.emit("task_update", tasks);
    });
  });
}
