import { useState } from "react";
import { Check, PencilLine, Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../../../components/shared";
import {
  useBrands,
  useCreateBrand,
  useDeleteBrand,
  useUpdateBrand,
} from "../../../hooks/queries/brandsQuery";

const normalizeName = (name: string) => name.trim();

export default function TraderBrandsPage() {
  const { t } = useTranslation(["traderInventoryShared", "traderShopPage"]);
  const { data: brands = [], isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [newBrandName, setNewBrandName] = useState("");
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleCreateBrand = async () => {
    const name = normalizeName(newBrandName);
    if (!name) return;

    await createBrand.mutateAsync({ name });
    setNewBrandName("");
  };

  const handleStartEditing = (brandId: string, brandName: string) => {
    setEditingBrandId(brandId);
    setEditingName(brandName);
  };

  const handleCancelEditing = () => {
    setEditingBrandId(null);
    setEditingName("");
  };

  const handleSaveBrand = async (brandId: string) => {
    const name = normalizeName(editingName);
    if (!name) return;

    await updateBrand.mutateAsync({
      id: brandId,
      data: { name },
    });
    handleCancelEditing();
  };

  const handleDeleteBrand = async (brandId: string, brandName: string) => {
    const confirmed = window.confirm(
      t("traderInventoryShared:deleteBrandConfirm", {
        name: brandName,
        defaultValue: `Are you sure you want to delete "${brandName}"?`,
      }),
    );
    if (!confirmed) return;

    await deleteBrand.mutateAsync(brandId);
    if (editingBrandId === brandId) {
      handleCancelEditing();
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-stroke bg-card p-5 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
        <div className="space-y-1">
          <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">
            {t("traderShopPage:brands")}
          </h2>
          <p className="font-['Montserrat'] text-sm text-gray-text">
            {t("traderShopPage:manageBrandsDescription")}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            value={newBrandName}
            onChange={(event) => setNewBrandName(event.target.value)}
            placeholder={t("traderInventoryShared:brandNamePlaceholder", "Brand name")}
            className="min-w-0 flex-1 rounded-xl border border-stroke bg-white px-4 py-3 font-['Montserrat'] text-sm text-foreground outline-none transition focus:border-primary"
          />
          <button
            type="button"
            onClick={() => void handleCreateBrand()}
            disabled={createBrand.isPending || !normalizeName(newBrandName)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-['Montserrat'] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} />
            {t("traderInventoryShared:addBrand", "Add Brand")}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-stroke bg-card shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
        <div className="border-b border-stroke px-5 py-4">
          <h3 className="font-['Montserrat'] text-base font-semibold text-foreground">
            {t("traderShopPage:brands")}
          </h3>
        </div>

        {isLoading ? (
          <LoadingSpinner
            text={t("traderShopPage:loadingBrands")}
            containerClassName="py-16"
            className="h-8 w-8"
          />
        ) : brands.length === 0 ? (
          <div className="px-5 py-12 text-center font-['Montserrat'] text-sm text-gray-text">
            {t("traderInventoryShared:noBrandsFound", "No brands yet")}
          </div>
        ) : (
          <div className="divide-y divide-stroke">
            {brands.map((brand) => {
              const isEditing = editingBrandId === brand.id;

              return (
                <div
                  key={brand.id}
                  className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        className="w-full rounded-xl border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm text-foreground outline-none transition focus:border-primary"
                      />
                    ) : (
                      <div className="font-['Montserrat'] text-sm font-medium text-foreground">
                        {brand.name}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void handleSaveBrand(brand.id)}
                          disabled={
                            updateBrand.isPending || !normalizeName(editingName)
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stroke text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                          title={t("traderInventoryShared:saveBrand", "Save brand")}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEditing}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stroke text-foreground transition hover:border-primary hover:text-primary"
                          title={t("traderInventoryShared:cancelBrandEdit", "Cancel")}
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            handleStartEditing(brand.id, brand.name)
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stroke text-foreground transition hover:border-primary hover:text-primary"
                          title={t("traderInventoryShared:editBrand", "Edit brand")}
                        >
                          <PencilLine size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void handleDeleteBrand(brand.id, brand.name)
                          }
                          disabled={deleteBrand.isPending}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stroke text-danger transition hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
                          title={t("traderInventoryShared:deleteBrand", "Delete brand")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
