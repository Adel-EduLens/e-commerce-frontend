const placeholderAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23D9D9D9'/%3E%3C/svg%3E";

function NotificationSwitch() {
  return (
    <div className="relative h-9 w-14 overflow-hidden">
      <div className="absolute left-0 top-0 h-9 w-14 bg-[#BBFF63]" />
    </div>
  );
}

function NotificationRow({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center justify-start gap-5 self-stretch">
      <img
        src={placeholderAvatar}
        className="h-14 w-14 rounded-full object-cover object-top"
        alt={label}
        draggable={false}
      />
      <div className="flex w-[453px] items-center justify-between py-4">
        <div className="font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
          {label}
        </div>
        <NotificationSwitch />
      </div>
    </div>
  );
}

function NotificationsPanel() {
  return (
    <>
      <div className="absolute left-[496px] top-[122px] inline-flex w-[537px] items-center justify-between">
        <div className="font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
          NOTIFICATIONS
        </div>
      </div>
      <div className="absolute left-[496px] top-[193px] inline-flex w-[536px] flex-col items-start justify-start gap-6">
        <NotificationRow label="Men" />
        <NotificationRow label="Women" />
        <NotificationRow label="Kids" />
      </div>
    </>
  );
}

export default function NotificationsPage() {
  return <NotificationsPanel />;
}
