import { ActivityStub, PlotAuctionCompletionPayload, ProblemStatementCompletionPayload, ProgressStub, TeamIdeaCompletionPayload, TeamJoinCompletionPayload, TeamOption, TeamRenameCompletionPayload } from "@/features/student/activity/types";
import { fetchFromStrapi, postToStrapi } from "@/lib/strapi";
import qs from "qs";

export type ActivityCompletionPayload = {
  type: string;
  data?:
    | TeamJoinCompletionPayload
    | TeamRenameCompletionPayload
    | TeamIdeaCompletionPayload
    | ProblemStatementCompletionPayload
    | PlotAuctionCompletionPayload
    | null;
};

export async function getChapterActivities(chapterDocId: string) {
  const query = qs.stringify({
    filters: { chapter: { documentId: { $eq: chapterDocId } } },
    fields: [
      "title",
      "type",
      "order",
      "sendosReward",
      "standardActivityType",
      "teamActivityType",
      "recapHeader",
    ],
    sort: ["order:asc"],
  });

  return fetchFromStrapi<ActivityStub[]>(`/activities?${query}`);
}

export async function getChapterProgress(
  enrollmentId: string,
  chapterId: string
) {
  const query = qs.stringify({
    populate: {
      activity: { fields: ["id"] },
      enrollment: { fields: ["id"] },
    },
    filters: {
      $and: [
        { activityStatus: "completed" },
        { enrollment: { documentId: { $eq: enrollmentId } } },
        { activity: { chapter: { documentId: { $eq: chapterId } } } },
      ],
    },
  });

  return fetchFromStrapi<ProgressStub[]>(
    `/student-activity-progresses?${query}`
  );
}

export async function getActivity(activityDocId: string) {
  const query = qs.stringify({
    populate: {
      quizQuestions: {
        populate: ['answers'],
      },
      plots: true,
    },
  });
  const result = await fetchFromStrapi<ActivityStub>(`/activities/${activityDocId}?${query}`);
  console.log('getActivity result:', JSON.stringify(result, null, 2));
  console.log('plots in result:', result.plots);
  return result;
}

export async function completeActivity(
  activityDocId: string,
  enrollmentDocId: string,
  options: ActivityCompletionPayload
) {
  const body = {
    activityId: activityDocId,
    enrollmentId: enrollmentDocId,
    payload: options,
  };

  return postToStrapi(`/student-activity-progress/complete`, body);
}

export async function getTeams(classDocId: string) {
  const query = qs.stringify({
    filters: { class: { documentId: { $eq: classDocId } } },
    populate: {
      enrollments: {
        populate: {
          student: {
            fields: ["id", "username"],
          },
        },
      },
    },
    fields: ["id", "documentId", "name", "cheer", "idea", "isLocked"],
  });

  return fetchFromStrapi<TeamOption[]>(`/teams?${query}`);
}

export async function getProblemStatementSubmission(
  activityDocId: string,
  enrollmentDocId: string
) {
  const query = qs.stringify({
    filters: {
      activity: { documentId: { $eq: activityDocId } },
      enrollment: { documentId: { $eq: enrollmentDocId } },
    },
    fields: ["submission"],
    pagination: { limit: 1 },
  });

  const submissions = await fetchFromStrapi<
    { submission: ProblemStatementCompletionPayload | null }[]
  >(`/student-activity-progresses?${query}`);

  if (Array.isArray(submissions) && submissions.length > 0) {
    return submissions[0]?.submission ?? null;
  }

  return null;
}
