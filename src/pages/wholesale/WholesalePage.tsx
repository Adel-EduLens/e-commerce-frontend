import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ProductCard, FilterCategory } from '../../components/shared'
import CategoriesSection from '../../components/shared/CategorySection'
import FaqSection from '../../components/shared/FaqSection'
import CatalogFilters, { type FilterValues } from '../../components/shared/CatalogFilters'
import { useProducts, type ProductsQuery } from '../../hooks/queries/productsQuery'
import { asset } from '../../lib/utils';

function getEffectivePrice(item: {
  price?: number
  wholesalePrice?: number
  shopPrice?: number
  retailPrice?: number
  blankPrice?: number
}) {
  return item.wholesalePrice ?? item.price ?? item.shopPrice ?? item.retailPrice ?? item.blankPrice ?? 0
}

function AssetImage({
  file,
  className,
  alt = '',
}: {
  file: string
  className: string
  alt?: string
}) {
  return (
    <img className={className} src={asset(file)} alt={alt} draggable={false} />
  )
}

function HeroOutlineFan() {
  const outlineRects = [
    {
      w: 'w-[1245.27px]',
      h: 'h-[1016.09px]',
      l: 'left-[956.49px]',
      t: 'top-[-31.55px]',
    },
    {
      w: 'w-[1202.33px]',
      h: 'h-[981.05px]',
      l: 'left-[977.96px]',
      t: 'top-[-14.03px]',
    },
    {
      w: 'w-[1159.39px]',
      h: 'h-[946.02px]',
      l: 'left-[999.43px]',
      t: 'top-[3.49px]',
    },
    {
      w: 'w-[1116.45px]',
      h: 'h-[910.98px]',
      l: 'left-[1020.90px]',
      t: 'top-[21px]',
    },
    {
      w: 'w-[1073.51px]',
      h: 'h-[875.94px]',
      l: 'left-[1042.37px]',
      t: 'top-[38.52px]',
    },
    {
      w: 'w-[1030.57px]',
      h: 'h-[840.90px]',
      l: 'left-[1063.84px]',
      t: 'top-[56.04px]',
    },
    {
      w: 'w-[987.63px]',
      h: 'h-[805.87px]',
      l: 'left-[1085.31px]',
      t: 'top-[73.56px]',
    },
    {
      w: 'w-[944.69px]',
      h: 'h-[770.83px]',
      l: 'left-[1106.78px]',
      t: 'top-[91.08px]',
    },
    {
      w: 'w-[901.75px]',
      h: 'h-[735.79px]',
      l: 'left-[1128.25px]',
      t: 'top-[108.60px]',
    },
    {
      w: 'w-[858.81px]',
      h: 'h-[700.75px]',
      l: 'left-[1149.72px]',
      t: 'top-[126.12px]',
    },
    {
      w: 'w-[815.87px]',
      h: 'h-[665.71px]',
      l: 'left-[1171.19px]',
      t: 'top-[143.64px]',
    },
    {
      w: 'w-[772.93px]',
      h: 'h-[630.68px]',
      l: 'left-[1192.66px]',
      t: 'top-[161.16px]',
    },
    {
      w: 'w-[729.99px]',
      h: 'h-[595.64px]',
      l: 'left-[1214.13px]',
      t: 'top-[178.68px]',
    },
    {
      w: 'w-[687.05px]',
      h: 'h-[560.60px]',
      l: 'left-[1235.60px]',
      t: 'top-[196.20px]',
    },
    {
      w: 'w-[644.11px]',
      h: 'h-[525.56px]',
      l: 'left-[1257.07px]',
      t: 'top-[213.71px]',
    },
    {
      w: 'w-[601.16px]',
      h: 'h-[490.53px]',
      l: 'left-[1278.54px]',
      t: 'top-[231.23px]',
    },
    {
      w: 'w-[558.22px]',
      h: 'h-[455.49px]',
      l: 'left-[1300.01px]',
      t: 'top-[248.75px]',
    },
    {
      w: 'w-[515.28px]',
      h: 'h-96',
      l: 'left-[1321.48px]',
      t: 'top-[266.27px]',
    },
    {
      w: 'w-[472.34px]',
      h: 'h-96',
      l: 'left-[1342.95px]',
      t: 'top-[283.79px]',
    },
    { w: 'w-96', h: 'h-80', l: 'left-[1364.42px]', t: 'top-[301.30px]' },
    { w: 'w-96', h: 'h-80', l: 'left-[1385.89px]', t: 'top-[318.82px]' },
    { w: 'w-80', h: 'h-72', l: 'left-[1407.36px]', t: 'top-[336.34px]' },
    { w: 'w-72', h: 'h-60', l: 'left-[1428.84px]', t: 'top-[353.86px]' },
    { w: 'w-64', h: 'h-52', l: 'left-[1450.31px]', t: 'top-[371.38px]' },
    { w: 'w-52', h: 'h-44', l: 'left-[1471.78px]', t: 'top-[388.90px]' },
    { w: 'w-44', h: 'h-36', l: 'left-[1493.25px]', t: 'top-[406.42px]' },
    { w: 'w-32', h: 'h-28', l: 'left-[1514.72px]', t: 'top-[423.94px]' },
    { w: 'w-20', h: 'h-16', l: 'left-[1536.19px]', t: 'top-[441.46px]' },
    { w: 'w-11', h: 'h-9', l: 'left-[1557.66px]', t: 'top-[458.98px]' },
  ]

  return (
    <>
      {outlineRects.map((r, i) => (
        <div
          key={i}
          className={`${r.w} ${r.h} ${r.l} ${r.t} absolute rounded-full outline outline-2 outline-offset-[-1px] outline-slate-400/50`}
        />
      ))}
    </>
  )
}

