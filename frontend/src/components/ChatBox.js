import { useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Box, TextField, IconButton, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";

export default function ChatBox() {
  const { messages, sendMessage } = useContext(ChatContext);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <Paper
      elevation={4}
      sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Typography variant="h6" gutterBottom>
        💬 AI Chat
      </Typography>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          mb: 2,
          p: 1,
          border: "1px solid #ddd",
          borderRadius: "8px",
          bgcolor: "#fafafa",
        }}
      >
        {messages.map((msg, idx) => (
          <Message key={idx} sender={msg.sender} text={msg.text} />
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
