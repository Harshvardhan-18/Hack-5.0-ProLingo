import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse, NextApiRequest } from "next";
import { questions } from "@/questions";
import { gemini } from "@/lib/gemini";

type Player = {
  id: string;
  name: string;
  score?: number;
  image: string;
  isHost: boolean;
};

const rooms: Record<
  string,
  {
    players: Player[];
    currentQuestion: any;
    correctAnswer: number | null;
    questionTimeout: NodeJS.Timeout | null;
    topic?: string;
  }
> = {};

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const anySocket = res.socket as any;
  if (!anySocket) {
    res.status(500).end("No socket server found");
    return;
  }

  if (anySocket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  const io = new SocketIOServer(anySocket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  anySocket.server.io = io;

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", (room, user) => {
      const { name, image } = user;

      if (!rooms[room]) {
        rooms[room] = {
          players: [],
          currentQuestion: null,
          correctAnswer: null,
          questionTimeout: null,
        };
      }
      socket.join(room);

      const alreadyExists = rooms[room].players.find((p) => p.id === socket.id);
      if (!alreadyExists) {
        const isHost = rooms[room].players.length === 0;

        rooms[room].players.push({
          id: socket.id,
          name,
          image,
          isHost,
        });
      }
      if (!rooms[room]) {
        console.error(`Room ${room} does not exist!`);
        return;
      }

      io.to(room).emit("roomUpdate", {
        players: rooms[room].players.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.image,
          isHost: p.isHost,
        })),
        hostId: rooms[room].players.find((p) => p.isHost)?.id,
      });
      console.log(`${name} joined room: ${room}`);
    });

    socket.on("startQuiz", (room) => {
      askNewQuestion(room);
    });

    socket.on("setTopic", async (room, topic) => {
      if (!rooms[room]) return;
      rooms[room].topic = topic;
      console.log(`Topic for room ${room}: ${topic}`);
    });

    socket.on("submitAnswer", (room, answerIndex) => {
      const currentPlayer = rooms[room].players.find((p) => p.id === socket.id);
      if (!currentPlayer) return;

      const correctIndex = rooms[room].correctAnswer;
      const isCorrect = correctIndex === answerIndex;

      currentPlayer.score = isCorrect
        ? (currentPlayer.score || 0) + 1
        : (currentPlayer.score || 0) - 1;

      clearTimeout(rooms[room].questionTimeout!);

      io.to(room).emit("answerResult", {
        playerName: currentPlayer.name,
        isCorrect,
        correctAnswer: correctIndex,
        scores: rooms[room].players.map((p) => ({
          name: p.name,
          image: p.image,
          score: p.score || 0,
        })),
      });

      const winner = rooms[room].players.find((p) => (p.score || 0) >= 5);
      if (winner) {
        io.to(room).emit("gameOver", { winner: winner.name });
        delete rooms[room];
      } else {
        askNewQuestion(room);
      }
    });

    socket.on("disconnect", () => {
      for (const room in rooms) {
        rooms[room].players = rooms[room].players.filter(
          (p) => p.id !== socket.id
        );
      }
      console.log("A user disconnected");
    });
  });

  async function askNewQuestion(room: string) {
    const roomData = rooms[room];
    if (!roomData || roomData.players.length === 0) return;

    try {
      let q;
      if (roomData.topic) {
        const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
          Generate a concise single multiple-choice question on the topic "${roomData.topic}". The question should cover a unique aspect of the topic and should not be similar to the previous questions. Include a variety of question types (e.g., conceptual, practical, theoretical) and ensure that the answers are diverse and thought-provoking. Format the response as follows:
          {
            "question": "Question text?",
            "answers": [
              { "text": "Option A", "correct": false },
              { "text": "Option B", "correct": true },
              { "text": "Option C", "correct": false },
              { "text": "Option D", "correct": false }
            ]
          }
        `;
    
        const result = await model.generateContent(prompt); // Ensure this returns valid content
        const text = result.response.text().trim(); // Ensure trimming is done properly

        // Check if the response contains JSON
        try {
            // Remove markdown (if any) and attempt to parse JSON
            if (text.startsWith("```json") && text.endsWith("```")) {
                q = JSON.parse(text.slice(7, -3).trim()); // Remove markdown formatting and parse
            } else {
                // Try parsing the raw text directly
                q = JSON.parse(text);
            }
        } catch (error) {
            console.error("Failed to parse AI response as JSON:", error);
            io.to(room).emit("error", { message: "Failed to generate AI question" });
            return;
        }
      } else {
        const index = Math.floor(Math.random() * questions.length);
        q = questions[index]; // Fallback static question
      }
    
      const correct = q.answers.findIndex((a: any) => a.correct);
      roomData.currentQuestion = q;
      roomData.correctAnswer = correct;

      io.to(room).emit("newQuestion", {
        question: q.question,
        answers: q.answers.map((a: any) => a.text),
        timer: 20,
      });

      roomData.questionTimeout = setTimeout(() => {
        io.to(room).emit("answerResult", {
          playerName: "No one",
          isCorrect: false,
          correctAnswer: correct,
          scores: roomData.players.map((p) => ({
            name: p.name,
            image: p.image,
            score: p.score || 0,
          })),
        });
        askNewQuestion(room);
      }, 20000);
    } catch (error) {
      console.error("Failed to fetch AI question from Gemini:", error);
      io.to(room).emit("error", { message: "Failed to generate AI question" });
    }
  }
}
