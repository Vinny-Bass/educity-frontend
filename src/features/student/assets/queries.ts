import { fetchFromStrapi } from '@/lib/strapi';

export interface AssetType {
  id: string;
  documentId: string;
  name: string;
  description: string;
  icon: string;
}

export interface Asset {
  id: string;
  documentId: string;
  title: string;
  assetType: AssetType;
  currentValue: number;
  purchasePrice: number;
  dateBought: string;
}

export interface AssetsResponse {
  totalAssets: number;
  totalValue: number;
  assets: Asset[];
}

export async function getMyAssets(): Promise<AssetsResponse> {
  const data = await fetchFromStrapi<AssetsResponse>(
    '/assets/my'
  );
  return data;
}

