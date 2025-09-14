import ChatBox from "../components/ChatBox";
import TaskList from "../components/TaskList";
import { Box, Container, Grid } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{ height: "80vh" }}>
          <ChatBox />
        </Grid>
        <Grid item xs={12} md={6} sx={{ height: "80vh" }}>
          <TaskList />
        </Grid>
      </Grid>
    </Container>
  );
}
