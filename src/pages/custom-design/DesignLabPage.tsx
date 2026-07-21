import { useTranslation } from "react-i18next";

export default function DesignLabPage() {
  const { t } = useTranslation("navbar");
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <h1 className="font-['Montserrat'] text-4xl font-bold text-foreground">
        {t("designLab")}
      </h1>
    </div>
  );
}
