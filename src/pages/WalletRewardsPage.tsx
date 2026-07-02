import { useState } from "react";
import { CreditCard, Gift, PlusCircle } from "lucide-react";
import { Footer } from "../components/shared";

type Tab = "all" | "orders" | "refunds" | "rewards";

function TransactionRow({
  label,
  date,
  amount,
}: {
  label: string;
  date: string;
  amount: string;
}) {
  return (
    <div className="w-[497px] inline-flex items-start justify-between">
      <div className="inline-flex flex-col items-start justify-start gap-2">
        <div className="whitespace-nowrap font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
          {label}
        </div>
        <div className="font-['Montserrat'] text-xs font-medium text-[#6B7280]">
          {date}
        </div>
      </div>
      <div className="whitespace-nowrap font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
        {amount}
      </div>
    </div>
  );
}

function WalletPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "orders", label: "Orders" },
    { key: "refunds", label: "Refunds" },
    { key: "rewards", label: "Rewards" },
  ];


  return (
    <>
      {/* Title */}
      <div className="absolute left-[378px] top-[122px] justify-start font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
        Wallet &amp; Rewards
      </div>

      {/* Balance / Points + Action Buttons */}
      <div className="absolute left-[378px] top-[177px] inline-flex items-start justify-end gap-72">
        <div className="flex items-center justify-start gap-6">
          <div className="w-24 inline-flex flex-col items-start justify-start gap-2">
            <div className="self-stretch justify-start font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
              Balance
            </div>
            <div className="self-stretch justify-start font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
              $120.00
            </div>
          </div>
          <div className="w-24 inline-flex flex-col items-start justify-start gap-2">
            <div className="self-stretch justify-start font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
              Points
            </div>
            <div className="self-stretch justify-start font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
              250
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start gap-4">
          <div className="flex items-center justify-start gap-2 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <CreditCard className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
            <div className="justify-end font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
              Link Card
            </div>
          </div>
          <div className="flex items-center justify-start gap-2 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <Gift className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
            <div className="justify-end font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
              Redeem Points
            </div>
          </div>
          <div className="flex items-center justify-start gap-2 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <PlusCircle className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
            <div className="justify-end font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
              Add Funds
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Title */}
      <div className="absolute left-[378px] top-[287px] justify-start font-['Montserrat'] text-xl font-bold text-[#1A1A1A]">
        Transactions
      </div>

      {/* Tabs */}
      <div className="absolute left-[378px] top-[327px] w-64 inline-flex items-center justify-start gap-4 border-b border-[#E0E0E0]">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex cursor-pointer items-center justify-center py-4 ${
              activeTab === tab.key
                ? "border-b-[3px] border-[#1A1A1A]"
                : ""
            }`}
          >
            <div
              className={`justify-start font-['Montserrat'] text-base font-bold ${
                activeTab === tab.key ? "text-[#1A1A1A]" : "text-[#6B7280]"
              }`}
            >
              {tab.label}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Rows */}
      <div className="absolute left-[378px] top-[403px]">
        <TransactionRow label="Order #2345" date="12 Sep 2025" amount="-$59.99" />
      </div>
      <div className="absolute left-[378px] top-[471px]">
        <TransactionRow label="Reward Earned" date="12 Sep 2025" amount="+50 Pts" />
      </div>
      <div className="absolute left-[378px] top-[531px]">
        <TransactionRow label="Reward Earned" date="12 Sep 2025" amount="+50 Pts" />
      </div>
      <div className="absolute left-[378px] top-[591px]">
        <TransactionRow label="Reward Earned" date="12 Sep 2025" amount="+50 Pts" />
      </div>
      <div className="absolute left-[378px] top-[651px]">
        <TransactionRow label="Reward Earned" date="12 Sep 2025" amount="+50 Pts" />
      </div>
      <div className="absolute left-[378px] top-[711px]">
        <TransactionRow label="Reward Earned" date="12 Sep 2025" amount="+50 Pts" />
      </div>
    </>
  );
}

export default function WalletRewardsPage() {
  return (
    <>
      <WalletPanel />
      <Footer top="top-[894px]" />
    </>
  );
}
