"use client";

import { useEffect, useState } from "react";

type TimerProps = {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
};

export const Timer = ({ initialTime, onTimeUp }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="bg-sky-100 text-sky-700 font-bold px-4 py-2 rounded-xl shadow-md border border-sky-300 text-lg w-fit mx-auto">
      ⏱ Time Left: {formatTime(timeLeft)}
    </div>
  );
};
