"use client";

import { MySendos } from "@/components/MySendos";
import AssetsView from "@/features/student/assets/components/AssetsView";
import { Asset } from "@/features/student/assets/queries";
import { SendosTransaction } from "@/features/student/sendos/queries";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SendoTransaction } from "../SendoTransaction";
import {
  SendosTransactionsFilter,
  SendosTransactionsFilterValue,
} from "../SendosTransactionsFilter";

interface SendosViewProps {
  transactions: SendosTransaction[];
  totalAssets: number;
  totalValue: number;
  assets: Asset[];
}

type TabType = "sendos" | "assets";

export default function SendosView({
  transactions,
  totalAssets,
  totalValue,
  assets,
}: SendosViewProps) {
  const searchParams = useSearchParams();
  const assetsParam = searchParams.get("assets");

  const [activeTab, setActiveTab] = useState<TabType>(assetsParam ? "assets" : "sendos");
  const [transactionsFilter, setTransactionsFilter] =
    useState<SendosTransactionsFilterValue>("all");

  const filteredTransactions = transactions.filter((t) => {
    if (transactionsFilter === "earned") return t.amount > 0;
    if (transactionsFilter === "spent") return t.amount < 0;
    return true;
  });

  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const date = format(new Date(transaction.date), "dd MMM");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, SendosTransaction[]>);

  let totalSendos = 0;
  transactions.forEach(t => totalSendos += t.amount);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-8 mb-6">
        <button
          onClick={() => setActiveTab("sendos")}
          className={`font-baloo text-[24px] font-normal transition-colors cursor-pointer ${
            activeTab === "sendos"
              ? "text-[#0E0420] font-bold border-b-2 border-[#FCD34D] pb-2"
              : "text-[#87838F]"
          }`}
        >
          My Sendos
        </button>
        <button
          onClick={() => setActiveTab("assets")}
          className={`font-baloo text-[24px] font-normal transition-colors cursor-pointer ${
            activeTab === "assets"
              ? "text-[#0E0420] font-bold border-b-2 border-[#FCD34D] pb-2"
              : "text-[#87838F]"
          }`}
        >
          My Assets
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "sendos" ? (
        <>
          <MySendos sendosAmount={totalSendos} showTitle={false} />
          <div className="pt-6">
            <SendosTransactionsFilter
              value={transactionsFilter}
              onChange={setTransactionsFilter}
            />
          </div>
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
            {filteredTransactions.length === 0 && (
              <p className="text-center text-gray-500">No transactions yet.</p>
            )}
          </div>
        </>
      ) : (
        <AssetsView
          totalAssets={totalAssets}
          totalValue={totalValue}
          assets={assets}
          sendosBalance={totalSendos}
        />
      )}
    </div>
  );
}
