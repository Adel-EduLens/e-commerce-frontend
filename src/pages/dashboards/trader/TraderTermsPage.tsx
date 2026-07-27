import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { LoadingSpinner } from "../../../components/shared";
import { Plus, Edit3, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  type TermsAndConditions,
  type TermsSection,
  useAllTerms,
  useLatestTerms,
  useAddTerms,
  useUpdateTerms,
  useDeleteTerms,
  useActivateTerms,
} from "../../../hooks/queries/termsQuery";
import { Toggle } from "../../../components/ui";


// Component for a Form Modal to Add or Edit Terms and Conditions
interface TermsFormModalProps {
  terms?: TermsAndConditions | null;
  onSave: (sections: TermsSection[]) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

function TermsFormModal({ terms, onSave, onClose, isSaving }: TermsFormModalProps) {
  const { t } = useTranslation("traderTerms");
  const [sections, setSections] = useState<TermsSection[]>(
    terms?.sections
      ? [...terms.sections].sort((a, b) => a.order - b.order)
      : [{ title: "", content: "", order: 0 }]
  );

  const handleAddSection = () => {
    // Automatically set the order to the next index
    const nextOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 0;
    setSections([...sections, { title: "", content: "", order: nextOrder }]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) {
      toast.error(t("validationError"));
      return;
    }
    const updated = sections.filter((_, i) => i !== index);
    // Recalculate order to keep it clean, but let user modify if needed
    const updatedWithOrder = updated.map((sec, idx) => ({ ...sec, order: idx }));
    setSections(updatedWithOrder);
  };

  const handleSectionChange = (index: number, field: keyof TermsSection, value: string | number) => {
    const updated = [...sections];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setSections(updated);
  };

  const handleSave = () => {
    const isValid = sections.every(
      (sec) => sec.title.trim() && sec.content.trim() && typeof sec.order === "number"
    );
    if (!isValid || sections.length === 0) {
      toast.error(t("validationError"));
      return;
    }
    onSave(sections.map(s => ({
      title: s.title.trim(),
      content: s.content.trim(),
      order: Number(s.order),
    })));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-card border border-stroke shadow-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {terms ? t("editTerms") : t("addTerms")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-text hover:text-foreground transition p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col gap-6 p-6 overflow-y-auto no-scrollbar">
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-stroke bg-background/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Montserrat'] text-xs font-semibold text-primary uppercase tracking-wider">
                    {t("sections")} #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(index)}
                    className="text-gray-text hover:text-red-500 transition p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 opacity-80 hover:opacity-100"
                    title={t("removeSection")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-3 space-y-1">
                    <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
                      {t("sectionTitle")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("sectionTitle")}
                      value={section.title}
                      onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                      className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
                      {t("sectionOrder")}
                    </label>
                    <input
                      type="number"
                      placeholder={t("sectionOrder")}
                      value={section.order}
                      onChange={(e) => handleSectionChange(index, "order", parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
                    {t("sectionContent")}
                  </label>
                  <textarea
                    placeholder={t("sectionContent")}
                    value={section.content}
                    onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-card resize-none transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddSection}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            {t("addSection")}
          </button>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 border-t border-stroke p-5 shrink-0 bg-background/30">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? t("loading") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TraderTermsPage() {
  const { t, i18n } = useTranslation("traderTerms");
  const isRTL = i18n.language?.startsWith("ar");

  const { data: allTerms = [], isLoading: isLoadingAll } = useAllTerms();
  const { data: latestTerms, isLoading: isLoadingLatest } = useLatestTerms();

  const addTerms = useAddTerms();
  const updateTerms = useUpdateTerms();
  const deleteTerms = useDeleteTerms();
  const activateTerms = useActivateTerms();


  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTerms, setEditingTerms] = useState<TermsAndConditions | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSave = async (sections: TermsSection[]) => {
    const promise = editingTerms
      ? updateTerms.mutateAsync({
          id: editingTerms.id,
          payload: { sections },
        })
      : addTerms.mutateAsync({ sections });

    toast.promise(promise, {
      loading: editingTerms ? t("updatingLoader") : t("addingLoader"),
      success: () => {
        setShowFormModal(false);
        setEditingTerms(null);
        return editingTerms ? t("updateSuccess") : t("addSuccess");
      },
      error: (err) => err instanceof Error ? err.message : t(editingTerms ? "updateError" : "addError"),
    });
  };

  const handleDelete = async (id: string) => {
    const promise = deleteTerms.mutateAsync(id);

    toast.promise(promise, {
      loading: t("deletingLoader"),
      success: t("deleteSuccess"),
      error: (err) => err instanceof Error ? err.message : t("deleteError"),
    });
  };

  const handleActivate = async (id: string) => {
    const promise = activateTerms.mutateAsync(id);

    toast.promise(promise, {
      loading: t("activatingLoader"),
      success: t("activateSuccess"),
      error: (err) => err instanceof Error ? err.message : t("activateError"),
    });
  };

  const isSaving = addTerms.isPending || updateTerms.isPending || activateTerms.isPending;

  const isLoading = isLoadingAll || isLoadingLatest;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-['Montserrat'] text-2xl font-bold text-foreground">
            {t("termsHeading")}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingTerms(null);
            setShowFormModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-['Montserrat'] text-sm font-bold text-primary-foreground shadow-lg shadow-primary/10 transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          {t("addTerms")}
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner text={t("loading")} containerClassName="py-20" className="h-8 w-8" />
      ) : allTerms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stroke bg-card py-20 px-4 text-center">
          <div className="rounded-full bg-primary/5 p-4 text-primary mb-4">
            <Plus className="h-10 w-10" />
          </div>
          <p className="font-['Montserrat'] text-base font-semibold text-foreground">
            {t("noTermsFound")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {allTerms.map((terms) => {
            const isLatest = latestTerms?.id === terms.id;
            const isExpanded = expandedId === terms.id;

            return (
              <div
                key={terms.id}
                className={`rounded-2xl border bg-card text-foreground shadow-sm transition-all duration-200 ${
                  terms.isActive
                    ? "border-primary/40 shadow-primary/5 shadow-md bg-gradient-to-br from-card to-primary/5"
                    : "border-stroke"
                }`}
              >
                {/* Card Header */}
                <div
                  className="flex flex-wrap items-center justify-between gap-4 p-5 cursor-pointer select-none"
                  onClick={() => toggleExpand(terms.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-['Montserrat'] text-sm font-bold text-foreground">
                          {t("versionId")}: {terms.id.substring(0, 8)}...
                        </span>
                        {terms.isActive && (
                          <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 font-['Montserrat'] text-2xs font-semibold text-primary uppercase tracking-wider">
                            {t("latestBadge")}
                          </span>
                        )}
                      </div>
                      <p className="font-['Montserrat'] text-xs text-gray-text">
                        {t("createdAt")}: {new Date(terms.createdAt).toLocaleDateString(i18n.language, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2 mr-2 ml-2">
                      <span className="font-['Montserrat'] text-xs font-semibold text-gray-text">
                        {terms.isActive ? t("activeStatus") : t("inactiveStatus")}
                      </span>
                      <Toggle
                        checked={terms.isActive}
                        onChange={() => {
                          if (!terms.isActive) {
                            handleActivate(terms.id);
                          }
                        }}
                        disabled={terms.isActive || activateTerms.isPending}
                        size="sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTerms(terms);
                        setShowFormModal(true);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-stroke bg-card text-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition"
                      title={t("editTerms")}
                    >
                      <Edit3 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(terms.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-stroke bg-card text-foreground hover:bg-red-500 hover:text-white transition"
                      title={t("delete")}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(terms.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-stroke bg-card text-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Sections Area */}
                {isExpanded && (
                  <div className="border-t border-stroke p-5 space-y-4 bg-background/20 rounded-b-2xl">
                    <h4 className="font-['Montserrat'] text-sm font-bold text-foreground">
                      {t("sections")} ({terms.sections.length})
                    </h4>
                    <div className="divide-y divide-stroke/60">
                      {terms.sections.map((section) => (
                        <div key={section.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-['Montserrat'] text-3xs font-semibold">
                              {section.order}
                            </span>
                            <h5 className="font-['Montserrat'] text-sm font-semibold text-foreground">
                              {section.title}
                            </h5>
                          </div>
                          <p className="font-['Montserrat'] text-sm text-gray-text leading-relaxed pl-7 pr-7 whitespace-pre-line">
                            {section.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {showFormModal && (
        <TermsFormModal
          terms={editingTerms}
          onSave={handleSave}
          onClose={() => {
            setShowFormModal(false);
            setEditingTerms(null);
          }}
          isSaving={isSaving}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-card border border-stroke p-6 space-y-4 shadow-2xl">
            <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
              {t("delete")}
            </h3>
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("confirmDelete")}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-stroke py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground bg-card hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer"
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
}
