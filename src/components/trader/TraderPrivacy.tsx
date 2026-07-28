import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/shared";
import { Plus, Edit3, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  type PrivacyPolicy,
  type PrivacySection,
  useAllPrivacy,
  useLatestPrivacy,
  useAddPrivacy,
  useUpdatePrivacy,
  useDeletePrivacy,
  useActivatePrivacy,
} from "../../hooks/queries/privacyQuery";
import { Toggle } from "../../components/ui";


// Component for a Form Modal to Add or Edit Privacy Policy
interface PrivacyFormModalProps {
  privacy?: PrivacyPolicy | null;
  onSave: (sections: PrivacySection[]) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

function PrivacyFormModal({ privacy, onSave, onClose, isSaving }: PrivacyFormModalProps) {
  const { t } = useTranslation("traderPrivacy");
  const [sections, setSections] = useState<PrivacySection[]>(
    privacy?.sections
      ? [...privacy.sections].sort((a, b) => a.order - b.order)
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

  const handleSectionChange = (index: number, field: keyof PrivacySection, value: string | number) => {
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
            {privacy ? t("editPrivacy") : t("addPrivacy")}
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

export default function TraderPrivacyPage() {
  const { t, i18n } = useTranslation("traderPrivacy");
  const isRTL = i18n.language?.startsWith("ar");

  const { data: allPrivacy = [], isLoading: isLoadingAll } = useAllPrivacy();
  const { data: latestPrivacy, isLoading: isLoadingLatest } = useLatestPrivacy();

  const addPrivacy = useAddPrivacy();
  const updatePrivacy = useUpdatePrivacy();
  const deletePrivacy = useDeletePrivacy();
  const activatePrivacy = useActivatePrivacy();


  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPrivacy, setEditingPrivacy] = useState<PrivacyPolicy | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSave = async (sections: PrivacySection[]) => {
    const promise = editingPrivacy
      ? updatePrivacy.mutateAsync({
          id: editingPrivacy.id,
          payload: { sections },
        })
      : addPrivacy.mutateAsync({ sections });

    toast.promise(promise, {
      loading: editingPrivacy ? t("updatingLoader") : t("addingLoader"),
      success: () => {
        setShowFormModal(false);
        setEditingPrivacy(null);
        return editingPrivacy ? t("updateSuccess") : t("addSuccess");
      },
      error: (err) => err instanceof Error ? err.message : t(editingPrivacy ? "updateError" : "addError"),
    });
  };

  const handleDelete = async (id: string) => {
    const promise = deletePrivacy.mutateAsync(id);

    toast.promise(promise, {
      loading: t("deletingLoader"),
      success: t("deleteSuccess"),
      error: (err) => err instanceof Error ? err.message : t("deleteError"),
    });
  };

  const handleActivate = async (id: string) => {
    const promise = activatePrivacy.mutateAsync(id);

    toast.promise(promise, {
      loading: t("activatingLoader"),
      success: t("activateSuccess"),
      error: (err) => err instanceof Error ? err.message : t("activateError"),
    });
  };

  const isSaving = addPrivacy.isPending || updatePrivacy.isPending || activatePrivacy.isPending;

  const isLoading = isLoadingAll || isLoadingLatest;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-['Montserrat'] text-2xl font-bold text-foreground">
            {t("privacyHeading")}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingPrivacy(null);
            setShowFormModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-['Montserrat'] text-sm font-bold text-primary-foreground shadow-lg shadow-primary/10 transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          {t("addPrivacy")}
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner text={t("loading")} containerClassName="py-20" className="h-8 w-8" />
      ) : allPrivacy.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stroke bg-card py-20 px-4 text-center">
          <div className="rounded-full bg-primary/5 p-4 text-primary mb-4">
            <Plus className="h-10 w-10" />
          </div>
          <p className="font-['Montserrat'] text-base font-semibold text-foreground">
            {t("noPrivacyFound")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {allPrivacy.map((privacy) => {
            const isLatest = latestPrivacy?.id === privacy.id;
            const isExpanded = expandedId === privacy.id;

            return (
              <div
                key={privacy.id}
                className={`rounded-2xl border bg-card text-foreground shadow-sm transition-all duration-200 ${
                  privacy.isActive
                    ? "border-primary/40 shadow-primary/5 shadow-md bg-gradient-to-br from-card to-primary/5"
                    : "border-stroke"
                }`}
              >
                {/* Card Header */}
                <div
                  className="flex flex-wrap items-center justify-between gap-4 p-5 cursor-pointer select-none"
                  onClick={() => toggleExpand(privacy.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-['Montserrat'] text-sm font-bold text-foreground">
                          {t("versionId")}: {privacy.id.substring(0, 8)}...
                        </span>
                        {privacy.isActive && (
                          <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 font-['Montserrat'] text-2xs font-semibold text-primary uppercase tracking-wider">
                            {t("latestBadge")}
                          </span>
                        )}
                      </div>
                      <p className="font-['Montserrat'] text-xs text-gray-text">
                        {t("createdAt")}: {new Date(privacy.createdAt).toLocaleDateString(i18n.language, {
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
                        {privacy.isActive ? t("activeStatus") : t("inactiveStatus")}
                      </span>
                      <Toggle
                        checked={privacy.isActive}
                        onChange={() => {
                          if (!privacy.isActive) {
                            handleActivate(privacy.id);
                          }
                        }}
                        disabled={privacy.isActive || activatePrivacy.isPending}
                        size="sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPrivacy(privacy);
                        setShowFormModal(true);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-stroke bg-card text-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition"
                      title={t("editPrivacy")}
                    >
                      <Edit3 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(privacy.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-stroke bg-card text-foreground hover:bg-red-500 hover:text-white transition"
                      title={t("delete")}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(privacy.id)}
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
                      {t("sections")} ({privacy.sections.length})
                    </h4>
                    <div className="divide-y divide-stroke/60">
                      {privacy.sections.map((section) => (
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
        <PrivacyFormModal
          privacy={editingPrivacy}
          onSave={handleSave}
          onClose={() => {
            setShowFormModal(false);
            setEditingPrivacy(null);
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
