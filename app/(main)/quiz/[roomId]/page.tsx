import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { QuizPanel } from "@/components/quiz-panel"; // ✅ import new component

const QuizPage = async () => {
    const userProgressData = await getUserProgress();
    const userSubscriptionData = await getUserSubscription();
    const [userProgress, userSubscription] = await Promise.all([
        userProgressData,
        userSubscriptionData,
    ]);

    if (!userProgress) {
        return <div className="p-4 text-red-500">Failed to load user progress.</div>;
    }

    const isPro = !!userSubscription?.isActive;

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
            question: "What does `typeof null` return?",
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


    return (
        <div className="flex px-6">
            <FeedWrapper>
                <QuizPanel
                    userImageSrc={userProgress.userImageSrc}
                    userName={userProgress.userName || "You"}
                    questions={sampleQuestions}
                />

            </FeedWrapper>
        </div>
    );
};

export default QuizPage;
