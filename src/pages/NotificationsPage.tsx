import { useAuthStore } from "../store/useAuthStore";
import { useCategories } from "../hooks/queries/categoriesQuery";
import {
  useNotifications,
  useCategorySubscriptions,
  useToggleCategorySubscription,
  useMarkAllRead,
  useMarkRead,
} from "../hooks/queries/notificationQuery";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const COLLECTION_LABELS = ["Men", "Women", "Kids"];
const COLLECTION_IMAGES: Record<string, string> = {
  Men: "/home-page/image%208.png",
  Women: "/home-page/image%207.png",
  Kids: "/home-page/image%209.png",
};

function NotificationsPanel() {
  const { t } = useTranslation("notifications");
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const isUser = user?.role === "user";

  const { data: categories = [] } = useCategories();
  const { data: subscribedIds = [] } = useCategorySubscriptions();
  const { subscribe, unsubscribe } = useToggleCategorySubscription();
  const { data: notifData } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const notifications = notifData?.notifications ?? [];
  const unread = notifData?.unread ?? 0;

  const collectionCategories = categories.filter((c) =>
    COLLECTION_LABELS.includes(c.name)
  );

  if (!isUser) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="font-['Montserrat'] text-lg text-gray-text">
          Sign in to manage your notifications.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="rounded-xl bg-primary px-6 py-3 font-['Montserrat'] font-semibold text-foreground"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      {/* Collection toggles */}
      <div className="flex flex-col gap-6">
        <div className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
          {t("NOTIFICATIONS")}
        </div>
        <div className="flex flex-col gap-4 sm:gap-6">
          {collectionCategories.map((cat) => {
            const enabled = subscribedIds.includes(cat.id);
            return (
              <div key={cat.id} className="flex items-center gap-4 sm:gap-5">
                <img
                  src={COLLECTION_IMAGES[cat.name] ?? ""}
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover object-top shrink-0"
                  alt={cat.name}
                  draggable={false}
                />
                <div className="flex flex-1 items-center justify-between py-3 sm:py-4">
                  <div className="font-['Montserrat'] text-lg sm:text-2xl font-medium text-foreground">
                    {t(cat.name)}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      enabled ? unsubscribe(cat.id) : subscribe(cat.id)
                    }
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
                      enabled ? "bg-primary" : "bg-stroke"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                        enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Received notifications */}
      {notifications.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Montserrat'] text-xl font-bold text-foreground">
              Recent Notifications
              {unread > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 font-['Montserrat'] text-xs font-semibold text-foreground">
                  {unread}
                </span>
              )}
            </h2>
            {unread > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="font-['Montserrat'] text-sm text-gray-text underline hover:text-foreground transition"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.isRead) markRead.mutate(n.id);
                  if (n.productId) navigate(`/product-details/${n.productId}`);
                }}
                className={`flex items-start gap-3 rounded-xl border p-3 transition cursor-pointer hover:bg-gray-50 ${
                  n.isRead ? "border-stroke bg-white" : "border-primary/30 bg-primary/5"
                }`}
              >
                {n.imageUrl ? (
                  <img
                    src={n.imageUrl}
                    className="h-12 w-12 rounded-lg object-cover shrink-0"
                    alt=""
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-secondary shrink-0 flex items-center justify-center">
                    <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-['Montserrat'] text-sm font-semibold ${n.isRead ? "text-foreground" : "text-foreground"}`}>
                    {n.title}
                  </p>
                  <p className="font-['Montserrat'] text-xs text-gray-text mt-0.5">{n.body}</p>
                  <p className="font-['Montserrat'] text-xs text-gray-text mt-1">
                    {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {!n.isRead && (
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return <NotificationsPanel />;
}
