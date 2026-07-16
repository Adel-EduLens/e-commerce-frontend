import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type FAQ } from "../../hooks/queries/faqQuery";

interface FAQFormModalProps {
  faq?: FAQ;
  onSave: (data: { question: string; answer: string }) => void;
  onClose: () => void;
}

export function FAQFormModal({ faq, onSave, onClose }: FAQFormModalProps) {
  const { t } = useTranslation("traderFAQs");
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) return;
    onSave({ question: question.trim(), answer: answer.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {faq ? t("editFAQTitle") : t("addFAQTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-text hover:text-foreground text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5 overflow-y-auto">
          <div className="space-y-1">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              {t("colQuestion")}
            </label>
            <textarea
              placeholder={t("questionPlaceholder")}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              {t("colAnswer")}
            </label>
            <textarea
              placeholder={t("answerPlaceholder")}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-white resize-none"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-background"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              disabled={!question.trim() || !answer.trim()}
              onClick={handleSave}
              className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {t("save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FAQFormModal;
