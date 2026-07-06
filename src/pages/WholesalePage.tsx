import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { ProductCard } from '../components/shared'
import CategoriesSection from '../components/shared/CategorySection'
import FaqSection from '../components/shared/FaqSection'
import CatalogFilters, { type DropdownFilterValues } from '../components/shared/CatalogFilters'
import { useWholesales, type Wholesale } from '../hooks/queries/wholesaleQuery'

const asset = (file: string) => `/home-page/${encodeURIComponent(file)}`

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
  return (
    <div className="relative mx-6 h-96 overflow-hidden rounded-3xl bg-[#C4B5FD]">
      <div className="absolute left-[352px] top-[93px] w-[565px] font-['Montserrat'] text-5xl font-semibold text-[#1A1A1A]">
        From Factory to You – Big Quantities, Bigger Profits.
      </div>
      <img
        className="absolute left-[-188px] top-0 h-96 w-[543px]"
        src="/image.png"
        alt=""
      />
      <HeroOutlineFan />
    </div>
  )
}

function ViewAllButton({ to }: { to: string }) {
  return (
    <Link to={to} className="inline-flex items-center justify-start gap-2 rounded-2xl bg-[#BBFF63] p-4 no-underline">
      <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
        View All
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

function ProductSection({ title, products, isLoading, viewAllLink }: { title: string; products: Wholesale[]; isLoading: boolean; viewAllLink?: string }) {
  const [filters, setFilters] = useState<DropdownFilterValues>({ category: null, size: null, color: null, price: null, brand: null, search: '' })

  const allSizes = useMemo(() => [...new Set(products.flatMap((p) => p.sizes.map((s) => s.size)))], [products])
  const allColors = useMemo(() => [...new Set(products.flatMap((p) => p.colors.map((c) => c.color)))], [products])
  const allCategories = useMemo(() => [...new Set(products.map((p) => p.category.name))], [products])

  const filterOptions = {
    category: allCategories,
    size: allSizes,
    color: allColors,
    price: ['Under $10', '$10-20', '$20-30', '$30+'],
  }

  const handleFilter = useCallback((f: DropdownFilterValues) => setFilters(f), [])

  const filtered = useMemo(() => {
    return products.filter((item) => {
      if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.category && item.category.name !== filters.category) return false
      if (filters.size && !item.sizes.some((s) => s.size === filters.size)) return false
      if (filters.color && !item.colors.some((c) => c.color === filters.color)) return false
      if (filters.price) {
        const p = item.price
        if (filters.price === 'Under $10' && p >= 10) return false
        if (filters.price === '$10-20' && (p < 10 || p > 20)) return false
        if (filters.price === '$20-30' && (p < 20 || p > 30)) return false
        if (filters.price === '$30+' && p < 30) return false
      }
      return true
    })
  }, [products, filters])

  return (
    <div className="mx-6 mt-24 flex flex-col items-start justify-start gap-10">
      <div className="self-stretch font-['Montserrat'] text-8xl font-bold text-foreground">
        {title}
      </div>
      <div className="flex w-full flex-col items-center justify-start gap-8">
        <div className="flex w-full flex-col items-start justify-start gap-6">
          <CatalogFilters onDropdownFilterChange={handleFilter} dropdownFilters={filterOptions} />
          {isLoading ? (
            <p className="font-['Montserrat'] text-lg text-[#6B7280]">Loading...</p>
          ) : (
            <div className="grid grid-cols-4 items-start justify-start gap-6">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <ProductCard
                    key={item.id}
                    title={item.name}
                    price={`$${item.price}`}
                    imageSrc={item.images[0]?.url}
                    rating={item.rating}
                    sizeLabel={item.sizes.map((s) => s.size).join(', ')}
                    to={`/wholesale/${item.id}`}
                  />
                ))
              ) : (
                <p className="col-span-4 text-center font-['Montserrat'] text-lg text-[#6B7280]">
                  No wholesale products available yet.
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

export default function WholesalePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated } = useAuthStore()

  const categoryFilter = searchParams.get('category')
  const filterParam = searchParams.get('filter')
  const categoryName = categoryFilter
    ? categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1).toLowerCase()
    : null

  const filterMap: Record<string, { label: string; filters: Parameters<typeof useWholesales>[0] }> = {
    'best-deals': { label: 'Best Deals', filters: { isBestDeal: true } },
    'most-popular': { label: 'Most Popular', filters: { isMostPopular: true } },
    'premium-collections': { label: 'Premium Collections', filters: { isPremiumCollection: true } },
  }
  const activeFilter = filterParam ? filterMap[filterParam] : null

  const { data: filteredProducts = [], isLoading: filteredLoading } = useWholesales(
    categoryName ? { category: categoryName } : activeFilter ? activeFilter.filters : undefined
  )
  const { data: bestDeals = [], isLoading: bestDealsLoading } = useWholesales({ isBestDeal: true })
  const { data: mostPopular = [], isLoading: popularLoading } = useWholesales({ isMostPopular: true })
  const { data: premium = [], isLoading: premiumLoading } = useWholesales({ isPremiumCollection: true })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [categoryFilter, filterParam])

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login')
    }
  }, [isAuthenticated, user, navigate])

  if (!isAuthenticated || !user) {
    return null
  }

  if (categoryName || activeFilter) {
    return (
      <div className="w-full pt-8 overflow-hidden">
        <HeroBanner />
        <ProductSection
          title={categoryName || activeFilter!.label}
          products={filteredProducts}
          isLoading={filteredLoading}
        />
        <FaqSection />
      </div>
    )
  }

  return (
    <div className="w-full pt-8 overflow-hidden">
      <HeroBanner />
      <ProductSection title="Best Deals" products={bestDeals} isLoading={bestDealsLoading} viewAllLink="/wholesale?filter=best-deals" />
      <CategoriesSection />
      <ProductSection title="Most Popular" products={mostPopular} isLoading={popularLoading} viewAllLink="/wholesale?filter=most-popular" />
      <ProductSection title="Premium Collections" products={premium} isLoading={premiumLoading} viewAllLink="/wholesale?filter=premium-collections" />
      <FaqSection />
    </div>
  )
}
