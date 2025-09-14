import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import chatSocket from "./sockets/chatSocket.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// REST routes
app.use("/api/tasks", taskRoutes);

const server = http.createServer(app);

// WebSocket
const io = new Server(server, {
  cors: { origin: "*" },
});
chatSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
