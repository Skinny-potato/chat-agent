import { ListItem, ListItemText, Chip, Checkbox } from "@mui/material";

export default function TaskItem({ task }) {
  return (
    <ListItem
      sx={{
        mb: 1,
        border: "1px solid #eee",
        borderRadius: 2,
        bgcolor: "white",
      }}
      secondaryAction={
        <Chip
          label={task.priority || "normal"}
          color={
            task.priority === "high"
              ? "error"
              : task.priority === "medium"
              ? "warning"
              : "success"
          }
          size="small"
        />
      }
    >
      <Checkbox checked={task.status === "done"} />
      <ListItemText
        primary={task.title}
        secondary={task.due_date ? `Due: ${task.due_date}` : ""}
      />
    </ListItem>
  );
}
