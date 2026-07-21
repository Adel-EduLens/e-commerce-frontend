import {
  Bell,
  Trash2,
  Check,
  CheckCheck,
  Package,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../components/shared";
import { Toggle } from "../../components/ui";
import {
  useUserNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from "../../hooks/useUserNotifications";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import {
  useCategorySubscriptions,
  useToggleCategorySubscription,
} from "../../hooks/queries/notificationQuery";
import { useTranslation } from "react-i18next";

function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
  isDeleting,
}: {
  notification: any;
  onMarkRead: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation("notifications");

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return t("Just now");
    if (minutes < 60) return t("mAgo", { minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t("hAgo", { hours });
    const days = Math.floor(hours / 24);
    return t("dAgo", { days });
  };

  return (
    <div
      className={`flex items-start gap-4 rounded-2xl p-4 border transition-all ${
        notification.isRead
          ? "bg-card border-stroke"
          : "bg-primary/5 border-primary/30"
      }`}
    >
      {/* Image or Icon */}
      <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-light shrink-0 flex items-center justify-center">
        {notification.imageUrl ? (
          <img
            src={notification.imageUrl}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <Package className="h-7 w-7 text-gray-text" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
            {notification.title}
          </h3>
          {!notification.isRead && (
            <span className="shrink-0 h-2.5 w-2.5 rounded-full bg-primary mt-1.5" />
          )}
        </div>

        <p className="font-['Montserrat'] text-xs sm:text-sm text-gray-text leading-relaxed">
          {notification.message}
        </p>

        <div className="flex items-center gap-3 mt-1">
          <span className="font-['Montserrat'] text-xs text-gray-text">
            {timeAgo(notification.createdAt)}
          </span>

          {notification.productId && (
            <button
              type="button"
              onClick={() => {
                const titleLower = (notification.title || "").toLowerCase();
                const messageLower = (notification.message || "").toLowerCase();

                if (titleLower.includes("wholesale") || messageLower.includes("wholesale")) {
                  navigate(`/wholesale/${notification.productId}`);
                } else if (titleLower.includes("retail") || messageLower.includes("retail")) {
                  navigate(`/retail/${notification.productId}`);
                } else {
                  navigate(`/product-details/${notification.productId}`);
                }
              }}
              className="font-['Montserrat'] text-xs font-semibold text-primary-foreground bg-primary rounded-lg px-2.5 py-1 hover:opacity-90 transition"
            >
              {t("View Product")}
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 shrink-0">
        {!notification.isRead && (
          <button
            type="button"
            onClick={onMarkRead}
            className="h-8 w-8 rounded-full bg-card border border-stroke flex items-center justify-center hover:bg-gray-light transition"
            title={t("Mark as read")}
          >
            <Check className="h-4 w-4 text-gray-text" />
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="h-8 w-8 rounded-full bg-card border border-stroke flex items-center justify-center hover:bg-gray-light transition disabled:opacity-50"
          title={t("Delete")}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-text" />
          ) : (
            <Trash2 className="h-4 w-4 text-urgent" />
          )}
        </button>
      </div>
    </div>
  );
}

function EmptyNotifications() {
  const { t } = useTranslation("notifications");
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-light">
        <Bell className="h-8 w-8 text-gray-text" />
      </div>
      <div className="font-['Montserrat'] text-xl font-bold text-foreground">
        {t("No Notifications")}
      </div>
      <div className="font-['Montserrat'] text-sm text-gray-text text-center max-w-xs">
        {t("noNotificationsDesc")}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useUserNotifications();
  const markReadMutation = useMarkNotificationRead();
  const { t } = useTranslation("notifications");
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();

  const { data: subscribedIds = [] } = useCategorySubscriptions();
  const { subscribe, unsubscribe } = useToggleCategorySubscription();
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  if (isLoading) {
    return <LoadingSpinner containerClassName="py-20" />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 font-['Montserrat'] text-base text-urgent">
        {t("failedToLoadNotifications")}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
          {t("NOTIFICATIONS")}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="flex items-center gap-1.5 rounded-xl bg-card border border-stroke px-3 py-2 font-['Montserrat'] text-xs font-semibold text-foreground hover:bg-gray-light transition disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            {t("Mark all read")}
          </button>
        )}
      </div>

      {/* Category subscription cards */}
      {isCategoriesLoading && (
        <LoadingSpinner containerClassName="py-20" className="h-8 w-8" />
      )}
      {!isCategoriesLoading && categories.length > 0 && (
        <div className="flex gap-3">
          {categories.map((cat) => {
            const enabled = subscribedIds.includes(cat.id);
            return (
              <div
                key={cat.id}
                className="flex flex-1 items-center gap-2 rounded-xl bg-card border border-stroke px-3 py-2"
              >
                <img
                  src={cat.image ?? ""}
                  className="h-8 w-8 rounded-full object-cover object-top shrink-0"
                  alt={cat.name}
                  draggable={false}
                />
                <span className="flex-1 font-['Montserrat'] text-sm font-medium text-foreground truncate">
                  {t(cat.name)}
                </span>
                <Toggle
                  checked={enabled}
                  onChange={(checked) =>
                    checked ? subscribe(cat.id) : unsubscribe(cat.id)
                  }
                  size="sm"
                  aria-label={
                    enabled
                      ? t("unsubscribeFrom", { name: t(cat.name) })
                      : t("subscribeTo", { name: t(cat.name) })
                  }
                />
              </div>
            );
          })}
        </div>
      )}

      {/* List */}
      {notifications.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notification: any) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={() => markReadMutation.mutate(notification.id)}
              onDelete={() => deleteMutation.mutate(notification.id)}
              isDeleting={
                deleteMutation.isPending &&
                deleteMutation.variables === notification.id
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
