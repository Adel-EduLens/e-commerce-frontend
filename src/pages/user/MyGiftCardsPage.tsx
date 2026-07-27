import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Gift, Send } from "lucide-react";
import {
  useReceivedGiftCards,
  useSentGiftCards,
  useRedeemGiftCard,
  type GiftCard,
} from "../../hooks/queries/giftCardsQuery";

type GiftCardTab = "received" | "sent";

function GiftCardCard({
  gc,
  type,
}: {
  gc: GiftCard;
  type: GiftCardTab;
}) {
  const redeemMutation = useRedeemGiftCard();

  const formattedDate = gc.createdAt
    ? new Date(gc.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Aug 15, 2025";

  const isRedeemed = gc.status === "REDEEMED";
  const displayStatus = isRedeemed ? "Redeemed" : "Delivered";

  return (
    <div className="relative flex items-start sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl border border-stroke bg-card shadow-[0px_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all font-['Montserrat']">
      {/* Visual Artwork / Box */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-[#1A1A1E] dark:bg-[#121214] text-white flex items-center justify-center overflow-hidden shadow-inner">
        {gc.image ? (
          <img
            src={gc.image}
            alt={gc.name}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <span className="font-bold text-white text-base sm:text-lg tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 select-none">
            GENZ
          </span>
        )}
      </div>

      {/* Info Details */}
      <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-foreground text-base sm:text-lg leading-tight truncate">
            {gc.name || "Gift Card"}
          </h3>
        </div>

        {type === "received" ? (
          <div className="text-xs sm:text-sm text-foreground truncate mt-0.5">
            <span className="text-gray-text font-normal">Sent from: </span>
            <span className="font-bold text-foreground">
              {gc.senderName || gc.senderEmail || "Store"}
            </span>
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-foreground truncate mt-0.5">
            <span className="text-gray-text font-normal">Sent to: </span>
            <span className="font-bold text-foreground">
              {gc.recipientName || gc.recipientEmail || "Recipient"}
            </span>
            {gc.recipientEmail && gc.recipientName && (
              <span className="text-gray-text font-normal"> ({gc.recipientEmail})</span>
            )}
          </div>
        )}

        <div className="text-xs sm:text-sm text-foreground">
          <span className="text-gray-text font-normal">Value: </span>
          <span className="font-bold text-foreground">{gc.balance || gc.amount} EGP</span>
        </div>

        <div className="text-xs sm:text-sm text-foreground">
          <span className="text-gray-text font-normal">Status: </span>
          <span className="font-bold text-foreground capitalize">{displayStatus}</span>
        </div>

        {type === "sent" && gc.message && (
          <div className="text-xs text-gray-text italic truncate mt-0.5">
            "{gc.message}"
          </div>
        )}

        <div className="text-xs text-gray-text mt-1 font-normal">
          Date: {formattedDate}
        </div>

        {type === "received" && (
          <div className="pt-2">
            {isRedeemed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                ✓ Redeemed
              </span>
            ) : (
              <button
                type="button"
                onClick={() => redeemMutation.mutate(gc.id)}
                disabled={redeemMutation.isPending}
                className="w-full sm:w-auto rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                {redeemMutation.isPending ? "Redeeming..." : "Redeem Gift Card"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyGiftCardsPage() {
  const location = useLocation();
  const initialTab: GiftCardTab = (location.state?.activeTab as GiftCardTab) || "sent";
  const [activeTab, setActiveTab] = useState<GiftCardTab>(initialTab);

  const receivedQuery = useReceivedGiftCards();
  const sentQuery = useSentGiftCards();

  const tabs: { key: GiftCardTab; label: string; icon: typeof Gift }[] = [
    { key: "received", label: "My Gift Cards", icon: Gift },
    { key: "sent", label: "Gift Cards I Sent", icon: Send },
  ];

  const currentQuery = activeTab === "received" ? receivedQuery : sentQuery;
  const { data: giftCards = [], isLoading, isError } = currentQuery;

  return (
    <div className="w-full max-w-4xl py-2 space-y-6 font-['Montserrat']">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gift Cards</h1>
          <p className="text-xs sm:text-sm text-gray-text mt-1">
            Manage gift cards you have received or sent to friends and family
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="relative border-b border-stroke">
          <div className="flex gap-6 sm:gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 pb-3.5 font-['Montserrat'] text-sm sm:text-base font-bold cursor-pointer transition-all duration-200 whitespace-nowrap border-b-[3px] -mb-px ${
                    isActive
                      ? "text-foreground border-secondary"
                      : "text-gray-text hover:text-foreground border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-secondary" : "text-gray-text"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="py-12 text-center text-xs sm:text-sm text-gray-text">
          Loading gift cards...
        </div>
      ) : isError ? (
        <div className="py-12 text-center text-xs sm:text-sm text-red-500">
          Failed to load gift cards. Please try again.
        </div>
      ) : giftCards.length === 0 ? (
        <div className="rounded-2xl border border-stroke bg-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary mx-auto flex items-center justify-center">
            {activeTab === "received" ? <Gift className="w-6 h-6" /> : <Send className="w-6 h-6" />}
          </div>
          <h3 className="font-bold text-foreground text-sm sm:text-base">
            {activeTab === "received"
              ? "No Gift Cards Received Yet"
              : "No Gift Cards Sent Yet"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-text max-w-sm mx-auto">
            {activeTab === "received"
              ? "When someone sends you a gift card, it will appear here with your balance and redemption details."
              : "Gift cards you purchase and send to others will be displayed here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {giftCards.map((gc) => (
            <GiftCardCard
              key={gc.id}
              gc={gc}
              type={activeTab}
            />
          ))}
        </div>
      )}
    </div>
  );
}