function HeroBanner() {
  const { t } = useTranslation("productSection")
  return (
    <div className="relative mx-4 sm:mx-6 overflow-hidden rounded-3xl bg-[#C4B5FD]">
      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 lg:py-16 lg:px-[352px] lg:min-h-[384px]">
        <div className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-5xl font-semibold text-foreground max-w-lg">
          {t("wholesaleBannerTitle", "From Factory to You – Big Quantities, Bigger Profits.")}
        </div>
      </div>
      <img
        className="hidden lg:block absolute left-[-188px] top-0 h-96 w-[543px]"
        src="/image.png"
        alt=""
      />
      <div className="hidden lg:block">
        <HeroOutlineFan />
      </div>
    </div>
  )
}

function ViewAllButton({ to }: { to: string }) {
  const { t } = useTranslation("productSection")
  return (
    <Link to={to} className="inline-flex items-center justify-start gap-2 rounded-2xl bg-primary p-4 no-underline">
      <div className="font-['Montserrat'] text-xl font-semibold text-foreground">
        {t("viewAll", "View All")}
      </div>
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
        <AssetImage
          file="weui_arrow-filled-3.svg"
          className="absolute left-[14px] top-[8px] h-6 w-3"
        />
      </div>
    </Link>
  )
}

function ProductSection({ title, baseFilters, viewAllLink }: { title: string; baseFilters?: ProductsQuery; viewAllLink?: string }) {
  const { t } = useTranslation("productSection")
  const initialCategory = baseFilters?.category ?? null

  const [filterState, setFilterState] = useState<FilterValues>({
    search: '',
    priceMin: null,
    priceMax: null,
    category: initialCategory,
  })

  // Tracks whether the user has manually changed a filter (vs. the initial URL-driven value)
  const [userModified, setUserModified] = useState(false)

  // Reset local filter state whenever the base filters change (e.g. navigating to a new category)
  useEffect(() => {
    setFilterState({
      search: '',
      priceMin: null,
      priceMax: null,
      category: baseFilters?.category ?? null,
    })
    setUserModified(false)
  }, [baseFilters?.category, baseFilters?.isBestDeal, baseFilters?.isMostPopular, baseFilters?.isPremiumCollection])

  const queryFilters = useMemo(() => ({
    ...baseFilters,
    search: filterState.search || undefined,
    // If the user has explicitly interacted with the filter, respect their choice (even if null = all).
    // Otherwise fall back to the URL category so initial load is pre-filtered.
    category: userModified
      ? (filterState.category || undefined)
      : (baseFilters?.category || undefined),
  }), [baseFilters, filterState, userModified])

  const { data: resData, isLoading } = useProducts({ ...queryFilters, type: "WHOLESALE" })
  const products = resData?.products || []

  const allCategories = useMemo(
    () => [...new Set(products.map((p) => p.category?.name).filter((name): name is string => Boolean(name)))],
    [products],
  )
  const allBrands = useMemo(
    () => [...new Set(products.map((p) => p.brand?.name).filter((name): name is string => Boolean(name)))],
    [products],
  )
  const filterConfigs = useMemo(() => [
    { key: 'category', label: t('Category', 'Category'), options: allCategories },
    { key: 'brand', label: t('Brand', 'Brand'), options: allBrands },
  ], [allCategories, allBrands, t])

  const handleFilter = useCallback((f: FilterValues) => {
    setFilterState(f)
    setUserModified(true)
  }, [])

  // Client-side filtering for search and price; category is already handled server-side
  const filtered = useMemo(() => {
    return products.filter((item) => {
      const itemPrice = getEffectivePrice(item)
      if (filterState.search && !item.name.toLowerCase().includes(filterState.search.toLowerCase())) return false
      if (filterState.priceMin !== null && itemPrice < Number(filterState.priceMin)) return false
      if (filterState.priceMax !== null && itemPrice > Number(filterState.priceMax)) return false
      return true
    })
  }, [products, filterState])

  return (
    <div className="mx-4 sm:mx-6 mt-24 flex flex-col items-start justify-start gap-10">
      <div className="self-stretch font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        {t(title, title)}
      </div>
      <div className="flex w-full flex-col items-center justify-start gap-8">
        <div className="flex w-full flex-col items-start justify-start gap-6">
          <CatalogFilters
            filters={filterConfigs}
            initialValues={{ category: initialCategory }}
            onFilterChange={handleFilter}
          />
          {isLoading ? (
            <p className="font-['Montserrat'] text-lg text-gray-text">{t("Loading", "Loading...")}</p>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <ProductCard
                    key={item.id}
                    productId={item.id}
                    productType="WHOLESALE"
                    title={item.name}
                    subtitle={item.description || undefined}
                    price={`${item.wholesalePrice ?? item.shopPrice ?? item.retailPrice ?? item.blankPrice ?? item.price ?? 0} EGP`}
                    imageSrc={item.images[0]?.url}
                    images={item.images}
                    rating={item.rating}
                    to={`/wholesale/${item.id}`}
                    brand={item.brand?.name}
                    category={item.category?.name}
                    colors={item.colors?.map(wc => wc.colorName || wc.color || "") || []}
                    wholesaleSizes={Array.from(new Set(item.colors?.flatMap(wc => wc.variants.map(s => s.size)) || []))}
                    sizeLabel={Array.from(new Set(item.colors?.flatMap(wc => wc.variants.map(s => s.size)) || [])).slice(0, 4).join("-") || "All Sizes"}
                    minOrder={item.minOrder}
                    wholesaleCard
                    stock={item.stock}
                  />
                ))
              ) : (
                <p className="col-span-4 text-center font-['Montserrat'] text-lg text-gray-text">
                  {t("noWholesaleProductsAvailable", "No wholesale products available yet.")}
                </p>
              )}
            </div>
          )}
        </div>
        {filtered.length > 0 && viewAllLink && <ViewAllButton to={viewAllLink} />}
      </div>
    </div>
  )
}

