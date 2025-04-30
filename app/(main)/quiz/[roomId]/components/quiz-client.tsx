"use client";

import { QuizPanelSocket } from "@/components/quiz-panel";
import { useEffect, useState } from "react";

type Props = {
  userProgress:{
      userName: string;
      userImageSrc: string;
  }|null;
  roomId: string;
};

const QuizClient = ({ userProgress, roomId }: Props) => {
  const [joined, setJoined] = useState(false);
  

  useEffect(() => {
    if (userProgress?.userName && roomId) {
      setJoined(true);
    }
  }, [userProgress, roomId]);

  if (!userProgress || !joined) {
    return (
      <div className="text-center mt-20">
        <p className="text-lg text-gray-500">Joining room {roomId}...</p>
      </div>
    );
  }


  return (
    <QuizPanelSocket
      userName={userProgress.userName}
      userImageSrc={userProgress.userImageSrc}
      room={roomId}
    />
  );
};

export default QuizClient;
