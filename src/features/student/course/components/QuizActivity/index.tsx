import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ActivityStub } from '@/features/student/activity/types';
import type { Activity } from '@/features/student/dashboard/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface QuizActivityProps {
  activity: Activity | ActivityStub;
  onComplete: () => void;
  onClose: () => void;
}

export function QuizActivity({ activity, onComplete, onClose }: QuizActivityProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = activity.quizQuestions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const pagination = { current: currentQuestionIndex + 1, total: questions.length };

  if (!currentQuestion) {
    return (
      <div className="bg-white p-6 rounded-[20px] text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">No questions available</h2>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  const handleAnswerSelect = (answerId: number) => {
    if (isSubmitted) return;
    setSelectedAnswerId(answerId);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerId(null);
      setIsSubmitted(false);
    } else {
      onComplete();
    }
  };

  const selectedAnswer = currentQuestion.answers.find(a => a.id === selectedAnswerId);
  const isCorrectAnswer = selectedAnswer?.isCorrect;
  const isWrongState = isSubmitted && !isCorrectAnswer;

  const handleGotIt = () => {
    handleNext();
  };

  return (
    <div className="grid w-full max-w-4xl mx-auto grid-cols-1 items-stretch gap-4 md:grid-cols-3 p-2 md:p-4">
      {/* Left Column: Info */}
      <div className="flex flex-col justify-between md:col-span-1 py-2">
        <div>
          <h1 className="font-baloo text-[22px] text-[#0E0420]">
            Quiz
          </h1>
          <p className="font-baloo-2 text-[16px] font-medium text-[#474250] mt-2 leading-normal">
            This quiz assesses comprehension of the core concepts presented.
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
             <Pagination
                current={pagination.current}
                total={pagination.total}
                className="shadow-md scale-90 origin-right"
             />
        </div>
      </div>

      {/* Right Column: Quiz Card */}
      <div className="relative w-full md:col-span-2">
        <Card className="shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] rounded-[20px] border-none bg-white overflow-hidden">
          <CardHeader className="bg-[#F3ECFF] px-4 py-3 rounded-r-[20px] rounded-bl-[20px]">
            <CardTitle className="font-baloo text-[20px] font-normal text-[#474250] leading-normal">
              {currentQuestion.questionText}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-3 bg-white relative min-h-[300px]">
            {currentQuestion.answers.map((answer, index) => {
               const isSelected = selectedAnswerId === answer.id;
               let containerClasses = "bg-[#F3F3F3] border-transparent";

               if (isSubmitted) {
                 if (answer.isCorrect) {
                    containerClasses = "bg-[#E7F9ED] border-green-500 border-2"; // Correct answer
                 } else if (isSelected && !answer.isCorrect) {
                    containerClasses = "bg-[#FDECEC] border-red-500 border-2"; // Wrong selection
                 }
               } else if (isSelected) {
                 containerClasses = "bg-[#EBEBEB] border-[#9056F5] border-2"; // Selected state
               }

               return (
                <div key={answer.id} className="relative">
                  <div
                    onClick={() => handleAnswerSelect(answer.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-[16px] cursor-pointer transition-all border-2 min-h-[48px]",
                      containerClasses
                    )}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#DCDBDE]">
                      <span className="font-baloo text-base font-bold text-[#474250]">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <span className="font-baloo-2 text-base font-semibold text-[#474250] flex-1 leading-tight">
                      {answer.text}
                    </span>
                  </div>
                   {isSubmitted && isSelected && !answer.isCorrect && answer.explanation && (
                      <div className="mt-2 ml-10 text-sm text-[#474250] bg-red-50 p-2 rounded-lg border border-red-100">
                        <span className="font-bold text-red-500 block mb-1">Incorrect</span>
                        {answer.explanation}
                      </div>
                    )}
                </div>
               );
            })}

            <div className="mt-6 flex justify-center relative">
               {!isSubmitted ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedAnswerId}
                    className={cn(
                      "h-[44px] w-full max-w-[160px] rounded-[10px] text-[18px] font-baloo font-normal transition-colors",
                      selectedAnswerId
                        ? "bg-[#9056F5] text-white hover:bg-[#7a40d9]"
                        : "bg-[#DCDBDE] text-white cursor-not-allowed"
                    )}
                  >
                    Confirm
                  </Button>
               ) : isWrongState ? (
                  <Button
                    onClick={handleGotIt}
                    className="h-[54px] w-full rounded-[10px] bg-[#ff5364] text-white hover:bg-[#ff3b4e] text-[22px] font-baloo font-normal"
                  >
                    Got it
                  </Button>
               ) : (
                  <Button
                    onClick={handleNext}
                    className="h-[44px] w-full max-w-[160px] rounded-[10px] bg-[#9056F5] text-white hover:bg-[#7a40d9] text-[18px] font-baloo font-normal"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                  </Button>
               )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
