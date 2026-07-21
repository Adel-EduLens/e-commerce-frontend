import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { asset } from "../../components/trader/inventoryUtils";
import { BlankProductFormModal } from "../../components/trader/BlankProductFormModal";
import { LoadingSpinner } from "../../components/shared";
import {
  type Product,
  useTraderProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../hooks/queries/productsQuery";
import { toast } from "sonner";

interface BlankProductTablePanelProps {
  products: Product[];
  loading: boolean;
  onAdd?: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function BlankProductTablePanel({
  products,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: BlankProductTablePanelProps) {
  const { t } = useTranslation("traderBlankProducts");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("date-desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenFilter(null);
    if (openFilter) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openFilter]);

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
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
            placeholder={t("searchBlankProducts")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-2xl border border-stroke bg-card py-3 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-foreground outline-none transition placeholder:text-gray-text focus:border-stroke"
          />
        </label>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-lg border border-stroke bg-card px-4 py-3 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
          >
            <img className="h-5 w-5" src={asset("ic_round-plus.svg")} alt="" />
            {t("addBlankProduct")}
          </button>
        )}
      </div>

      <section className="rounded-2xl border border-stroke bg-card shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">
              {t("blankProductsTable")}
            </h2>

            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenFilter(openFilter === "sort" ? null : "sort");
                }}
                className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 font-['Montserrat'] text-xs font-medium transition ${sortBy !== "date-desc" && sortBy !== "none" ? "border-primary bg-primary text-foreground" : "border-stroke bg-card text-foreground hover:bg-background"}`}
              >
                {t("sortBy")}
                <img
                  className={`h-4 w-4 transition-transform ${openFilter === "sort" ? "-rotate-90" : "rotate-90"}`}
                  src={asset("weui_arrow-outlined.svg")}
                  alt=""
                />
              </button>
              {openFilter === "sort" && (
                <div className="absolute left-0 top-full z-20 mt-1 min-w-40 rounded-xl border border-stroke bg-card shadow-lg py-1">
                  {[
                    { value: "none", label: t("none") },
                    { value: "date-desc", label: t("newestFirst") },
                    { value: "date-asc", label: t("oldestFirst") },
                    { value: "name-asc", label: t("nameAsc") },
                    { value: "name-desc", label: t("nameDesc") },
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
            <div className="flex items-center gap-1 rounded-2xl border border-stroke bg-card px-2 py-1">
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
          <LoadingSpinner text={t("loadingBlankProducts")} containerClassName="py-20" className="h-8 w-8" />
        ) : paginated.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("noBlankProductsFound")}
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((p) => {
              const firstImage = p.colors?.[0]?.images?.[0]?.url;
              return (
                <div
                  key={p.id}
                  className="relative flex flex-col overflow-hidden rounded-lg border border-stroke bg-card"
                >
                  <div className="relative mx-2 mt-2 h-48 overflow-hidden rounded-lg bg-background">
                    {firstImage ? (
                      <img
                        className="h-full w-full object-cover"
                        src={firstImage}
                        alt=""
                      />
                    ) : (
                      <div className="h-full w-full bg-background" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-3">
                    <div className="flex justify-between items-start">
                      <p className="truncate font-['Montserrat'] text-base font-semibold text-foreground">
                        {p.name}
                      </p>
                      <span className="font-['Montserrat'] text-sm font-bold text-primary">
                        ${p.blankPrice ?? p.price ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-stroke">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-card transition hover:bg-background"
                        >
                          <img
                            className="h-4 w-4"
                            src={asset("mynaui_edit.svg")}
                            alt=""
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(p.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-card transition hover:bg-background"
                        >
                          <img
                            className="h-4 w-4"
                            src={asset("material-symbols_delete-outline.svg")}
                            alt=""
                          />
                        </button>
                      </div>
                      <p className="font-['Montserrat'] text-xs font-medium text-gray-text">
                        {new Date(p.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("image", { ns: "traderRetailCategories" })}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("name", { ns: "traderRetailCategories" })}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("price")}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("isActive")}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("date", { ns: "traderRetailCategories" })}
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    {t("actions", { ns: "traderRetailCategories" })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p, idx) => {
                  const firstImage = p.colors?.[0]?.images?.[0]?.url;
                  return (
                    <tr
                      key={p.id}
                      className={idx % 2 === 0 ? "bg-card" : "bg-background"}
                    >
                      <td className="px-4 py-3 text-center">
                        {firstImage ? (
                          <img
                            className="mx-auto h-8 w-8 rounded-lg object-cover"
                            src={firstImage}
                            alt=""
                          />
                        ) : (
                          <div className="mx-auto h-8 w-8 rounded-lg bg-background" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center font-['Montserrat'] text-sm font-medium text-foreground">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-center font-['Montserrat'] text-sm font-medium text-foreground">
                        ${p.blankPrice ?? p.price ?? 0}
                      </td>
                      <td className="px-4 py-3 text-center font-['Montserrat'] text-sm font-medium text-foreground">
                        {p.isActive ? t("yes", { ns: "traderRetailCategories" }) : t("no", { ns: "traderRetailCategories" })}
                      </td>
                      <td className="px-4 py-3 text-center font-['Montserrat'] text-sm font-medium text-foreground whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEdit(p)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke bg-card transition hover:bg-background"
                          >
                            <img
                              className="h-4 w-4"
                              src={asset("mynaui_edit.svg")}
                              alt=""
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(p.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke bg-card transition hover:bg-background"
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
                  );
                })}
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
              className="flex items-center gap-1.5 rounded-lg border border-stroke bg-card px-4 py-2.5 font-['Inter'] text-sm font-medium text-foreground transition hover:bg-background"
            >
              {t("perPage", { count: itemsPerPage })}
              <img
                className={`h-4 w-4 transition-transform ${openFilter === "pagesize" ? "rotate-180" : ""}`}
                src={asset("weui_arrow-outlined.svg")}
                alt=""
              />
            </button>
            {openFilter === "pagesize" && (
              <div className="absolute bottom-full left-0 z-20 mb-1 min-w-30 rounded-xl border border-stroke bg-card shadow-lg py-1">
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
                    {t("perPage", { count: size })}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-stroke bg-card px-4 py-2.5">
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
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 space-y-4 shadow-xl">
            <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
              {t("deleteProduct")}
            </h3>
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("deleteConfirmation")}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-stroke py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground bg-card"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(deleteId);
                  setDeleteId(null);
                }}
                className="flex-1 rounded-xl bg-danger py-2.5 font-['Montserrat'] text-sm font-bold text-primary-foreground transition hover:opacity-90"
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

export default function TraderBlankProductsPage({ onEdit }: { onEdit: (item: any) => void }) {
  const { t } = useTranslation("traderBlankProducts");

  const { data: blankProducts = [], isLoading } = useTraderProducts("BLANK");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  return (
    <>
      <BlankProductTablePanel
        products={blankProducts}
        loading={isLoading}
        onEdit={(product) => {
          const item = {
            id: product.id,
            product: product.name,
            categoryIds: product.categories?.map((c) => c.id) || [],
            brandId: product.brandId,
            description: product.description,
            sku: product.sku,
            type: "blank",
            priceNum: product.blankPrice ?? product.price,
            colors: product.colors?.map((c) => c.colorName || c.color) || [],
          };
          onEdit(item);
        }}
        onDelete={(id) => deleteProduct.mutate(id)}
      />
    </>
  );
}