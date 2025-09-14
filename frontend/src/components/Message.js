import { Box, Typography } from "@mui/material";

export default function Message({ sender, text }) {
  const isUser = sender === "user";
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Box
        sx={{
          p: 1.2,
          borderRadius: 2,
          bgcolor: isUser ? "primary.main" : "grey.300",
          color: isUser ? "white" : "black",
          maxWidth: "70%",
        }}
      >
        <Typography variant="body2">{text}</Typography>
      </Box>
    </Box>
  );
}
