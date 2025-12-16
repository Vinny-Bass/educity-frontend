import { fetchFromStrapi } from '@/lib/strapi';
import { Badge } from '@/types/badge';

export interface ProfileData {
  archetype: string;
  totalSendos: number;
  earnedBadges: Badge[];
}

export async function getMyStudentProfile() {
  const data = await fetchFromStrapi<ProfileData>(
    '/profile/my'
  );
  return data;
}
