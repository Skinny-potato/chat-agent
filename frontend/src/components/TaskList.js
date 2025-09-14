import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Paper, Typography, List } from "@mui/material";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const { tasks } = useContext(ChatContext);

  return (
    <Paper elevation={4} sx={{ p: 2, height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        📋 Tasks
      </Typography>
      <List sx={{ maxHeight: "75vh", overflowY: "auto" }}>
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </List>
    </Paper>
  );
}
