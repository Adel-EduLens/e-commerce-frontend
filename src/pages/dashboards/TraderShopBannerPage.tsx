import { useState, useEffect } from "react";
import { asset } from "../../components/trader/inventoryUtils";
import { ShopBannerFormModal } from "../../components/trader/ShopBannerFormModal";
import { LoadingSpinner } from "../../components/shared";
import {
  type ShopBanner,
  useShopBanners,
  useCreateShopBanner,
  useUpdateShopBanner,
  useDeleteShopBanner,
} from "../../hooks/queries/shopBannerQuery";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ShopBannerTablePanelProps {
  banners: ShopBanner[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (banner: ShopBanner) => void;
  onDelete: (id: string) => void;
}

export function ShopBannerTablePanel({
  banners,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: ShopBannerTablePanelProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("date-desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { t } = useTranslation("traderShopBannerPage");

  useEffect(() => {
    const handleClickOutside = () => setOpenFilter(null);
    if (openFilter) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openFilter]);

  const filtered = banners
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "date-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "order-asc":
          return a.order - b.order;
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
    safePage * itemsPerPage,
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
            placeholder={t("searchBanners")}
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
          {t("addShopBanner")}
        </button>
      </div>

      <section className="rounded-2xl border border-stroke bg-white shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">
              {t("shopBanners")}
            </h2>

            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenFilter(openFilter === "sort" ? null : "sort");
                }}
                className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 font-['Montserrat'] text-xs font-medium transition ${sortBy !== "date-desc" && sortBy !== "none" ? "border-primary bg-primary text-foreground" : "border-stroke bg-white text-foreground hover:bg-background"}`}
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
                    { value: "none", label: t("noSort") },
                    { value: "date-desc", label: t("newestFirst") },
                    { value: "date-asc", label: t("oldestFirst") },
                    { value: "name-asc", label: t("titleAsc") },
                    { value: "name-desc", label: t("titleDesc") },
                    { value: "order-asc", label: t("order") },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        setOpenFilter(null);
                        setPage(1);
                      }}
                      className={`w-full px-3 py-2 text-left font-['Montserrat'] text-xs font-medium transition hover:bg-background ${sortBy === opt.value ? "text-primary" : "text-foreground"}`}
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
                className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${viewMode === "table" ? "bg-gray-light" : ""}`}
              >
                <img
                  className="h-6 w-6"
                  src={asset("material-symbols_table-outline.svg")}
                  alt=""
                />
                <span
                  className={`font-['Montserrat'] text-xs font-medium ${viewMode === "table" ? "text-foreground" : "text-gray-text"}`}
                >
                  {t("tables")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${viewMode === "cards" ? "bg-gray-light" : ""}`}
              >
                <img
                  className="h-6 w-6"
                  src={asset("clarity_view-cards-line.svg")}
                  alt=""
                />
                <span
                  className={`font-['Montserrat'] text-xs font-medium ${viewMode === "cards" ? "text-foreground" : "text-gray-text"}`}
                >
                  {t("cards")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text={t("loadingBanners")} containerClassName="py-20" className="h-8 w-8" />
        ) : paginated.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("noBannersFound")}
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((b) => (
              <div
                key={b.id}
                className="relative flex flex-col overflow-hidden rounded-lg border border-stroke bg-white"
              >
                <div className="relative mx-2 mt-2 h-48 overflow-hidden rounded-lg bg-background" style={{ backgroundColor: b.backgroundColor }}>
                  {b.image ? (
                    <img
                      className="h-full w-full object-contain"
                      src={b.image}
                      alt=""
                    />
                  ) : (
                    <div className="h-full w-full bg-background" />
                  )}
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <p className="truncate font-['Montserrat'] text-base font-semibold text-foreground">
                    {b.title}
                  </p>
                  <p className="truncate font-['Montserrat'] text-xs text-gray-text">
                    {t("orderLabel")} {b.order} | {t("activeLabel")} {b.isActive ? t("yes") : t("no")}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-stroke">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(b)}
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
                        onClick={() => setDeleteId(b.id)}
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
                      {new Date(b.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
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
                    {t("image")}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("title")}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("active")}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("orderHeader")}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((b, idx) => (
                  <tr
                    key={b.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-background"}
                  >
                    <td className="px-4 py-3 text-center">
                      {b.image ? (
                        <div className="mx-auto h-12 w-24 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: b.backgroundColor }}>
                            <img
                              className="h-full w-full object-contain"
                              src={b.image}
                              alt=""
                            />
                        </div>
                      ) : (
                        <div className="mx-auto h-12 w-24 rounded-lg bg-background" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-['Montserrat'] text-sm font-medium text-foreground">
                      {b.title}
                    </td>
                    <td className="px-4 py-3 text-center font-['Montserrat'] text-sm font-medium text-foreground">
                      {b.isActive ? t("yes") : t("no")}
                    </td>
                    <td className="px-4 py-3 text-center font-['Montserrat'] text-sm font-medium text-foreground">
                      {b.order}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(b)}
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
                          onClick={() => setDeleteId(b.id)}
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
                    className={`w-full px-3 py-2 text-left font-['Inter'] text-sm font-medium transition hover:bg-background ${itemsPerPage === size ? "text-primary" : "text-foreground"}`}
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
              {t("deleteShopBanner")}
            </h3>
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("deleteConfirmation")}
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

export default function TraderShopBannerPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBanner, setEditBanner] = useState<ShopBanner | null>(null);

  const { data: banners = [], isLoading } = useShopBanners("shop");
  const createBanner = useCreateShopBanner();
  const updateBanner = useUpdateShopBanner();
  const deleteBanner = useDeleteShopBanner();
  const { t } = useTranslation("traderShopBannerPage");

  return (
    <>
      {showAddModal && (
        <ShopBannerFormModal
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            try {
              await createBanner.mutateAsync(data);
              setShowAddModal(false);
              toast.success(t("bannerCreated"));
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : t("failedCreate"),
              );
            }
          }}
        />
      )}
      {editBanner && (
        <ShopBannerFormModal
          banner={editBanner}
          onClose={() => setEditBanner(null)}
          onSave={async (formData) => {
            try {
              await updateBanner.mutateAsync({
                id: editBanner.id,
                data: formData,
              });
              setEditBanner(null);
              toast.success(t("bannerUpdated"));
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : t("failedUpdate"),
              );
            }
          }}
        />
      )}

      <ShopBannerTablePanel
        banners={banners}
        loading={isLoading}
        onAdd={() => setShowAddModal(true)}
        onEdit={setEditBanner}
        onDelete={(id) => deleteBanner.mutate(id)}
      />
    </>
  );
}