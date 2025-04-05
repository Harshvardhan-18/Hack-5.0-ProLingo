
import { getUserProgress } from "@/db/queries";
import QuizClient from "./components/quiz-client";

const QuizPage = async ({ params }: { params: { roomId: string } }) => {
  const userProgress = await getUserProgress();

  return <QuizClient userProgress={userProgress} roomId={params.roomId} />;

};

export default QuizPage;
