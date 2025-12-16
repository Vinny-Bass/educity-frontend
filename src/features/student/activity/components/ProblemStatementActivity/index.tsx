"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProblemStatementSubmission,
} from "@/features/student/activity/queries";
import { useActivityStore } from "@/store/activity.store";
import { useEffect, useState } from "react";

interface ProblemStatementActivityProps {
  title?: string;
  description?: string;
  activityId: string;
}

export default function ProblemStatementActivity({
  title = "Craft your problem statement",
  description = "Answer each question below to clearly explain the problem your team wants to solve.",
  activityId,
}: ProblemStatementActivityProps) {
  const auth = useAuth();
  const enrollmentId = auth?.enrollmentId ?? null;

  const setIsCurrentActivityCompleted = useActivityStore(
    (state) => state.setIsCurrentActivityCompleted
  );
  const setCompletionPayload = useActivityStore(
    (state) => state.setCompletionPayload
  );

  const [who, setWho] = useState("");
  const [what, setWhat] = useState("");
  const [why, setWhy] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activityId || !enrollmentId) {
      setLoading(false);
      return;
    }

    const fetchSubmission = async () => {
      setLoading(true);
      try {
        const submission = await getProblemStatementSubmission(
          activityId,
          enrollmentId
        );

        if (submission) {
          setWho(submission.who ?? "");
          setWhat(submission.what ?? "");
          setWhy(submission.why ?? "");
        }
      } catch (error) {
        console.error("Failed to load problem statement submission", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [activityId, enrollmentId]);

  useEffect(() => {
    const trimmedWho = who.trim();
    const trimmedWhat = what.trim();
    const trimmedWhy = why.trim();

    const isValid =
      trimmedWho.length > 0 && trimmedWhat.length > 0 && trimmedWhy.length > 0;

    setIsCurrentActivityCompleted(isValid);

    if (isValid) {
      setCompletionPayload({
        type: "standard.problem_statement",
        data: {
          who: trimmedWho,
          what: trimmedWhat,
          why: trimmedWhy,
        },
      });
    } else {
      setCompletionPayload(null);
    }
  }, [who, what, why, setIsCurrentActivityCompleted, setCompletionPayload]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-lg font-baloo text-brand-purple">
          Loading problem statement...
        </div>
      </div>
    );
  }

  if (!enrollmentId) {
    return (
      <div className="mx-auto py-10 flex max-w-5xl flex-col justify-center px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="font-baloo-2 text-lg text-gray-600">
              We could not find your enrollment. Please refresh and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fieldConfigs = [
    {
      id: "problem-who",
      label: "Who?",
      value: who,
      onChange: setWho,
      placeholder: "Describe the audience or community facing this challenge.",
      inputType: "input" as const,
    },
    {
      id: "problem-what",
      label: "What?",
      value: what,
      onChange: setWhat,
      placeholder: "Explain the situation or pain point they experience.",
      inputType: "input" as const,
    },
    {
      id: "problem-why",
      label: "Why?",
      value: why,
      onChange: setWhy,
      placeholder: "Share why solving this problem is important.",
      inputType: "textarea" as const,
    },
  ];

  return (
    <div className="mx-auto py-4 flex max-w-6xl flex-col justify-center gap-4 px-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex-1">
        <h1 className="font-baloo text-[26px] font-normal text-[#0E0420] md:text-[26px]">
          {title}
        </h1>
        <p className="mt-4 max-w-xl font-baloo-2 text-[20px] font-medium text-[#5A5564] md:text-[18px]">
          {description}
        </p>
      </div>

      <div className="flex-1 max-w-2xl">
        <Card>
          <CardHeader className="rounded-t-[20px] bg-[#F3ECFF] px-4 py-3">
            <CardTitle className="font-baloo text-xl font-normal text-[#0E0420]">
              Who struggles with what, and why?
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            {fieldConfigs.map((field) => (
              <div
                key={field.id}
                className="w-full"
              >
                <label
                  htmlFor={field.id}
                  className="mb-1 block font-baloo text-base text-[#0E0420]"
                >
                  {field.label}
                </label>
                <div className="rounded-[16px] border-2 border-[#F3F3F3] px-4 py-2">
                  {field.inputType === "textarea" ? (
                    <textarea
                      id={field.id}
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
                      placeholder={field.placeholder}
                      className="h-[100px] w-full resize-none border-none bg-transparent font-baloo-2 text-base font-medium text-[#0E0420] shadow-none placeholder:text-[#C6C4CB] focus-visible:outline-none focus-visible:ring-0"
                    />
                  ) : (
                    <Input
                      id={field.id}
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
                      placeholder={field.placeholder}
                      className="h-[32px] w-full border-none bg-transparent px-0 font-baloo-2 text-base font-medium text-[#0E0420] shadow-none placeholder:text-[#C6C4CB] focus-visible:ring-0"
                    />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