function WholesaleFilterSection({
  baseFilters,
}: {
  baseFilters?: ProductsQuery
}) {
  const { t } = useTranslation("productSection")
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    category: baseFilters?.category ?? null,
    brand: null,
    size: null,
    color: null,
    priceMin: null,
    priceMax: null,
  })

  useEffect(() => {
    setFilters({
      search: '',
      category: baseFilters?.category ?? null,
      brand: null,
      size: null,
      color: null,
      priceMin: null,
      priceMax: null,
    })
  }, [
    baseFilters?.category,
    baseFilters?.isBestDeal,
    baseFilters?.isMostPopular,
    baseFilters?.isPremiumCollection,
  ])

  const queryParams = useMemo(() => {
    const q: ProductsQuery = {}
    if (filters.category) {
      q.category = filters.category
    }
    if (baseFilters?.isBestDeal) q.isBestDeal = true
    if (baseFilters?.isMostPopular) q.isMostPopular = true
    if (baseFilters?.isPremiumCollection) q.isPremiumCollection = true
    return q
  }, [filters.category, baseFilters])

  const { data: resData, isLoading } = useProducts({ ...queryParams, type: "WHOLESALE" })
  const products = resData?.products || []

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const itemPrice = getEffectivePrice(item)
      if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.priceMin !== null && itemPrice < Number(filters.priceMin)) return false
      if (filters.priceMax !== null && itemPrice > Number(filters.priceMax)) return false
      if (filters.brand && item.brand?.name?.toLowerCase() !== filters.brand.toLowerCase()) return false
      if (filters.color && !item.colors?.some(wc => (wc.colorName || wc.color || "").toLowerCase() === filters.color?.toLowerCase())) return false
      if (filters.size && !item.colors?.some(wc => wc.variants?.some(s => s.size.toLowerCase() === filters.size?.toLowerCase()))) return false
      return true
    })
  }, [products, filters])

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>()
    products.forEach((item) => {
      item.colors?.forEach((wc) => {
        wc.variants?.forEach((s) => {
          if (s.size) sizes.add(s.size)
        })
      })
    })
    return Array.from(sizes)
  }, [products])

  const combinedProducts = useMemo(() => {
    return filteredProducts.map((item) => (
      <ProductCard
        key={item.id}
        productId={item.id}
        productType="WHOLESALE"
        title={item.name}
        subtitle={item.description || undefined}
        price={`${item.wholesalePrice ?? item.shopPrice ?? item.retailPrice ?? item.blankPrice ?? item.price ?? 0} EGP`}
        imageSrc={item.images[0]?.url}
        images={item.images}
        rating={item.rating}
        to={`/wholesale/${item.id}`}
        brand={item.brand?.name}
        category={item.category?.name}
        colors={item.colors?.map((wc) => wc.colorName || wc.color || "") || []}
        wholesaleSizes={Array.from(new Set(item.colors?.flatMap((wc) => wc.variants.map((s) => s.size)) || []))}
        sizeLabel={Array.from(new Set(item.colors?.flatMap((wc) => wc.variants.map((s) => s.size)) || [])).slice(0, 4).join("-") || "All Sizes"}
        minOrder={item.minOrder}
        wholesaleCard
        stock={item.stock}
      />
    ))
  }, [filteredProducts])

  return (
    <FilterCategory
      initialValues={filters}
      onFilterChange={setFilters}
      isAnyLoading={isLoading}
      combinedProducts={combinedProducts}
      availableSizes={availableSizes.length > 0 ? availableSizes : undefined}
      isWholesale={true}
      noProductsText={t("noWholesaleProductsAvailable", "No wholesale products available yet.")}
      loadingText={t("Loading", "Loading...")}
    />
  )
}

