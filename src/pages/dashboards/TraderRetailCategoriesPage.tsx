import { useState, useEffect } from "react";
import { asset } from "../../components/trader/inventoryUtils";
import { LoadingSpinner } from "../../components/shared";
import { toast } from "sonner";
import {
  useRetailCategories,
  useCreateRetailCategory,
  useUpdateRetailCategory,
  useDeleteRetailCategory,
} from "../../hooks/useRetailCategories";
import type { RetailCategory } from "../../types/retail";
import { api } from "../../lib/axios";
import ImageCropModal, {
  validateImageDimensions,
} from "../../components/trader/ImageCropModal";

const uploadImageFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/upload/retail-category-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.url;
};


// --- Retail Category Modal ---
export function RetailCategoryFormModal({
  category,
  onClose,
  onSave,
}: {
  category?: RetailCategory;
  onClose: () => void;
  onSave: (data: Partial<RetailCategory> | FormData | Record<string, unknown>) => Promise<void>;
}) {
  const [name, setName] = useState(category?.name || "");
  const [image, setImage] = useState(category?.image || "");
  const [appearOnHome, setAppearOnHome] = useState(category?.appearOnHome ?? false);
  
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = await validateImageDimensions(file);
    if (error) {
      alert(error);
      return;
    }

    setCropSrc(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCrop = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadImageFile(file);
      setImage(url);
    } catch (err) {

      alert("Failed to upload image");
    } finally {
      setUploading(false);
      setCropSrc(null);
    }
  };

  const handleSaveClick = async () => {
    setIsSubmitting(true);
    try {
      await onSave({ name, image, appearOnHome });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-xl max-h-[90vh] flex flex-col border border-stroke">
        <div className="flex items-center justify-between border-b border-stroke p-5 shrink-0">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {category ? "Edit Retail Category" : "Add Retail Category"}
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
          <div>
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground mb-1">
              Category Name *
            </label>
            <input
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm outline-none focus:border-primary text-foreground bg-background"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              Appear on Home
            </label>
            <button
              type="button"
              onClick={() => setAppearOnHome(!appearOnHome)}
              aria-label={appearOnHome ? `disable appear on home` : `enable appear on home`}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300 ${
                appearOnHome ? "bg-primary" : "bg-stroke"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                  appearOnHome ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="block font-['Montserrat'] text-xs font-semibold text-foreground">
              Category Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm text-gray-text file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-light file:text-foreground hover:file:bg-stroke cursor-pointer"
            />
          </div>

          {image && (
            <div className="relative w-24 h-24 rounded-xl border border-stroke overflow-hidden mt-2">
              <img
                src={image}
                className="h-full w-full object-cover"
                alt="Preview"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-stroke py-3 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-background bg-card"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={uploading || isSubmitting || !name}
              onClick={handleSaveClick}
              className="flex-1 rounded-xl bg-primary py-3 font-['Montserrat'] text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName="retail-category.jpg"
          onCancel={() => setCropSrc(null)}
          onConfirm={handleCrop}
        />
      )}
    </div>
  );
}

// --- Retail Category Table Panel ---
interface RetailCategoryTablePanelProps {
  categories: RetailCategory[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (category: RetailCategory) => void;
  onDelete: (id: string | number) => void;
}

export function RetailCategoryTablePanel({
  categories,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: RetailCategoryTablePanelProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("name-asc");
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenFilter(null);
    if (openFilter) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openFilter]);

  const filtered = categories
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
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
            placeholder="Search Categories"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-2xl border border-stroke bg-card py-3 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-foreground outline-none transition placeholder:text-gray-text focus:border-stroke"
          />
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg border border-stroke bg-card px-4 py-3 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
        >
          <img className="h-5 w-5" src={asset("ic_round-plus.svg")} alt="" />
          Add Category
        </button>
      </div>

      <section className="rounded-2xl border border-stroke bg-card shadow-shadow">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">
              Retail Categories Table
            </h2>

            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenFilter(openFilter === "sort" ? null : "sort");
                }}
                className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 font-['Montserrat'] text-xs font-medium transition ${
                  sortBy !== "none"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-stroke bg-card text-foreground hover:bg-background"
                }`}
              >
                Sort by
                <img
                  className={`h-4 w-4 transition-transform ${openFilter === "sort" ? "-rotate-90" : "rotate-90"}`}
                  src={asset("weui_arrow-outlined.svg")}
                  alt=""
                  style={{ filter: sortBy !== "none" ? "brightness(0) invert(1)" : "" }}
                />
              </button>
              {openFilter === "sort" && (
                <div className="absolute left-0 top-full z-20 mt-1 min-w-40 rounded-xl border border-stroke bg-card shadow-lg py-1">
                  {[
                    { value: "none", label: "No sort" },
                    { value: "name-asc", label: "Name: A → Z" },
                    { value: "name-desc", label: "Name: Z → A" },
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
            <div className="flex items-center gap-1 rounded-2xl border border-stroke bg-card px-2 py-1">
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
                  Tables
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
                  Cards
                </span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading categories..." containerClassName="py-20" className="h-8 w-8" />
        ) : paginated.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="font-['Montserrat'] text-sm text-gray-text">
              No retail categories found.
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((c) => (
              <div
                key={c.id}
                className="relative flex flex-col overflow-hidden rounded-lg border border-stroke bg-card"
              >
                <div className="relative mx-2 mt-2 h-48 overflow-hidden rounded-lg bg-background">
                  {c.image ? (
                    <img
                      className="h-full w-full object-cover"
                      src={c.image}
                      alt=""
                    />
                  ) : (
                    <div className="h-full w-full bg-background flex items-center justify-center text-gray-text">No Image</div>
                  )}
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <p className="truncate font-['Montserrat'] text-base font-semibold text-foreground">
                    {c.name}
                  </p>
                  {c.appearOnHome && (
                    <p className="font-['Montserrat'] text-xs text-primary mb-2">
                      Appears on Home
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-stroke">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(c)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-card transition hover:bg-background"
                      >
                        <img className="h-4 w-4" src={asset("mynaui_edit.svg")} alt="" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(c.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-card transition hover:bg-background hover:text-error"
                      >
                        <img className="h-4 w-4" src={asset("material-symbols_delete-outline.svg")} alt="" />
                      </button>
                    </div>
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
                    Image
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    Home
                  </th>
                  <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c, idx) => (
                  <tr
                    key={c.id}
                    className={idx % 2 === 0 ? "bg-card" : "bg-background"}
                  >
                    <td className="px-4 py-3 text-center">
                      {c.image ? (
                        <img
                          className="mx-auto h-8 w-8 rounded-lg object-cover"
                          src={c.image}
                          alt=""
                        />
                      ) : (
                        <div className="mx-auto h-8 w-8 rounded-lg bg-background" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-['Montserrat'] text-sm font-medium text-foreground">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-center font-['Montserrat'] text-sm font-medium text-foreground">
                      {c.appearOnHome ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(c)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke bg-card transition hover:bg-background"
                        >
                          <img className="h-4 w-4" src={asset("mynaui_edit.svg")} alt="" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(c.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke bg-card transition hover:bg-background text-error"
                        >
                          <img className="h-4 w-4" src={asset("material-symbols_delete-outline.svg")} alt="" />
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
              className="flex items-center gap-1.5 rounded-lg border border-stroke bg-card px-4 py-2.5 font-['Inter'] text-sm font-medium text-foreground transition hover:bg-background"
            >
              {itemsPerPage} per page
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
                    className={`w-full px-3 py-2 text-left font-['Inter'] text-sm font-medium transition hover:bg-background ${
                      itemsPerPage === size ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {size} per page
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
              <span className="text-gray-text">of {filtered.length}</span>
            </span>
            <span className="mx-1 h-5 border-l border-stroke" />
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-5 w-5 items-center justify-center disabled:opacity-40"
            >
              <img className="h-3 w-2" src={asset("weui_arrow-filled.svg")} alt="" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-5 w-5 rotate-180 items-center justify-center disabled:opacity-40"
            >
              <img className="h-3 w-2" src={asset("weui_arrow-filled.svg")} alt="Next" />
            </button>
          </div>
        </div>
      </section>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 space-y-4 shadow-xl border border-stroke">
            <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
              Delete Category
            </h3>
            <p className="font-['Montserrat'] text-sm text-gray-text">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-stroke py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground bg-card hover:bg-background transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(deleteId);
                  setDeleteId(null);
                }}
                className="flex-1 rounded-xl bg-error py-2.5 font-['Montserrat'] text-sm font-bold text-white transition hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Page Component ---
