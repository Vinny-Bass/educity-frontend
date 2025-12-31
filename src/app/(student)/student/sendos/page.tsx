import { AssetsResponse, getMyAssets } from "@/features/student/assets/queries";
import SendosView from "@/features/student/sendos/components/SendosView";
import { getMySendosTransactions } from "@/features/student/sendos/queries";
import { StrapiApiError } from "@/types/errors";

export default async function SendosPage() {
  const transactions = await getMySendosTransactions();

  // Fetch assets data
  let assetsData: AssetsResponse = {
    totalAssets: 0,
    totalValue: 0,
    assets: [],
  };

  try {
    assetsData = await getMyAssets();
  } catch (error) {
    if (error instanceof StrapiApiError) {
      if (error.status === 403) {
        console.warn("Assets endpoint returned 403 - endpoint may not be available yet or permission denied");
      } else if (error.status === 500) {
        console.error("Assets endpoint returned 500 - server error in Strapi backend. Check Strapi server logs.");
      } else {
        console.error("Failed to fetch assets:", error.message, `(${error.status})`);
      }
    } else {
      console.error("Failed to fetch assets:", error);
    }
  }

  return (
    <SendosView
      transactions={transactions}
      totalAssets={assetsData.totalAssets}
      totalValue={assetsData.totalValue}
      assets={assetsData.assets}
    />
  );
}
