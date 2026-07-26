import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, MessageSquare, X } from "lucide-react";
import { ProductCard } from "../../components/shared";
import { useGiftCard } from "../../hooks/queries/giftCardsQuery";
import { useProducts } from "../../hooks/queries/productsQuery";
import { useReviews, useCreateReview } from "../../hooks/queries/reviewQuery";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function GiftCardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation("productSection");
  const { isAuthenticated } = useAuthStore();

  const { data: giftCard, isLoading, isError } = useGiftCard(id);
  const { data: recommendedData } = useProducts({ limit: 4, type: "SHOP" });
  const { data: reviews = [], isLoading: isReviewsLoading } = useReviews(id);
  const createReviewMutation = useCreateReview(id || "");

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      navigate("/login");
      return;
    }
    if (!id) return;

    createReviewMutation.mutate(
      {
        productId: id,
        rating: newRating,
        comment: newComment.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Thank you! Your review has been published.");
          setShowReviewModal(false);
          setNewComment("");
          setNewRating(5);
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || "Failed to submit review";
          toast.error(errMsg);
        },
      }
    );
  };

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

  const handleBuyNow = () => {
    if (!giftCard) return;

    const newErrors: { recipientName?: string; recipientEmail?: string; customAmount?: string } = {};

    if (isCustom) {
      const val = Number(customAmount);
      if (!customAmount || isNaN(val) || val <= 0) {
        newErrors.customAmount = "Please enter a valid amount greater than 0 EGP";
      }
    }

    if (!recipientName.trim()) {
      newErrors.recipientName = "Recipient name is required";
    }

    if (!recipientEmail.trim()) {
      newErrors.recipientEmail = "Recipient email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipientEmail.trim())) {
        newErrors.recipientEmail = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return;
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
      recipientEmail: recipientEmail.trim(),
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
        <h2 className="text-2xl font-bold mb-4">{t("Gift Card Not Found") || "Gift Card Not Found"}</h2>
        <Link to="/products" className="text-primary underline">
          {t("Back to Products") || "Back to Products"}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-background text-foreground transition-colors min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-gray-text font-['Montserrat']">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Gift Cards</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{giftCard.name}</span>
        </nav>
      </div>

      {/* Main Details Section */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-start">
          {/* Left: Visual Gift Card Artwork Preview */}
          <div className="flex w-full items-center justify-center rounded-3xl bg-secondary p-8 sm:p-14 min-h-[460px] shadow-inner border border-stroke">
            {giftCard.image ? (
              <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl shadow-2xl transition-transform hover:scale-105 duration-300">
                <img
                  src={giftCard.image}
                  alt={giftCard.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-[3/5] w-full max-w-[260px] rounded-2xl bg-card p-6 text-foreground shadow-2xl flex flex-col justify-center items-center transition-transform hover:scale-105 duration-300 border border-stroke">
                <div className="writing-vertical text-4xl sm:text-5xl font-black tracking-widest uppercase select-none text-primary drop-shadow-md">
                  GENZ
                </div>
                <div className="absolute bottom-6 text-[10px] tracking-widest text-gray-text uppercase font-semibold">
                  {giftCard.name}
                </div>
              </div>
            )}
          </div>

          {/* Right: Gift Card Info & Config Form */}
          <div className="flex flex-col space-y-6 font-['Montserrat']">
            {/* Header Title & Rating */}
            <div>
              <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                {giftCard.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-semibold">4.8</span>
                <div className="flex items-center text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-xs text-gray-text">(104 Reviews)</span>
              </div>
            </div>

            {/* Price Header */}
            <div className="text-2xl font-bold text-foreground">
              {currentPrice} EGP
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Amount
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
                      ${amtStr}
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
                  Custom
                </button>
              </div>

              {isCustom && (
                <div className="pt-2">
                  <input
                    type="number"
                    placeholder="Enter custom amount in EGP"
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
                Send as a gift
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-text block mb-1">
                    To <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Recipient Name"
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
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Recipient Email"
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
                    Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="(Optional)"
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
                className="w-full rounded-xl bg-primary py-4 text-center text-sm font-bold text-primary-foreground shadow-md transition hover:opacity-90 active:scale-[0.99]"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-stroke mt-12 font-['Montserrat']">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-text">
              <span>{reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "4.8"}</span>
              <div className="flex text-amber-400">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </div>
              <span>({reviews.length > 0 ? reviews.length : 1} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error("Please login to write a review");
                  navigate("/login");
                  return;
                }
                setShowReviewModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              Write a Review
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {isReviewsLoading ? (
            <div className="py-8 text-center text-xs text-gray-text">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-card border border-stroke space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-foreground border border-stroke">
                      M
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Mariam K.</h4>
                      <p className="text-xs text-gray-text">Mar 20, 2025</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </div>

                <h5 className="font-bold text-sm text-foreground">Amazing Gift!</h5>
                <p className="text-xs text-gray-text leading-relaxed">
                  I love this gift card! Literally amazing trust me if you are looking for a great present this is the one. It is so cute and the process was seamless.
                </p>
              </div>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-card border border-stroke space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-stroke uppercase">
                      {rev.user?.name ? rev.user.name.charAt(0) : "U"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{rev.user?.name || "Customer"}</h4>
                      <p className="text-[11px] text-gray-text">
                        {new Date(rev.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-zinc-700"
                        }`}
                    />
                  ))}
                </div>

                {rev.comment && (
                  <p className="text-xs text-foreground leading-relaxed">{rev.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-['Montserrat']">
          <div className="relative w-full max-w-lg rounded-3xl bg-card border border-stroke p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-stroke pb-4">
              <h3 className="text-lg font-bold text-foreground">Write a Review</h3>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="rounded-full p-1.5 text-gray-text hover:text-foreground hover:bg-secondary transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-5">
              {/* Star Rating Picker */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${star <= (hoverRating || newRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 dark:text-zinc-700"
                          }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-foreground">
                    {hoverRating || newRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Review Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details of your experience with this gift card..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded-xl border border-stroke p-3.5 text-sm outline-none focus:border-primary bg-card text-foreground resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stroke">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-xl border border-stroke px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createReviewMutation.isPending}
                  className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                >
                  {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recommended for You Section */}
      {recommendedData?.products && recommendedData.products.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-stroke font-['Montserrat']">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recommended for You</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedData.products.slice(0, 4).map((p) => (
              <ProductCard
                key={`rec-${p.id}`}
                title={p.name}
                productId={p.id}
                price={`${p.shopPrice ?? p.price ?? 0} EGP`}
                imageSrc={p.images?.[0]?.url}
                rating={p.rating}
                to={`/product-details/${p.id}`}
              />
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <button className="rounded-full bg-primary px-8 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition flex items-center gap-1">
              View All <span>›</span>
            </button>
          </div>
        </div>
      )}

      {/* Complete the look Section */}
      {recommendedData?.products && recommendedData.products.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-stroke font-['Montserrat']">
          <h2 className="text-2xl font-bold text-foreground mb-6">Complete the look</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedData.products.slice(0, 4).map((p) => (
              <ProductCard
                key={`ctl-${p.id}`}
                title={p.name}
                productId={p.id}
                price={`${p.shopPrice ?? p.price ?? 0} EGP`}
                imageSrc={p.images?.[0]?.url}
                rating={p.rating}
                to={`/product-details/${p.id}`}
              />
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <button className="rounded-full bg-primary px-8 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition flex items-center gap-1">
              View All <span>›</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
