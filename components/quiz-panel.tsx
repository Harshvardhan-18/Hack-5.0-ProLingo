"use client";

import { Card } from "@/app/lesson/card";
import { Timer } from "@/components/timer";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { useState } from "react";


type Question = {
    question: string;
    options: string[];
    correct: number;
};

type Props = {
    userImageSrc: string;
    userName: string;
    questions: Question[]; // ✅ array of 5 questions
};

export const QuizPanel = ({ userImageSrc, userName, questions }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);

    const currentQuestion = questions[currentIndex];

    const handleAnswerClick = (index: number) => {
        if (isSubmitted || quizComplete) return;
        setSelectedOption(index);
        setIsSubmitted(true);

        // Move to next question after short delay
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
                setSelectedOption(null);
                setIsSubmitted(false);
            } else {
                setQuizComplete(true);
            }
        }, 1000); // 1s delay to show correct/wrong status
    };

    const handleTimeUp = () => {
        setQuizComplete(true);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <h1 className="text-center font-bold text-sky-600 text-3xl my-6">Live Quiz</h1>

            <div className="w-full flex items-start justify-between gap-8">
                {/* Left: Current User */}
                <div className="flex flex-col items-center">
                    <Avatar className="border bg-sky-500 h-16 w-16">
                        <AvatarImage src={userImageSrc} />
                    </Avatar>
                    <p className="font-semibold text-neutral-800 mt-2">{userName}</p>
                </div>

                {/* Center: Quiz Box */}
                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl text-center">
                    <Timer initialTime={120} onTimeUp={handleTimeUp} />

                    {quizComplete ? (
                        <h2 className="font-bold text-xl text-green-600 mt-6">Quiz Completed 🎉</h2>
                    ) : (
                        <>
                            <h2 className="font-bold text-xl text-neutral-800 mb-4">
                                Q{currentIndex + 1}: {currentQuestion.question}
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, i) => (
                                    <Card
                                        key={i}
                                        id={i}
                                        text={option}
                                        shortcut={(i + 1).toString()}
                                        imageSrc={null}
                                        audioSrc={null}
                                        selected={selectedOption === i}
                                        onClick={() => handleAnswerClick(i)}
                                        disabled={isSubmitted}
                                        status={
                                            isSubmitted
                                                ? i === currentQuestion.correct
                                                    ? "correct"
                                                    : selectedOption === i
                                                        ? "wrong"
                                                        : "none"
                                                : "none"
                                        }
                                        type="SELECT"
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Opponent */}
                <div className="flex flex-col items-center">
                    <Avatar className="border bg-violet-500 h-16 w-16">
                        <AvatarImage src="" />
                    </Avatar>
                    <p className="font-semibold text-neutral-800 mt-2">Opponent</p>
                </div>
            </div>
        </div>
    );
};
