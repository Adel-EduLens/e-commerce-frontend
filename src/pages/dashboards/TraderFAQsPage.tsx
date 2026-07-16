import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/shared";
import FAQFormModal from "../../components/trader/FAQFormModal";
import { asset } from "../../components/trader/inventoryUtils";
import {
  type FAQ,
  useFAQs,
  useCreateFAQ,
  useUpdateFAQ,
  useDeleteFAQ,
} from "../../hooks/queries/faqQuery";

interface FAQTablePanelProps {
  faqs: FAQ[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: number) => void;
}

export function FAQTablePanel({
  faqs,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: FAQTablePanelProps) {
  const { t } = useTranslation("traderFAQs");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("date-desc");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenFilter(null);
    if (openFilter) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openFilter]);

  const filtered = faqs
    .filter((f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "question-asc":
          return a.question.localeCompare(b.question);
        case "question-desc":
          return b.question.localeCompare(a.question);
        case "date-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "none":
          return 0;
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-start gap-3">
        <label className="relative flex min-w-70 items-center">
          <img
            className="pointer-events-none absolute left-4 h-5 w-5"
            src={asset("mynaui_search.svg")}
            alt=""
          />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-2xl border border-stroke bg-white py-3 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-foreground outline-none transition placeholder:text-gray-text focus:border-stroke"
          />
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-3 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
        >
          <img className="h-5 w-5" src={asset("ic_round-plus.svg")} alt="" />
          {t("addFAQ")}
        </button>
      </div>

      <section className="rounded-2xl border border-stroke bg-white shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">
              {t("tableHeading")}
            </h2>

            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenFilter(openFilter === "sort" ? null : "sort");
                }}
                className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 font-['Montserrat'] text-xs font-medium transition ${
                  sortBy !== "date-desc" && sortBy !== "none"
                    ? "border-primary bg-primary text-foreground"
                    : "border-stroke bg-white text-foreground hover:bg-background"
                }`}
              >
                {t("sortBy")}
                <img
                  className={`h-4 w-4 transition-transform ${openFilter === "sort" ? "-rotate-90" : "rotate-90"}`}
                  src={asset("weui_arrow-outlined.svg")}
                  alt=""
                />
              </button>
              {openFilter === "sort" && (
                <div className="absolute left-0 top-full z-20 mt-1 min-w-40 rounded-xl border border-stroke bg-white shadow-lg py-1">
                  {[
                    { value: "none", label: t("sortNone") },
                    { value: "date-desc", label: t("sortNewestFirst") },
                    { value: "date-asc", label: t("sortOldestFirst") },
                    { value: "question-asc", label: t("sortQuestionAsc") },
                    { value: "question-desc", label: t("sortQuestionDesc") },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        setOpenFilter(null);
                        setPage(1);
                      }}
                      className={`w-full px-3 py-2 text-left font-['Montserrat'] text-xs font-medium transition hover:bg-background ${
                        sortBy === opt.value ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-2xl border border-stroke bg-white px-2 py-1">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${
                  viewMode === "table" ? "bg-gray-light" : ""
                }`}
              >
                <img
                  className="h-6 w-6"
                  src={asset("material-symbols_table-outline.svg")}
                  alt=""
                />
                <span
                  className={`font-['Montserrat'] text-xs font-medium ${
                    viewMode === "table" ? "text-foreground" : "text-gray-text"
                  }`}
                >
                  {t("tableMode", "Table")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${
                  viewMode === "cards" ? "bg-gray-light" : ""
                }`}
              >
                <img
                  className="h-6 w-6"
                  src={asset("clarity_view-cards-line.svg")}
                  alt=""
                />
                <span
                  className={`font-['Montserrat'] text-xs font-medium ${
                    viewMode === "cards" ? "text-foreground" : "text-gray-text"
                  }`}
                >
                  {t("cardMode", "Cards")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text={t("loadingFAQs")} containerClassName="py-20" className="h-8 w-8" />
        ) : paginated.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("noFAQsFound")}
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((faq) => (
              <div
                key={faq.id}
                className="relative flex flex-col justify-between overflow-hidden rounded-lg border border-stroke bg-white p-4 gap-4"
              >
                <div className="space-y-2">
                  <h3 className="font-['Montserrat'] text-base font-semibold text-foreground break-words">
                    Q: {faq.question}
                  </h3>
                  <p className="font-['Montserrat'] text-sm text-gray-text break-words">
                    A: {faq.answer}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stroke">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(faq)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                    >
                      <img
                        className="h-4 w-4"
                        src={asset("mynaui_edit.svg")}
                        alt=""
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(faq.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                    >
                      <img
                        className="h-4 w-4"
                        src={asset("material-symbols_delete-outline.svg")}
                        alt=""
                      />
                    </button>
                  </div>
                  <p className="font-['Montserrat'] text-xs font-medium text-gray-text">
                    {new Date(faq.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("colQuestion")}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("colAnswer")}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("colDate")}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("colActions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((faq, idx) => (
                  <tr
                    key={faq.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-background"}
                  >
                    <td className="px-4 py-3 text-center max-w-[200px] truncate font-['Montserrat'] text-sm font-medium text-foreground">
                      {faq.question}
                    </td>
                    <td className="px-4 py-3 text-center max-w-[300px] truncate font-['Montserrat'] text-sm font-medium text-foreground">
                      {faq.answer}
                    </td>
                    <td className="px-4 py-3 text-center font-['Montserrat'] text-sm font-medium text-foreground whitespace-nowrap">
                      {new Date(faq.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(faq)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                        >
                          <img
                            className="h-4 w-4"
                            src={asset("mynaui_edit.svg")}
                            alt=""
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(faq.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                        >
                          <img
                            className="h-4 w-4"
                            src={asset("material-symbols_delete-outline.svg")}
                            alt=""
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-stroke px-4 py-3">
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenFilter(openFilter === "pagesize" ? null : "pagesize");
              }}
              className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5 font-['Inter'] text-sm font-medium text-foreground transition hover:bg-background"
            >
              {itemsPerPage} {t("perPage")}
              <img
                className={`h-4 w-4 transition-transform ${openFilter === "pagesize" ? "rotate-180" : ""}`}
                src={asset("weui_arrow-outlined.svg")}
                alt=""
              />
            </button>
            {openFilter === "pagesize" && (
              <div className="absolute bottom-full left-0 z-20 mb-1 min-w-30 rounded-xl border border-stroke bg-white shadow-lg py-1">
                {[6, 12, 24].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setItemsPerPage(size);
                      setPage(1);
                      setOpenFilter(null);
                    }}
                    className={`w-full px-3 py-2 text-left font-['Inter'] text-sm font-medium transition hover:bg-background ${
                      itemsPerPage === size ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {size} {t("perPage")}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5">
            <span className="font-['Inter'] text-sm font-medium text-foreground">
              {filtered.length === 0
                ? "0"
                : Math.min((safePage - 1) * itemsPerPage + 1, filtered.length)}
              –{Math.min(safePage * itemsPerPage, filtered.length)}{" "}
              <span className="text-gray-text">{t("of")} {filtered.length}</span>
            </span>
            <span className="mx-1 h-5 border-l border-stroke" />
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-5 w-5 items-center justify-center disabled:opacity-40"
            >
              <img
                className="h-3 w-2"
                src={asset("weui_arrow-filled.svg")}
                alt=""
              />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-5 w-5 rotate-180 items-center justify-center disabled:opacity-40"
            >
              <img
                className="h-3 w-2"
                src={asset("weui_arrow-filled.svg")}
                alt="Next"
              />
            </button>
          </div>
        </div>
      </section>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 space-y-4 shadow-xl">
            <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
              {t("deleteModalHeading")}
            </h3>
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("deleteModalText")}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-stroke py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground bg-white"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(deleteId);
                  setDeleteId(null);
                }}
                className="flex-1 rounded-xl bg-red-600 py-2.5 font-['Montserrat'] text-sm font-bold text-white transition hover:bg-red-700"
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

export default function TraderFAQsPage() {
  const { t } = useTranslation("traderFAQs");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editFAQ, setEditFAQ] = useState<FAQ | null>(null);

  const { data: faqs = [], isLoading } = useFAQs();
  const createFAQ = useCreateFAQ();
  const updateFAQ = useUpdateFAQ();
  const deleteFAQ = useDeleteFAQ();

  return (
    <>
      {showAddModal && (
        <FAQFormModal
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            try {
              await createFAQ.mutateAsync(data);
              setShowAddModal(false);
              toast.success(t("createSuccess"));
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : t("createError")
              );
            }
          }}
        />
      )}

      {editFAQ && (
        <FAQFormModal
          faq={editFAQ}
          onClose={() => setEditFAQ(null)}
          onSave={async (formData) => {
            try {
              await updateFAQ.mutateAsync({
                id: editFAQ.id,
                payload: {
                  question: formData.question,
                  answer: formData.answer,
                },
              });
              setEditFAQ(null);
              toast.success(t("updateSuccess"));
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : t("updateError")
              );
            }
          }}
        />
      )}

      <FAQTablePanel
        faqs={faqs}
        loading={isLoading}
        onAdd={() => setShowAddModal(true)}
        onEdit={setEditFAQ}
        onDelete={async (id) => {
          try {
            await deleteFAQ.mutateAsync(id);
            toast.success(t("deleteSuccess"));
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : t("deleteError")
            );
          }
        }}
      />
    </>
  );
}
