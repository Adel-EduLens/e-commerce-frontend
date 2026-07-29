import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star } from "lucide-react";
import { ProductCard } from "../../components/shared";
import { useGiftCard } from "../../hooks/queries/giftCardsQuery";
import { useProducts } from "../../hooks/queries/productsQuery";
import { useProductReviews } from "../../hooks/queries/reviewQuery";
import { Star as StarIcon } from "../../components/ui/star";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { api } from "../../lib/axios";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { ReviewsSection } from "../../components/product/ReviewsSection";
import WishlistHeartButton from "../../components/wishlist/WishlistHeartButton";

export default function GiftCardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation("productSection");
  const { isAuthenticated, user } = useAuthStore();

  const { data: giftCard, isLoading, isError } = useGiftCard(id);
  const { data: recommendedData } = useProducts({ limit: 4, type: "SHOP" });
  const { data: reviews = [] } = useProductReviews(id);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);

  // Parsed amounts list from giftCard or defaults
  const parsedAmounts = useMemo(() => {
    if (giftCard?.amounts) {
      const parts = giftCard.amounts
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length > 0) return parts;
    }
    return ["10", "15", "50", "75", "100", "150", "200"];
  }, [giftCard?.amounts]);

  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ recipientName?: string; recipientEmail?: string; customAmount?: string }>({});
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (giftCard?.amount) {
      setSelectedAmount(giftCard.amount);
    } else if (parsedAmounts.length > 0 && !isNaN(Number(parsedAmounts[0]))) {
      setSelectedAmount(Number(parsedAmounts[0]));
    }
  }, [giftCard, parsedAmounts]);

  const currentPrice = useMemo(() => {
    if (isCustom) {
      const val = Number(customAmount);
      return isNaN(val) || val <= 0 ? 0 : val;
    }
    return selectedAmount;
  }, [isCustom, customAmount, selectedAmount]);

  const handleBuyNow = async () => {
    if (!giftCard) return;

    if (!isAuthenticated) {
      toast.error(t("loginToSendGiftCard", "Please login to send a gift card"));
      navigate("/login");
      return;
    }

    const newErrors: { recipientName?: string; recipientEmail?: string; customAmount?: string } = {};

    if (isCustom) {
      const val = Number(customAmount);
      if (!customAmount || isNaN(val) || val <= 0) {
        newErrors.customAmount = t("invalidCustomAmount", "Please enter a valid amount greater than 0 EGP");
      }
    }

    if (!recipientName.trim()) {
      newErrors.recipientName = t("recipientNameRequired", "Recipient name is required");
    }

    const recEmailFormatted = recipientEmail.trim().toLowerCase();
    if (!recEmailFormatted) {
      newErrors.recipientEmail = t("recipientEmailRequired", "Recipient email address is required");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recEmailFormatted)) {
        newErrors.recipientEmail = t("invalidEmail", "Please enter a valid email address");
      } else if (user?.email && user.email.trim().toLowerCase() === recEmailFormatted) {
        newErrors.recipientEmail = t("cannotSendToSelf", "You cannot send a gift card to yourself");
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return;
    }

    try {
      setIsValidating(true);
      await api.post("/gift-cards/validate-recipient", { recipientEmail: recEmailFormatted });
    } catch (err: any) {
      const rawMsg = err?.response?.data?.message || "Recipient email validation failed";
      const errMsg = t(rawMsg, rawMsg);
      setErrors((prev) => ({ ...prev, recipientEmail: errMsg }));
      toast.error(errMsg);
      return;
    } finally {
      setIsValidating(false);
    }

    const titleText = `${giftCard.name} (To: ${recipientName.trim()})`;

    const giftCardItem = {
      id: `giftcard-${giftCard.id}-${currentPrice}-${Date.now()}`,
      productId: giftCard.id,
      title: titleText,
      unitPrice: currentPrice,
      currency: "EGP" as const,
      size: "Default",
      color: "Default",
      colorHex: "#000000",
      imageSrc: giftCard.image || "",
      quantity: 1,
      minOrder: 1,
      productType: "GIFT_CARD",
      recipientName: recipientName.trim(),
      recipientEmail: recEmailFormatted,
      giftMessage: message.trim() || undefined,
    };

    navigate("/checkout", { state: { directBuyItem: giftCardItem } });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !giftCard) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-gray-text">
        <h2 className="text-2xl font-bold mb-4">{t("giftCardNotFound", "Gift Card Not Found")}</h2>
        <Link to="/products" className="text-primary underline">
          {t("backToProducts", "Back to Products")}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-background text-foreground transition-colors min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-gray-text font-['Montserrat']">
          <Link to="/" className="hover:text-foreground">{t("home", "Home")}</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">{t("giftCards", "Gift Cards")}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{giftCard.name}</span>
        </nav>
      </div>

      {/* Main Details Section */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-start">
          {/* Left: Visual Gift Card Artwork Preview */}
          <div className="flex w-full items-center justify-center">
            {giftCard.image ? (
              <div className="relative aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-2xl shadow-xl transition-transform hover:scale-105 duration-300 border border-stroke">
                <img
                  src={giftCard.image}
                  alt={giftCard.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-[3/4] w-full max-w-[360px] rounded-2xl bg-card p-8 text-foreground shadow-xl flex flex-col justify-center items-center transition-transform hover:scale-105 duration-300 border border-stroke min-h-[400px]">
                <div className="writing-vertical text-5xl font-black tracking-widest uppercase select-none text-primary drop-shadow-md">
                  GENZ
                </div>
                <div className="absolute bottom-8 text-xs tracking-widest text-gray-text uppercase font-semibold">
                  {giftCard.name}
                </div>
              </div>
            )}
          </div>

          {/* Right: Gift Card Info & Config Form */}
          <div className="flex flex-col space-y-6 font-['Montserrat']">
            {/* Header Title & Rating */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  {giftCard.name}
                </h1>
                <div className="relative h-10 w-10 shrink-0">
                  <WishlistHeartButton productType="GIFT_CARD" productId={giftCard.id} className="!relative !right-0 !top-0" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
                </span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const fill = Math.min(1, Math.max(0, averageRating - index));
                    return <StarIcon key={index} fill={fill} size={16} />;
                  })}
                </div>
                <span className="text-xs text-gray-text">
                  ({reviews.length} {reviews.length === 1 ? t("review", "Review") : t("reviews", "Reviews")})
                </span>
              </div>
            </div>

            {/* Price Header */}
            <div className="text-2xl font-bold text-foreground">
              {currentPrice} {t("egp", "EGP")}
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {t("amount", "Amount")}
              </label>
              <div className="flex flex-wrap gap-2">
                {parsedAmounts.map((amtStr) => {
                  const val = Number(amtStr);
                  const isSelected = !isCustom && selectedAmount === val;
                  return (
                    <button
                      key={amtStr}
                      type="button"
                      onClick={() => {
                        setIsCustom(false);
                        setSelectedAmount(val);
                      }}
                      className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-stroke bg-card text-foreground hover:border-primary/50"
                        }`}
                    >
                      {amtStr} {t("egp", "EGP")}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${isCustom
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-stroke bg-card text-foreground hover:border-primary/50"
                    }`}
                >
                  {t("custom", "Custom")}
                </button>
              </div>

              {isCustom && (
                <div className="pt-2">
                  <input
                    type="number"
                    placeholder={t("enterCustomAmount", "Enter custom amount in EGP")}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      if (errors.customAmount) setErrors((prev) => ({ ...prev, customAmount: undefined }));
                    }}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none bg-card text-foreground transition ${errors.customAmount ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"
                      }`}
                  />
                  {errors.customAmount && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.customAmount}</p>
                  )}
                </div>
              )}
            </div>

            {/* Send as a gift Section */}
            <div className="space-y-4 pt-2 border-t border-stroke">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {t("sendAsGift", "Send as a gift")}
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-text block mb-1">
                    {t("to", "To")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t("recipientNamePlaceholder", "Recipient Name")}
                    value={recipientName}
                    onChange={(e) => {
                      setRecipientName(e.target.value);
                      if (errors.recipientName) setErrors((prev) => ({ ...prev, recipientName: undefined }));
                    }}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none bg-card text-foreground transition ${errors.recipientName ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"
                      }`}
                  />
                  {errors.recipientName && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.recipientName}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-text block mb-1">
                    {t("email", "Email")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder={t("recipientEmailPlaceholder", "Recipient Email")}
                    value={recipientEmail}
                    onChange={(e) => {
                      setRecipientEmail(e.target.value);
                      if (errors.recipientEmail) setErrors((prev) => ({ ...prev, recipientEmail: undefined }));
                    }}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none bg-card text-foreground transition ${errors.recipientEmail ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"
                      }`}
                  />
                  {errors.recipientEmail && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.recipientEmail}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-text block mb-1">
                    {t("message", "Message")}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={t("optional", "(Optional)")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-stroke px-4 py-2.5 text-sm outline-none focus:border-primary bg-card text-foreground resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Buy Now Button (Without Add to Cart or Wishlist as requested) */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isValidating}
                className="w-full rounded-xl bg-primary py-4 text-center text-sm font-bold text-primary-foreground shadow-md transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
              >
                {isValidating ? t("validatingRecipient", "Validating Recipient...") : t("buyNow", "Buy Now")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-stroke mt-12 font-['Montserrat']">
        <ReviewsSection />
      </div>

      {/* Recommended for You Section */}
      {recommendedData?.products && recommendedData.products.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-stroke font-['Montserrat']">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t("Recommended for You", "Recommended for You")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedData.products.slice(0, 4).map((p) => (
              <ProductCard
                key={`rec-${p.id}`}
                title={p.name}
                productId={p.id}
                price={`${p.shopPrice ?? p.price ?? 0} ${t("egp", "EGP")}`}
                imageSrc={p.images?.[0]?.url}
                rating={p.rating}
                to={`/product-details/${p.id}`}
              />
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <button className="rounded-full bg-primary px-8 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition flex items-center gap-1">
              {t("viewAll", "View All")} <span>›</span>
            </button>
          </div>
        </div>
      )}

      {/* Complete the look Section */}
      {recommendedData?.products && recommendedData.products.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-stroke font-['Montserrat']">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t("completeTheLook", "Complete the look")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedData.products.slice(0, 4).map((p) => (
              <ProductCard
                key={`ctl-${p.id}`}
                title={p.name}
                productId={p.id}
                price={`${p.shopPrice ?? p.price ?? 0} ${t("egp", "EGP")}`}
                imageSrc={p.images?.[0]?.url}
                rating={p.rating}
                to={`/product-details/${p.id}`}
              />
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <button className="rounded-full bg-primary px-8 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition flex items-center gap-1">
              {t("viewAll", "View All")} <span>›</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
