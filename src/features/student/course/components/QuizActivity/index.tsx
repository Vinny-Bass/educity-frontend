import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ActivityStub } from '@/features/student/activity/types';
import type { Activity } from '@/features/student/dashboard/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

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
        <Card className="shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] rounded-[20px] border-[3px] border-[#5BB5E1] bg-white overflow-hidden">
          {/* Cat mascot at top */}
          <div className="absolute -top-10 left-8 z-10">
            <Image
              src="/cat.svg"
              alt="Cat mascot"
              width={80}
              height={68}
              className="w-20 h-17"
            />
          </div>

          <CardHeader className="bg-[#F3ECFF] px-4 py-6 pt-12 rounded-r-[20px] rounded-bl-[20px]">
            <CardTitle className="font-baloo-2 text-[22px] font-semibold text-[#474250] leading-normal">
              {currentQuestion.questionText}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-3 bg-white relative min-h-[300px]">
            {/* Answer Options */}
            {currentQuestion.answers.map((answer, index) => {
               const isSelected = selectedAnswerId === answer.id;
               let containerClasses = "bg-[#F3F3F3] border-transparent";
               let isDisabled = isSubmitted && isWrongState;

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
                    onClick={() => !isDisabled && handleAnswerSelect(answer.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-[16px] transition-all border-2 min-h-[48px]",
                      containerClasses,
                      isDisabled ? "cursor-default opacity-60" : "cursor-pointer"
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
                </div>
               );
            })}

            {/* Wrong Answer Feedback */}
            {isWrongState && selectedAnswer?.explanation && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 px-6 py-8">
                <Image
                  src="/welcome_cat.svg"
                  alt="Cat character"
                  width={180}
                  height={180}
                  className="mb-4"
                />
                <h3 className="font-baloo-2 text-[24px] font-bold text-[#ff5364] mb-4">
                  Close! Try again!
                </h3>
                <p className="font-baloo-2 text-[16px] font-normal text-[#474250] text-center max-w-md mb-6 leading-relaxed">
                  {selectedAnswer.explanation}
                </p>
                <Button
                  onClick={handleGotIt}
                  className="h-[54px] w-full max-w-sm rounded-[10px] bg-[#ff5364] text-white hover:bg-[#ff3b4e] text-[22px] font-baloo-2 font-bold"
                >
                  Next
                </Button>
              </div>
            )}

            {/* Submit/Next Buttons - Only show when not in wrong state */}
            {!isWrongState && (
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
                 ) : (
                    <Button
                      onClick={handleNext}
                      className="h-[44px] w-full max-w-[160px] rounded-[10px] bg-[#9056F5] text-white hover:bg-[#7a40d9] text-[18px] font-baloo font-normal"
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                    </Button>
                 )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