export default function WholesalePage() {
  const { t } = useTranslation("productSection")
  const [searchParams] = useSearchParams()

  const categoryFilter = searchParams.get('category')
  const filterParam = searchParams.get('filter')
  const categoryName = categoryFilter

  const filterMap: Record<string, { label: string; filters: ProductsQuery }> = {
    'best-deals': { label: 'Best Deals', filters: { isBestDeal: true } },
    'most-popular': { label: 'Most Popular', filters: { isMostPopular: true } },
    'premium-collections': { label: 'Premium Collections', filters: { isPremiumCollection: true } },
  }
  const activeFilter = filterParam ? filterMap[filterParam] : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [categoryFilter, filterParam])

  if (categoryName || activeFilter) {
    return (
      <div className="w-full pt-8 overflow-hidden">
        <HeroBanner />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
          <h1 className="font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
            {categoryName ? t(categoryName, categoryName) : activeFilter ? t(activeFilter.label, activeFilter.label) : ""}
          </h1>
        </div>
        <WholesaleFilterSection
          baseFilters={categoryName ? { category: categoryName } : activeFilter ? activeFilter.filters : undefined}
        />
        <FaqSection />
      </div>
    )
  }

  return (
    <div className="w-full pt-8 overflow-hidden">
      <HeroBanner />
      <ProductSection title="Best Deals" baseFilters={{ isBestDeal: true }} viewAllLink="/wholesale?filter=best-deals" />
      <CategoriesSection isWholesale={true} />
      <ProductSection title="Most Popular" baseFilters={{ isMostPopular: true }} viewAllLink="/wholesale?filter=most-popular" />
      <ProductSection title="Premium Collections" baseFilters={{ isPremiumCollection: true }} viewAllLink="/wholesale?filter=premium-collections" />
      <FaqSection />
    </div>
  )
}
