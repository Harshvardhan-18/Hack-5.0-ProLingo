import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, user }) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", user);
  });

  socket.on("start-quiz", ({ roomId, questions }) => {
    io.to(roomId).emit("quiz-started", questions);
  });

  socket.on("submit-answer", ({ roomId, answer, userId }) => {
    // Validate and update points
    io.to(roomId).emit("answer-result", { userId, isCorrect: true });
  });

  socket.on("disconnect", () => {
    // Cleanup if needed
  });
});
