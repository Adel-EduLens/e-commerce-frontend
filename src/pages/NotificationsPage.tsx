const placeholderAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23D9D9D9'/%3E%3C/svg%3E";

function NotificationSwitch() {
  return (
    <div className="relative h-9 w-14 overflow-hidden rounded-full">
      <div className="absolute left-0 top-0 h-9 w-14 bg-[#BBFF63]" />
    </div>
  );
}

function NotificationRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <img
        src={placeholderAvatar}
        className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover object-top shrink-0"
        alt={label}
        draggable={false}
      />
      <div className="flex flex-1 items-center justify-between py-3 sm:py-4">
        <div className="font-['Montserrat'] text-lg sm:text-2xl font-medium text-foreground">
          {label}
        </div>
        <NotificationSwitch />
      </div>
    </div>
  );
}

function NotificationsPanel() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
        NOTIFICATIONS
      </div>
      <div className="flex flex-col gap-4 sm:gap-6">
        <NotificationRow label="Men" />
        <NotificationRow label="Women" />
        <NotificationRow label="Kids" />
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return <NotificationsPanel />;
}
