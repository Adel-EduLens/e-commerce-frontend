import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../../../components/shared";
import {
  Globe,
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  Truck,
  X,
  MapPin,
  DollarSign,
  List,
  Grid,
} from "lucide-react";
import {
  useShippingCountries,
  useCreateShippingCountry,
  useUpdateShippingCountry,
  useDeleteShippingCountry,
  useShippingCities,
  useCreateShippingCity,
  useUpdateShippingCity,
  useDeleteShippingCity,
  type ShippingCountry,
  type ShippingCity,
  type CreateShippingCountryData,
  type UpdateShippingCountryData,
  type CreateShippingCityData,
  type UpdateShippingCityData,
} from "../../../hooks/queries/shippingQuery";

type ViewMode = "grouped" | "all-cities";

export default function TraderShippingSettings() {
  const { t } = useTranslation("traderShipping");

  // Query Hooks
  const { data: countries = [], isLoading: isLoadingCountries } = useShippingCountries();
  const { data: cities = [], isLoading: isLoadingCities } = useShippingCities();

  // Mutation Hooks
  const createCountryMutation = useCreateShippingCountry();
  const updateCountryMutation = useUpdateShippingCountry();
  const deleteCountryMutation = useDeleteShippingCountry();

  const createCityMutation = useCreateShippingCity();
  const updateCityMutation = useUpdateShippingCity();
  const deleteCityMutation = useDeleteShippingCity();

  // View & Filter State
  const [viewMode, setViewMode] = useState<ViewMode>("grouped");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>("all");

  // Country Modal State
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<ShippingCountry | null>(null);
  const [countryFormData, setCountryFormData] = useState<CreateShippingCountryData>({
    name: "",
    code: "",
  });

  // City Modal State
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<ShippingCity | null>(null);
  const [cityFormData, setCityFormData] = useState<{
    name: string;
    shippingCost: number;
    countryId: string;
  }>({
    name: "",
    shippingCost: 0,
    countryId: "",
  });

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "country" | "city";
    id: string;
    name: string;
  } | null>(null);

  // Helper to resolve parent country for a city
  const getCountryForCity = (city: ShippingCity): ShippingCountry | undefined => {
    return city.country || countries.find((c) => c.id === city.countryId);
  };

  // Filtered Countries
  const filteredCountries = countries.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cities.some(
        (city) =>
          city.countryId === c.id &&
          city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter =
      selectedCountryFilter === "all" || c.id === selectedCountryFilter;
    return matchesSearch && matchesFilter;
  });

  // Filtered Cities for "All Cities" view
  const filteredCities = cities.filter((city) => {
    const parentCountry = getCountryForCity(city);
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (parentCountry &&
        parentCountry.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      selectedCountryFilter === "all" || city.countryId === selectedCountryFilter;
    return matchesSearch && matchesFilter;
  });

  // Handlers
  const handleOpenCountryModal = (country?: ShippingCountry) => {
    if (country) {
      setEditingCountry(country);
      setCountryFormData({ name: country.name, code: country.code || "" });
    } else {
      setEditingCountry(null);
      setCountryFormData({ name: "", code: "" });
    }
    setIsCountryModalOpen(true);
  };

  const handleOpenCityModal = (city?: ShippingCity, defaultCountryId?: string) => {
    if (city) {
      setEditingCity(city);
      setCityFormData({
        name: city.name,
        shippingCost: city.shippingCost,
        countryId: city.countryId,
      });
    } else {
      setEditingCity(null);
      setCityFormData({
        name: "",
        shippingCost: 0,
        countryId: defaultCountryId || (countries.length > 0 ? countries[0].id : ""),
      });
    }
    setIsCityModalOpen(true);
  };

  const handleSubmitCountry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!countryFormData.name.trim()) return;

    if (editingCountry) {
      const updatePayload: UpdateShippingCountryData = {
        name: countryFormData.name.trim(),
        code: countryFormData.code?.trim() || undefined,
      };
      await updateCountryMutation.mutateAsync({
        id: editingCountry.id,
        data: updatePayload,
      });
    } else {
      await createCountryMutation.mutateAsync({
        name: countryFormData.name.trim(),
        code: countryFormData.code?.trim() || undefined,
      });
    }
    setIsCountryModalOpen(false);
  };

  const handleSubmitCity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cityFormData.name.trim() || !cityFormData.countryId) return;

    if (editingCity) {
      const updatePayload: UpdateShippingCityData = {
        name: cityFormData.name.trim(),
        shippingCost: Number(cityFormData.shippingCost),
        countryId: cityFormData.countryId,
      };
      await updateCityMutation.mutateAsync({
        id: editingCity.id,
        data: updatePayload,
      });
    } else {
      const createPayload: CreateShippingCityData = {
        name: cityFormData.name.trim(),
        shippingCost: Number(cityFormData.shippingCost),
        countryId: cityFormData.countryId,
      };
      await createCityMutation.mutateAsync(createPayload);
    }
    setIsCityModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "country") {
      await deleteCountryMutation.mutateAsync(deleteTarget.id);
    } else {
      await deleteCityMutation.mutateAsync(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const isLoading = isLoadingCountries || isLoadingCities;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-stroke bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-tint text-primary">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-['Montserrat'] text-xl font-bold text-foreground">
              {t("title")}
            </h2>
            <p className="text-sm text-gray-text">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleOpenCountryModal()}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-pressed shadow-sm"
          >
            <Globe className="h-4 w-4" />
            {t("addCountry")}
          </button>
          <button
            type="button"
            onClick={() => handleOpenCityModal()}
            disabled={countries.length === 0}
            className="flex items-center gap-2 rounded-xl border border-stroke bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background disabled:opacity-50"
          >
            <Building2 className="h-4 w-4 text-primary" />
            {t("addCity")}
          </button>
        </div>
      </div>

      {/* Control Bar: View Switcher & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: View Mode Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-stroke bg-card p-1">
          <button
            type="button"
            onClick={() => setViewMode("grouped")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              viewMode === "grouped"
                ? "bg-primary text-white"
                : "text-gray-text hover:text-foreground"
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            {t("byCountry")} ({countries.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode("all-cities")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              viewMode === "all-cities"
                ? "bg-primary text-white"
                : "text-gray-text hover:text-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            {t("allCities")} ({cities.length})
          </button>
        </div>

        {/* Right: Search & Country Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-text" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-stroke bg-card py-2 pl-9 pr-8 text-xs text-foreground outline-none transition placeholder:text-gray-text focus:border-primary"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-text hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {countries.length > 0 && (
            <select
              value={selectedCountryFilter}
              onChange={(e) => setSelectedCountryFilter(e.target.value)}
              className="rounded-xl border border-stroke bg-card py-2 px-3 text-xs text-foreground outline-none transition focus:border-primary"
            >
              <option value="all">{t("allCountriesOption")} ({countries.length})</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.code ? `(${c.code})` : ""}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="rounded-2xl border border-stroke bg-card py-16">
          <LoadingSpinner text={t("loading")} size="lg" />
        </div>
      ) : viewMode === "grouped" ? (
        /* MODE 1: GROUPED BY COUNTRY WITH ALL CITIES DISPLAYED DIRECTLY */
        filteredCountries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-stroke bg-card p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-tint text-primary mb-3">
              <Globe className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">{t("noCountriesFound")}</h3>
            <p className="mt-1 text-xs text-gray-text max-w-sm">
              {searchTerm
                ? t("noCountriesMatch", { search: searchTerm })
                : t("getStartedCountry")}
            </p>
            {!searchTerm && (
              <button
                type="button"
                onClick={() => handleOpenCountryModal()}
                className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-pressed"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("addFirstCountry")}
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCountries.map((country) => {
              const countryCities = cities.filter((city) => city.countryId === country.id);

              return (
                <div
                  key={country.id}
                  className="rounded-2xl border border-stroke bg-card shadow-sm transition overflow-hidden"
                >
                  {/* Country Header Bar */}
                  <div className="flex flex-col gap-3 border-b border-stroke bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-tint font-bold text-primary">
                        {country.code ? country.code.slice(0, 2).toUpperCase() : <Globe className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-['Montserrat'] text-base font-bold text-foreground">
                            {country.name}
                          </h4>
                          {country.code && (
                            <span className="rounded-md bg-card px-2 py-0.5 font-mono text-xs font-semibold text-gray-text border border-stroke">
                              {country.code}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-text mt-0.5">
                          {countryCities.length}{" "}
                          {countryCities.length === 1 ? t("cityConfigured") : t("citiesConfigured")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenCityModal(undefined, country.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {t("addCityToCountry", { name: country.name })}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenCountryModal(country)}
                        className="rounded-lg p-2 text-gray-text hover:bg-card hover:text-foreground transition"
                        title={t("editCountry")}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            type: "country",
                            id: country.id,
                            name: country.name,
                          })
                        }
                        className="rounded-lg p-2 text-urgent hover:bg-urgent/10 transition"
                        title={t("deleteCountry")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Cities Section - ALWAYS VISIBLE */}
                  <div className="p-4 bg-card">
                    {countryCities.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-stroke p-6 text-center">
                        <Building2 className="mx-auto h-6 w-6 text-gray-text mb-2 opacity-60" />
                        <p className="text-xs font-medium text-gray-text">
                          {t("noCitiesInCountry", { name: country.name })}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenCityModal(undefined, country.id)}
                          className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          {t("addFirstCity")}
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {countryCities.map((city) => (
                          <div
                            key={city.id}
                            className="flex items-center justify-between rounded-xl border border-stroke bg-background p-3.5 transition hover:border-primary/40 shadow-2xs"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary shrink-0" />
                                <span className="font-semibold text-sm text-foreground truncate">
                                  {city.name}
                                </span>
                              </div>
                              <div className="mt-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-primary-tint px-2 py-0.5 text-xs font-bold text-primary">
                                  <DollarSign className="h-3 w-3" />
                                  {city.shippingCost} {t("egp")}
                                </span>
                                <span className="text-[11px] text-gray-text">
                                  ({country.name})
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              <button
                                type="button"
                                onClick={() => handleOpenCityModal(city)}
                                className="rounded-md p-1.5 text-gray-text hover:bg-card hover:text-foreground transition"
                                title={t("editCity")}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "city",
                                    id: city.id,
                                    name: city.name,
                                  })
                                }
                                className="rounded-md p-1.5 text-urgent hover:bg-urgent/10 transition"
                                title={t("deleteCity")}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* MODE 2: ALL CITIES DIRECT LIST/GRID VIEW SHOWING WHICH COUNTRY THEY BELONG TO */
        filteredCities.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-stroke bg-card p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-tint text-primary mb-3">
              <Building2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">{t("noCitiesFound")}</h3>
            <p className="mt-1 text-xs text-gray-text max-w-sm">
              {searchTerm
                ? t("noCitiesMatch", { search: searchTerm })
                : t("getStartedCity")}
            </p>
            {countries.length > 0 && (
              <button
                type="button"
                onClick={() => handleOpenCityModal()}
                className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-pressed"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("addCity")}
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCities.map((city) => {
              const parentCountry = getCountryForCity(city);

              return (
                <div
                  key={city.id}
                  className="flex flex-col justify-between rounded-2xl border border-stroke bg-card p-4 shadow-sm transition hover:border-primary/40"
                >
                  <div>
                    {/* Parent Country Badge */}
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-stroke bg-background px-2.5 py-1 text-xs font-semibold text-foreground">
                        <Globe className="h-3.5 w-3.5 text-primary" />
                        {parentCountry ? parentCountry.name : "—"}
                        {parentCountry?.code && (
                          <span className="font-mono text-[10px] text-gray-text">
                            ({parentCountry.code})
                          </span>
                        )}
                      </span>
                    </div>

                    {/* City Name */}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <h4 className="font-['Montserrat'] text-base font-bold text-foreground truncate">
                        {city.name}
                      </h4>
                    </div>
                  </div>

                  {/* Shipping Fee & Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-stroke pt-3">
                    <div>
                      <span className="text-[11px] text-gray-text block">{t("deliveryFee")}</span>
                      <span className="text-sm font-bold text-primary">
                        {city.shippingCost} {t("egp")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenCityModal(city)}
                        className="rounded-lg border border-stroke bg-card p-2 text-gray-text hover:bg-background hover:text-foreground transition"
                        title={t("editCity")}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            type: "city",
                            id: city.id,
                            name: city.name,
                          })
                        }
                        className="rounded-lg border border-stroke bg-card p-2 text-urgent hover:bg-urgent/10 transition"
                        title={t("deleteCity")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Country Modal (Add / Edit) */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-stroke bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stroke">
              <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
                {editingCountry ? t("modal.editCountryTitle") : t("modal.addCountryTitle")}
              </h3>
              <button
                type="button"
                onClick={() => setIsCountryModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-text hover:bg-background hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCountry} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-text mb-1.5">
                  {t("modal.countryNameLabel")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("modal.countryNamePlaceholder")}
                  value={countryFormData.name}
                  onChange={(e) =>
                    setCountryFormData({ ...countryFormData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-stroke bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-text mb-1.5">
                  {t("modal.countryCodeLabel")}
                </label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder={t("modal.countryCodePlaceholder")}
                  value={countryFormData.code || ""}
                  onChange={(e) =>
                    setCountryFormData({
                      ...countryFormData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full rounded-xl border border-stroke bg-card px-4 py-2.5 text-sm font-mono text-foreground outline-none transition focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stroke mt-6">
                <button
                  type="button"
                  onClick={() => setIsCountryModalOpen(false)}
                  className="rounded-xl border border-stroke bg-card px-4 py-2 text-sm font-semibold text-gray-text transition hover:bg-background hover:text-foreground"
                >
                  {t("modal.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={
                    createCountryMutation.isPending || updateCountryMutation.isPending
                  }
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-pressed disabled:opacity-50"
                >
                  {editingCountry ? t("modal.saveChanges") : t("modal.addCountry")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* City Modal (Add / Edit) */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-stroke bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stroke">
              <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
                {editingCity ? t("modal.editCityTitle") : t("modal.addCityTitle")}
              </h3>
              <button
                type="button"
                onClick={() => setIsCityModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-text hover:bg-background hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCity} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-text mb-1.5">
                  {t("modal.selectCountryLabel")}
                </label>
                <select
                  required
                  value={cityFormData.countryId}
                  onChange={(e) =>
                    setCityFormData({ ...cityFormData, countryId: e.target.value })
                  }
                  className="w-full rounded-xl border border-stroke bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                >
                  <option value="" disabled>
                    {t("modal.selectCountryPlaceholder")}
                  </option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.code ? `(${c.code})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-text mb-1.5">
                  {t("modal.cityNameLabel")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("modal.cityNamePlaceholder")}
                  value={cityFormData.name}
                  onChange={(e) =>
                    setCityFormData({ ...cityFormData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-stroke bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-text mb-1.5">
                  {t("modal.shippingCostLabel")}
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  required
                  placeholder="0"
                  value={cityFormData.shippingCost}
                  onChange={(e) =>
                    setCityFormData({
                      ...cityFormData,
                      shippingCost: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-xl border border-stroke bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stroke mt-6">
                <button
                  type="button"
                  onClick={() => setIsCityModalOpen(false)}
                  className="rounded-xl border border-stroke bg-card px-4 py-2 text-sm font-semibold text-gray-text transition hover:bg-background hover:text-foreground"
                >
                  {t("modal.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={createCityMutation.isPending || updateCityMutation.isPending}
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-pressed disabled:opacity-50"
                >
                  {editingCity ? t("modal.saveChanges") : t("modal.addCity")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-stroke bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-urgent/10 text-urgent mb-4">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="font-['Montserrat'] text-base font-bold text-foreground">
              {deleteTarget.type === "country"
                ? t("modal.deleteCountryTitle")
                : t("modal.deleteCityTitle")}
            </h3>

            <p className="mt-1.5 text-sm text-gray-text">
              {t("modal.deleteConfirmText", { name: deleteTarget.name })}{" "}
              {deleteTarget.type === "country" && t("modal.deleteCountryWarning")}
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-stroke bg-card px-4 py-2 text-sm font-semibold text-gray-text transition hover:bg-background hover:text-foreground"
              >
                {t("modal.cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={
                  deleteCountryMutation.isPending || deleteCityMutation.isPending
                }
                className="rounded-xl bg-urgent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {t("modal.confirmDelete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
