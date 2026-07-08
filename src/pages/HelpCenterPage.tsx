import { ChevronRight, Mail, MessageSquare, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUserHelpCenterCategories } from "../hooks/queries/helpCenterQuery";

function CategoryCard({ title }: { title: string }) {
  const { t } = useTranslation("helpCenter");
  const navigate = useNavigate();
  return (
    <div
      className="relative h-32 w-full overflow-hidden rounded-2xl bg-card p-4 outline outline-1 outline-offset-[-1px] outline-stroke cursor-pointer"
      onClick={() => navigate(`/help-center/${title}`)}
    >
      <div className="font-['Montserrat'] text-xl sm:text-2xl font-semibold text-foreground">
        {t(title)}
      </div>
      <div className="absolute right-3 bottom-3">
        <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-card outline outline-1 outline-offset-[-1px] outline-stroke">
          <ChevronRight className="h-5 w-5 text-foreground" />
        </div>
      </div>
    </div>
  );
}

function HelpCenterPanel() {
  const { t } = useTranslation("helpCenter");
  const { data: categories = [], isLoading } = useUserHelpCenterCategories();

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center p-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="font-['Montserrat'] text-3xl font-bold text-foreground">
        {t("Help Center")}
      </div>
      <div className="font-['Montserrat'] text-2xl font-semibold text-foreground">
        {t("Categories")}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} title={cat.name} />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="font-['Montserrat'] text-2xl font-semibold text-foreground">
          {t("Contact Support")}
        </div>
        <div className=" font-['Montserrat'] text-base font-medium text-foreground">
          {t("Need more help?")}
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center justify-start gap-2 rounded-2xl bg-card p-4 outline outline-1 outline-offset-[-1px] outline-stroke">
            <MessageSquare
              className="h-6 w-6 text-foreground"
              strokeWidth={1.5}
            />
            <div className="font-['Montserrat'] text-base font-semibold text-foreground">
              {t("Live Chat")}
            </div>
          </div>
          <div className="flex items-center justify-start gap-2 rounded-2xl bg-card p-4 outline outline-1 outline-offset-[-1px] outline-stroke">
            <Mail className="h-6 w-6 text-foreground" strokeWidth={1.5} />
            <div className="font-['Montserrat'] text-base font-semibold text-foreground">
              {t("Email Us")}
            </div>
          </div>
          <div className="flex items-center justify-start gap-2 rounded-2xl bg-card p-4 outline outline-1 outline-offset-[-1px] outline-stroke">
            <Phone className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            <div className="font-['Montserrat'] text-base font-semibold text-foreground">
              {t("Call Center")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HelpCenterPage() {
  return <HelpCenterPanel />;
}
