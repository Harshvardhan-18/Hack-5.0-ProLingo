
'use client';

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FeedWrapper } from "@/components/feed-wrapper";
import { QuizPanel } from "@/components/quiz-panel";

const socket = io("http://localhost:3001"); // Adjust as needed

const sampleQuestions = [
    {
        question: "What is the output of 1 + '2' in JavaScript?",
        options: ["3", "12", "NaN", "undefined"],
        correct: 1,
    },
    {
        question: "Which company developed React?",
        options: ["Google", "Facebook", "Microsoft", "Amazon"],
        correct: 1,
    },
    {
        question: "What does typeof null return?",
        options: ["object", "null", "undefined", "boolean"],
        correct: 0,
    },
    {
        question: "Which method converts JSON to a JS object?",
        options: ["JSON.stringify", "JSON.parse", "parseJSON", "toObject"],
        correct: 1,
    },
    {
        question: "Which of the following is a JavaScript framework?",
        options: ["Laravel", "Django", "React", "Flask"],
        correct: 2,
    },
];

export default function QuizClient({
  userProgress,
  roomId,
}: {
  userProgress: any;
  roomId: string;
}) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!userProgress) return;

    socket.emit("join-room", {
      roomId,
      user: {
        id: userProgress.userId,
        name: userProgress.userName || "You",
        avatar: userProgress.userImageSrc,
        score: 0,
      },
    });

    socket.on("room-users", (roomUsers) => {
      setUsers(roomUsers);
    });

    return () => {
      socket.disconnect();
    };
  }, [userProgress, roomId]);

  return (
    <div className="flex px-6">
      <FeedWrapper>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 bg-muted p-3 rounded-xl shadow"
            >
              <img
                src={user.avatar}
                className="w-10 h-10 rounded-full object-cover"
                alt={user.name}
              />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  Score: {user.score}
                </p>
              </div>
            </div>
          ))}
        </div>

        <QuizPanel
          userImageSrc={userProgress.userImageSrc}
          userName={userProgress.userName || "You"}
          questions={sampleQuestions}
          socket={socket}
        />
      </FeedWrapper>
    </div>
  );
}
