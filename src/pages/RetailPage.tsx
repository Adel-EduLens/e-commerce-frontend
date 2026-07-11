import { useEffect, useMemo, useState } from 'react'
import RetailProductCard from '../components/retail/RetailProductCard'
import useRetailProducts from '../hooks/useRetailProducts'
import useRetailCategories from '../hooks/useRetailCategories'
import { useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import CatalogFilters from '../components/shared/CatalogFilters'

function normalizeProductsResponse(response: any) {
  if (!response) return []

  if (Array.isArray(response)) return response
  if (Array.isArray(response.products)) return response.products
  if (Array.isArray(response.retailProducts)) return response.retailProducts
  if (Array.isArray(response.items)) return response.items
  if (Array.isArray(response.result)) return response.result

  if (Array.isArray(response.data)) return response.data
  if (Array.isArray(response.data?.products)) return response.data.products
  if (Array.isArray(response.data?.retailProducts)) return response.data.retailProducts
  if (Array.isArray(response.data?.items)) return response.data.items
  if (Array.isArray(response.data?.result)) return response.data.result

  if (Array.isArray(response.data?.data)) return response.data.data
  if (Array.isArray(response.data?.data?.products)) return response.data.data.products
  if (Array.isArray(response.data?.data?.retailProducts)) return response.data.data.retailProducts
  if (Array.isArray(response.data?.data?.items)) return response.data.data.items

  return []
}

function normalizeCategoriesResponse(response: any) {
  if (!response) return []

  if (Array.isArray(response)) return response
  if (Array.isArray(response.categories)) return response.categories
  if (Array.isArray(response.retailCategories)) return response.retailCategories
  if (Array.isArray(response.items)) return response.items
  if (Array.isArray(response.result)) return response.result

  if (Array.isArray(response.data)) return response.data
  if (Array.isArray(response.data?.categories)) return response.data.categories
  if (Array.isArray(response.data?.retailCategories)) return response.data.retailCategories
  if (Array.isArray(response.data?.items)) return response.data.items
  if (Array.isArray(response.data?.result)) return response.data.result

  if (Array.isArray(response.data?.data)) return response.data.data
  if (Array.isArray(response.data?.data?.categories)) return response.data.data.categories
  if (Array.isArray(response.data?.data?.retailCategories)) return response.data.data.retailCategories

  return []
}

export default function RetailPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [categoryId, setCategoryId] = useState<string | null>(searchParams.get('categoryId'))
  const [sort, setSort] = useState<string>(searchParams.get('sort') ?? 'latest')

  useEffect(() => {
    const query: Record<string, string> = {}
    if (search) query.search = search
    if (categoryId) query.categoryId = categoryId
    if (sort) query.sort = sort
    setSearchParams(query)
  }, [search, categoryId, sort, setSearchParams])

  const filters = {
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(sort ? { sort } : {}),
    limit: 24,
  }

  const { data, isLoading, error } = useRetailProducts(filters)
  const categoriesQuery = useRetailCategories()

  console.log('Retail raw products response:', data)
  const products = useMemo(() => normalizeProductsResponse(data), [data])
  console.log('Retail normalized products:', products)

  console.log('Retail raw categories response:', categoriesQuery.data)
  const categories = useMemo(() => normalizeCategoriesResponse(categoriesQuery.data), [categoriesQuery.data])
  console.log('Retail normalized categories:', categories)

  const filterConfigs = useMemo(() => [
    { key: 'category', label: 'Category', options: (categories || []).map((c: any) => c.name) },
    { key: 'sort', label: 'Sort', options: ['latest', 'price_asc', 'price_desc'] },
  ], [categories])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 text-slate-900">
      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-[#F8FFF0] via-white to-[#F7F8FA] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-[#BBFF63] bg-[#BBFF63]/20 px-3 py-1 text-sm font-medium text-slate-700">
              Retail collection
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Discover retail essentials in one polished catalog.
            </h1>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              Browse curated products, refine by category or keyword, and find the right item fast.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
            <div className="font-semibold text-slate-900">{products.length} products</div>
            <div>Updated in real time</div>
          </div>
        </div>
      </section>

      <CatalogFilters
        filters={filterConfigs}
        initialValues={{
          search: search,
          category: categoryId ? categories.find((c: any) => String(c.id) === String(categoryId))?.name || null : null,
          sort: sort || 'latest',
          priceMin: null,
          priceMax: null,
        }}
        onFilterChange={(v) => {
          setSearch(v.search)
          const catName = v.category
          if (catName) {
            const matched = categories.find((c: any) => c.name === catName)
            if (matched) setCategoryId(String(matched.id))
          } else {
            setCategoryId('')
          }
          if (v.sort) setSort(v.sort)
        }}
      />

      <section className="flex flex-col gap-4">
        <aside className="w-full rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Quick filters</h3>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategoryId('')
                setSort('latest')
              }}
              className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              Clear
            </button>
          </div>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Active search</div>
              <div className="mt-1">{search || 'All products'}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="font-medium text-slate-900">Current category</div>
              <div className="mt-1">{categoryId ? categories.find((item: any) => String(item.id) === String(categoryId))?.name || 'Selected' : 'All categories'}</div>
            </div>
          </div>
        </aside>

        <main className="w-full rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:p-6">
          {isLoading ? (
            <div className="flex items-center gap-2 rounded-[24px] border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading products...
            </div>
          ) : error ? (
            <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-red-600 shadow-sm">
              Failed to load products: {(error as any)?.message ?? 'Unknown error'}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
              No products found. Check console normalized response.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product: any) => (
                <div key={product.id ?? product.slug ?? product.name} className="animate-[fadeIn_0.35s_ease-out]">
                  <RetailProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>
      </section>
    </div>
  )
}
