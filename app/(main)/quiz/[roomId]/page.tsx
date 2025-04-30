
import { getUserProgress } from "@/db/queries";
import QuizClient from "./components/quiz-client";

const QuizPage = async ({ params }: { params: { roomId: string } }) => {
  const progress  = await getUserProgress();
  const {roomId}= await params;
  const userProgress = progress
    ? {
        userName: progress.userName,
        userImageSrc: progress.userImageSrc,
      }
    : null;
  return <QuizClient userProgress={userProgress} roomId={roomId} />;

};

export default QuizPage;
