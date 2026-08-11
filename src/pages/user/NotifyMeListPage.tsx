import { Trash2, Bell, Package } from "lucide-react";
import { useNotifyMeList, useNotifyMeUnsubscribe } from "../../hooks/useNotifyMe";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoadingSpinner, InlineSpinner } from "../../components/shared";

const formatCurrency = (amount: number, currencySuffix = "EGP") =>
  `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)} ${currencySuffix}`;

function ProductRequestCard({
  notification,
  onRemove,
  isRemoving,
}: {
  notification: any;
  onRemove: () => void;
  isRemoving: boolean;
}) {
  const { t } = useTranslation("notify");
  const navigate = useNavigate();
  const product = notification.product;
  const mainImage =
    product?.images?.find((img: any) => img.isMain)?.url ||
    product?.images?.[0]?.url ||
    "";

  const handleProductClick = () => {
    if (!product) return;
    if (notification.targetType === "WHOLESALE_RESTOCK") {
      navigate(`/wholesale/${product.id}`);
    } else if (notification.targetType === "RENTAL_RESTOCK" || notification.targetType === "RETAIL_RESTOCK") {
      navigate(`/rental/${product.slug || product.id}`);
    } else {
      navigate(`/product-details/${product.id}`);
    }
  };

  return (
    <div className="flex items-start gap-4 rounded-2xl bg-card p-4 border border-stroke shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] transition-all hover:shadow-md">
      <button
        type="button"
        onClick={handleProductClick}
        className="h-24 w-24 sm:h-36 sm:w-36 rounded-xl overflow-hidden bg-gray-light shrink-0 cursor-pointer"
      >
        {mainImage ? (
          <img
            className="h-full w-full object-cover"
            src={mainImage}
            alt={product?.name || "Product"}
            draggable={false}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Package className="h-10 w-10 text-gray-text" />
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 py-1">
        <button
          type="button"
          onClick={handleProductClick}
          className="font-['Montserrat'] text-base sm:text-lg font-semibold text-foreground text-left hover:underline"
        >
          {product?.name || t("Unknown Product")}
        </button>

        <div className="font-['Montserrat'] text-lg sm:text-xl font-bold text-foreground">
          {product?.price ? formatCurrency(product.price, t("EGP", "EGP")) : "—"}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          {product?.stock > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary px-3 py-1 font-['Montserrat'] text-xs font-semibold text-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {t("Back in Stock!")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-stroke px-3 py-1 font-['Montserrat'] text-xs font-semibold text-urgent">
              <span className="h-2 w-2 rounded-full bg-urgent animate-pulse" />
              {t("Still Out of Stock")}
            </span>
          )}
        </div>

        <div className="font-['Montserrat'] text-xs text-gray-text mt-1">
          {t("Requested on")}{" "}
          {new Date(notification.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={isRemoving}
        className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-full bg-card border border-stroke shadow-sm hover:bg-gray-light transition-all flex items-center justify-center disabled:opacity-50"
        aria-label="Remove notification"
      >
        {isRemoving ? (
          <InlineSpinner size="xs" variant="current" />
        ) : (
          <Trash2
            className="h-4 w-4 sm:h-5 sm:w-5 text-urgent"
            strokeWidth={1.5}
          />
        )}
      </button>
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation("notify");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 border border-primary">
        <Bell className="h-10 w-10 text-primary-foreground" />
      </div>
      <div className="text-center">
        <div className="font-['Montserrat'] text-2xl font-bold text-foreground mb-2">
          {t("No Notifications Yet")}
        </div>
        <div className="font-['Montserrat'] text-base text-gray-text max-w-sm">
          {t("noNotificationsDesc")}
        </div>
      </div>
      <button
        type="button"
        onClick={() => navigate("/products")}
        className="rounded-2xl bg-primary px-6 py-3 font-['Montserrat'] text-base font-semibold text-primary-foreground hover:opacity-90 transition"
      >
        {t("Browse Products")}
      </button>
    </div>
  );
}

export default function NotifyMeListPage() {
  const { t } = useTranslation("notify");
  const { data: notifications = [], isLoading, isError } = useNotifyMeList();
  const unsubscribeMutation = useNotifyMeUnsubscribe();

  if (isLoading) {
    return <LoadingSpinner containerClassName="py-20" size="lg" />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 font-['Montserrat'] text-base text-urgent">
        {t("failedToLoadNotifications")}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Bell className="h-7 w-7 text-foreground" />
          <h1 className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
            {t("Notify Me List")}
          </h1>
        </div>
        <p className="font-['Montserrat'] text-base text-gray-text">
          {t("You'll be notified as soon as these items come back in stock.")}
        </p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((notification: any) => (
            <ProductRequestCard
              key={notification.id}
              notification={notification}
              onRemove={() =>
                unsubscribeMutation.mutate({
                  targetType: notification.targetType,
                  targetId: notification.targetId,
                })
              }
              isRemoving={
                unsubscribeMutation.isPending &&
                unsubscribeMutation.variables?.targetType === notification.targetType &&
                unsubscribeMutation.variables?.targetId === notification.targetId
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
