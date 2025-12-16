import SendosView from "@/features/student/sendos/components/SendosView";
import { getMySendosTransactions } from "@/features/student/sendos/queries";

export default async function SendosPage() {
  const transactions = await getMySendosTransactions();

  return <SendosView transactions={transactions} />;
}