export default function TraderRetailCategoriesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCategory, setEditCategory] = useState<RetailCategory | null>(null);

  const { data: categoriesResponse, isLoading } = useRetailCategories();
  const categories = categoriesResponse?.data || [];

  const createCategory = useCreateRetailCategory();
  const updateCategory = useUpdateRetailCategory();
  const deleteCategory = useDeleteRetailCategory();

  return (
    <>
      {showAddModal && (
        <RetailCategoryFormModal
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            try {
              await createCategory.mutateAsync(data);
              setShowAddModal(false);
              toast.success("Retail category created successfully");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Failed to create category",
              );
            }
          }}
        />
      )}
      {editCategory && (
        <RetailCategoryFormModal
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSave={async (formData) => {
            try {
              await updateCategory.mutateAsync({
                id: editCategory.id,
                data: formData,
              });
              setEditCategory(null);
              toast.success("Retail category updated successfully");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Failed to update category",
              );
            }
          }}
        />
      )}

      <RetailCategoryTablePanel
        categories={categories}
        loading={isLoading}
        onAdd={() => setShowAddModal(true)}
        onEdit={setEditCategory}
        onDelete={(id) => {
          deleteCategory.mutate(id, {
            onSuccess: () => toast.success("Category deleted"),
            onError: () => toast.error("Failed to delete category")
          });
        }}
      />
    </>
  );
}
