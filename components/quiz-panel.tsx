"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/lesson/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import io from "socket.io-client";
import { Crown } from "lucide-react";


const socket = io("http://localhost:3000", {
  path: "/api/socket",
});

type Question = {
  question: string;
  answers: string[];
};

type Player = {
  image: string;
  name: string;
  score?: number;
  isHost?: boolean;
};

type Props = {
  userName: string;
  room: string;
  userImageSrc: string;
};

export const QuizPanelSocket = ({ userName, room, userImageSrc }: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [waitingForPlayers, setWaitingForPlayers] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [timeleft, setTimeleft] = useState<number>(0);
  const [scores, setScores] = useState<Player[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [hostId, setHostId] = useState<string | null>(null);

  useEffect(() => {
    socket.emit("joinRoom", room, { name: userName, image: userImageSrc,isHost:true });

    socket.on("roomUpdate",(data)=>{
      setPlayers(data.players);
      setHostId(data.hostId);
    });

    socket.on("newQuestion", (data) => {
      setWaitingForPlayers(false);
      setQuizStarted(true);
      setCurrentQuestion({
        question: data.question,
        answers: data.answers,
      });
      setSelected(null);
      setAnswered(false);
      setTimeleft(data.timer);
    });

    socket.on("answerResult", (data) => {
      toast(
        `${data.playerName} got it ${data.isCorrect ? "right ✅" : "wrong ❌"}`
      );
      setScores(data.scores);
    });

    socket.on("gameOver", (data) => {
      setWinner(data.winner);
      setQuizComplete(true);
    });
    
    return () => {
      socket.off("roomUpdate");
      socket.off("newQuestion");
      socket.off("answerResult");
      socket.off("gameOver");
    };
  }, []);

  useEffect(() => {
    if (timeleft === 0) return;

    const interval = setInterval(() => {
      setTimeleft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeleft]);


  const handleAnswer = (index: number) => {
    if (answered || quizComplete) return;
    setSelected(index);
    setAnswered(true);
    socket.emit("submitAnswer", room, index);
  };

  if (quizComplete && winner) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold text-green-600">
          🏆 Winner: {winner}
        </h1>
      </div>
    );
  }
  const opponent = scores.find((p) => p.name !== userName);

  if (waitingForPlayers && !quizStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-sky-600 mb-6">Waiting for players...</h1>
        <div className="text-center text-green-600 pb-6 font-semibold">
                Room Code: {room}
              </div>
        <div className="grid grid-cols-2 gap-4">
          {players.map((player) => (
            <div key={player.name} className="flex flex-col items-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src={player.image} />
              </Avatar>
              <p className="mt-2 font-semibold">{player.name}</p>
              {player.id === hostId && <Crown size={16} className="text-yellow-500 animate-bounce drop-shadow-lg" />}
            </div>
          ))}
        </div>
  
        {/* Start Quiz button */}
        {socket.id === hostId && (  
        <button
          onClick={() => socket.emit("startQuiz", room)}
          className="mt-8 px-6 py-3 bg-green-500 text-white rounded-full text-lg font-bold hover:bg-green-600"
        >
          Start Quiz
        </button>
        )}
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-center font-bold text-sky-600 text-3xl my-6">
        Live Quiz
      </h1>
      <div className="bg-gray-100 p-4 flex rounded-lg shadow-md mb-6">
        <p className="text-lg  font-semibold  text-gray-800">{room}</p>
      </div>

      <div className="flex items-start justify-between gap-8 w-full">
        <div className="flex flex-col items-center">
          <Avatar className="border bg-sky-500 h-16 w-16">
            <AvatarImage src={userImageSrc} />
          </Avatar>
          <p className="font-semibold text-neutral-800 mt-2">{userName}</p>
          <p className="text-neutral-500 text-sm">
            {scores.find((p) => p.name === userName)?.score || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl text-center">
          <div className="text-center font-bold text-xl text-red-500 mb-4">
            {timeleft > 0 ? `Time Left: ${timeleft}s` : "Time's up!"}
          </div>
          {!currentQuestion ? (
            <p className="mt-6">Waiting for the next question...</p>
          ) : (
            <>
              <h2 className="font-bold text-xl mb-4 text-neutral-800">
                {currentQuestion.question}
              </h2>
              <div className="grid grid-rows-2 gap-4">
                {currentQuestion.answers.map((option, i) => (
                  <Card
                    key={i}
                    id={i}
                    text={option}
                    shortcut={`${i + 1}`}
                    selected={selected === i}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    status={
                      answered ? (selected === i ? "correct" : "wrong") : "none"
                    }
                    type="SELECT"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center">
          
            
              <Avatar className="border bg-violet-500 h-16 w-16">
                <AvatarImage src={opponent?.image || ""} />
              </Avatar>
              <p className="font-semibold text-neutral-800 mt-2">
                {opponent?.name || "Opponent"}
              </p>
              <p className="text-neutral-500 text-sm">
                {opponent?.score || 0}
              </p>
            
           
        </div>
      </div>
    </div>
  );
};
