"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions";
import { ProfileData } from "@/features/student/profile/queries";
import { User } from "@/types/user";
import Image from "next/image";

interface ProfileViewProps {
  user: User;
  profileData: ProfileData;
}

export default function ProfileView({ user, profileData }: ProfileViewProps) {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          {/* Placeholder for profile picture */}
          <span className="text-gray-500">Avatar</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">My Archetype</h2>
          <p className="text-gray-800">{profileData.archetype}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">My Sendos</h2>
          <p className="text-gray-800">{profileData.totalSendos}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">My Badges</h2>
          {profileData.earnedBadges.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-2">
              {profileData.earnedBadges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center text-center">
                  <Image
                    src={badge.logo.url}
                    alt={badge.name}
                    width={80}
                    height={80}
                    className="w-20 h-20"
                  />
                  <span className="text-sm mt-1">{badge.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No badges earned yet.</p>
          )}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button onClick={handleLogout} variant="destructive">
          Log Out
        </Button>
      </div>
    </div>
  );
}
