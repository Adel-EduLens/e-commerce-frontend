import { useState } from "react";
import { Info } from "lucide-react";
import { handleApiError } from '../../../lib/utils';
import { toast } from "sonner";
import {
  usePrizes,
  useAddPrize,
  useDeletePrize,
} from "../../../hooks/queries/prizeQuery";
import { useTranslation } from "react-i18next";

const PrizeControllerPage = () => {
  const { t, i18n } = useTranslation("traderPrizes");
  const { data: prizes = [], isLoading } = usePrizes();
  const addPrize = useAddPrize();
  const deletePrize = useDeletePrize();

  const isRTL = i18n.language?.startsWith("ar");

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [errors, setErrors] = useState<{ name?: string; weight?: string }>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const validate = () => {
    const tempErrors: { name?: string; weight?: string } = {};
    if (!name.trim()) {
      tempErrors.name = "nameRequired";
    }
    const weightNum = Number(weight);
    if (!weight || isNaN(weightNum) || weightNum < 1) {
      tempErrors.weight = "weightMin";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addPrize.mutateAsync({
        name,
        weight: Number(weight),
      });

      toast.success(t("addSuccess"));
      setName("");
      setWeight("");
      setErrors({});
    } catch (error) {
      handleApiError(error, t("addError"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePrize.mutateAsync(id);
      toast.success(t("deleteSuccess"));
    } catch (error) {
      handleApiError(error, t("deleteError"));
    }
  };

  if (isLoading) return <p className="p-6 text-gray-text">{t("loading")}</p>;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background p-6 flex flex-col gap-6">
      {/* FORM */}
      <form onSubmit={onSubmit} className="p-4 ">
        <div className="flex flex-col gap-1">
          <input
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className="border border-stroke bg-background text-foreground placeholder:text-gray-text p-2 rounded-lg outline-none focus:border-primary transition-colors"
          />
          <p className="text-red-500 text-xs min-h-[1rem]">
            {errors.name ? t(errors.name) : ""}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="number"
            placeholder={t("weightPlaceholder")}
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              if (errors.weight) setErrors((prev) => ({ ...prev, weight: undefined }));
            }}
            className="border border-stroke bg-background text-foreground placeholder:text-gray-text p-2 rounded-lg outline-none focus:border-primary transition-colors"
          />
          <p className="text-red-500 text-xs min-h-[1rem]">
            {errors.weight ? t(errors.weight) : ""}
          </p>

          <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-foreground/90 mb-3">
            <Info className="siz-8 text-primary shrink-0" />
            <p className="leading-relaxed text-xl">{t("weightHint")}</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={addPrize.isPending}
          className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {addPrize.isPending ? t("adding") : t("add")}
        </button>
      </form>

      {/* LIST */}
      <div className="flex flex-col gap-3">
        {prizes.map((prize) => (
          <div
            key={prize.id}
            className="flex justify-between items-center bg-card border border-stroke rounded-xl p-3 shadow-[0_1px_4px_0_var(--color-shadow)]"
          >
            <div>
              <p className="font-bold text-foreground">{prize.name}</p>
              <p className="text-sm text-gray-text">{t("weightLabel")}{prize.weight}</p>
            </div>

            <button
              onClick={() => setDeleteId(prize.id)}
              disabled={deletePrize.isPending}
              className="border border-stroke text-foreground hover:bg-gray-light px-3 py-1 rounded-lg transition-colors disabled:opacity-50 cursor-pointer hover:bg-red-300"
            >
              {t("delete")}
            </button>
          </div>
        ))}

        {prizes.length === 0 && (
          <p className="text-gray-text text-sm text-center py-6">
            {t("noPrizes")}
          </p>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-card p-6 space-y-4 shadow-xl border border-stroke/50">
            <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
              {t("delete")}
            </h3>
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("confirmDelete")}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-stroke py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground bg-white dark:bg-background cursor-pointer"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDelete(deleteId);
                  setDeleteId(null);
                }}
                className="flex-1 rounded-xl bg-red-600 py-2.5 font-['Montserrat'] text-sm font-bold text-white transition hover:bg-red-700 cursor-pointer"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrizeControllerPage;
