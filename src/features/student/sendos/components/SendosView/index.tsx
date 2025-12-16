"use client";

import { MySendos } from "@/components/MySendos";
import { SendosTransaction } from "@/features/student/sendos/queries";
import { format } from "date-fns";
import { SendoTransaction } from "../SendoTransaction";

interface SendosViewProps {
  transactions: SendosTransaction[];
}

export default function SendosView({ transactions }: SendosViewProps) {
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = format(new Date(transaction.date), "dd MMM");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, SendosTransaction[]>);

  let totalSendos = 0;
  transactions.forEach(t => totalSendos += t.amount)

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="pb-4 font-baloo text-[30px]">
        My sendos
      </h1>
      <MySendos sendosAmount={totalSendos} showTitle={false} />

      <div className="space-y-8 pt-8 pl-2">
        {Object.entries(groupedTransactions).map(([date, transactionsOnDate]) => (
          <div key={date}>
            <h2 className="font-baloo-2 font-bold text-[#0E0420] mb-4">{date}</h2>
            <ul className="space-y-4">
              {transactionsOnDate.map((transaction) => (
                <SendoTransaction
                  key={transaction.id}
                  title={transaction.description}
                  description={transaction.chapterName || ""}
                  sendosAmount={transaction.amount}
                  iconUrl="/quiz_todo_logo.svg"
                />
              ))}
            </ul>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-center text-gray-500">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}
