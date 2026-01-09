import { fetchFromStrapi } from '@/lib/strapi';
import { Badge } from '@/types/badge';
import { SelectedPlot } from '@/types/enrollment';

export interface ProfileData {
  archetype: string;
  totalSendos: number;
  earnedBadges: Badge[];
  selectedPlot?: SelectedPlot | null;
}

export async function getMyStudentProfile() {
  const data = await fetchFromStrapi<ProfileData>(
    '/profile/my'
  );
  return data;
}
