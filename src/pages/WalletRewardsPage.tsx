import { useState } from "react";
import { CreditCard, Gift, PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("wallet");
  return (
    <div className="flex w-full items-start justify-between py-3 border-b border-[#E0E0E0] last:border-b-0">
      <div className="flex flex-col gap-1">
        <div className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
          {label === "Reward Earned" ? t(label) : label}
        </div>
        <div className="font-['Montserrat'] text-xs font-medium text-[#6B7280]">
          {date}
        </div>
      </div>
      <div className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
        {amount}
      </div>
    </div>
  );
}

function WalletPanel() {
  const { t } = useTranslation("wallet");
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "orders", label: "Orders" },
    { key: "refunds", label: "Refunds" },
    { key: "rewards", label: "Rewards" },
  ];

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
        {t("Wallet & Rewards")}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="font-['Montserrat'] text-lg sm:text-2xl font-semibold text-foreground">
              {t("Balance")}
            </div>
            <div className="font-['Montserrat'] text-lg sm:text-2xl font-semibold text-foreground">
              $120.00
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-['Montserrat'] text-lg sm:text-2xl font-semibold text-foreground">
              {t("Points")}
            </div>
            <div className="font-['Montserrat'] text-lg sm:text-2xl font-semibold text-foreground">
              250
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-white p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" strokeWidth={1.5} />
            <div className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
              {t("Link Card")}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" strokeWidth={1.5} />
            <div className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
              {t("Redeem Points")}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" strokeWidth={1.5} />
            <div className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
              {t("Add Funds")}
            </div>
          </div>
        </div>
      </div>

      <div className="font-['Montserrat'] text-lg sm:text-xl font-bold text-foreground">
        {t("Transactions")}
      </div>

      <div className="flex items-center gap-3 sm:gap-4 border-b border-[#E0E0E0]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`cursor-pointer py-3 sm:py-4 font-['Montserrat'] text-sm sm:text-base font-bold ${
              activeTab === tab.key
                ? "border-b-[3px] border-foreground text-foreground"
                : "text-[#6B7280]"
            }`}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      <div className="flex flex-col">
        <TransactionRow label="Order #2345" date="12 Sep 2025" amount="-$59.99" />
        <TransactionRow label="Reward Earned" date="12 Sep 2025" amount="+50 Pts" />
        <TransactionRow label="Reward Earned" date="12 Sep 2025" amount="+50 Pts" />
        <TransactionRow label="Reward Earned" date="12 Sep 2025" amount="+50 Pts" />
        <TransactionRow label="Reward Earned" date="12 Sep 2025" amount="+50 Pts" />
        <TransactionRow label="Reward Earned" date="12 Sep 2025" amount="+50 Pts" />
      </div>
    </div>
  );
}

export default function WalletRewardsPage() {
  return <WalletPanel />;
}
