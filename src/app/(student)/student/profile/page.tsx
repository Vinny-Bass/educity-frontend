import ProfileView from "@/features/student/profile/components/ProfileView";
import { getMyStudentProfile } from "@/features/student/profile/queries";
import { getStudentSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getStudentSession();
  if (!session) {
    redirect("/login");
  }

  const profileData = await getMyStudentProfile();

  return <ProfileView user={session.user} profileData={profileData} />;
}
