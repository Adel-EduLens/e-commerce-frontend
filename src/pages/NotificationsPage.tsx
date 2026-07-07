import { useState } from "react";
import { useTranslation } from "react-i18next";
function NotificationSwitch() {
  const [enabled, setEnabled] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setEnabled((prev) => !prev)}
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
  );
}

function NotificationRow({ label, src }: { label: string; src: string }) {
  const { t } = useTranslation("notifications");
  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <img
        src={src}
        className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover object-top shrink-0"
        alt={label}
        draggable={false}
      />
      <div className="flex flex-1 items-center justify-between py-3 sm:py-4">
        <div className="font-['Montserrat'] text-lg sm:text-2xl font-medium text-foreground">
          {t(label)}
        </div>
        <NotificationSwitch />
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const { t } = useTranslation("notifications");
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
        {t("NOTIFICATIONS")}
      </div>
      <div className="flex flex-col gap-4 sm:gap-6">
        <NotificationRow label="Men" src="/home-page/image%208.png" />
        <NotificationRow label="Women" src="/home-page/image%207.png" />
        <NotificationRow label="Kids" src="/home-page/image%209.png" />
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return <NotificationsPanel />;
}
