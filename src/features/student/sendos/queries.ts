import { fetchFromStrapi } from '@/lib/strapi';

export interface SendosTransaction {
  id: number;
  amount: number;
  date: string;
  description: string;
  chapterName: string | null;
}

export async function getMySendosTransactions() {
  const data = await fetchFromStrapi<SendosTransaction[]>(
    '/sendos/my'
  );
  return data;
}
