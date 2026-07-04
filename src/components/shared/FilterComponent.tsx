import { useState } from 'react'

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
const FILTER_OPTIONS = {
  category: ['T-Shirts', 'Hoodies', 'Jackets', 'Accessories'],
  size: ['XS', 'S', 'M', 'L', 'XL'],
  color: ['Black', 'White', 'Amber', 'Slate'],
  price: ['Under $250', '$250-450', '$450-700', '$700+'],
}

function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex w-96 items-center justify-between rounded-2xl bg-[#EDEDED] p-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search"
        className="w-full bg-transparent font-['Montserrat'] text-xl font-medium text-[#1A1A1A] placeholder:text-[#6B7280] focus:outline-none"
      />
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white">
        <AssetImage
          file="mynaui_search.svg"
          className="absolute left-[8px] top-[8px] h-6 w-6"
        />
      </div>
    </div>
  )
}
function FilterBar() {
  const [category, setCategory] = useState<string | null>(null)
  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState<string | null>(null)
  const [price, setPrice] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4">
      <div className="font-['Montserrat'] text-2xl font-bold text-[#1A1A1A]">
        Filter by
      </div>
      <div className="inline-flex w-full flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-start gap-3">
          <FilterDropdown
            label="Category"
            options={FILTER_OPTIONS.category}
            value={category}
            onChange={setCategory}
          />
          <FilterDropdown
            label="Size"
            options={FILTER_OPTIONS.size}
            value={size}
            onChange={setSize}
            wide
          />
          <FilterDropdown
            label="Color"
            options={FILTER_OPTIONS.color}
            value={color}
            onChange={setColor}
            wide
          />
          <FilterDropdown
            label="Price"
            options={FILTER_OPTIONS.price}
            value={price}
            onChange={setPrice}
            wide
          />
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>
    </div>
  )
}
function FilterDropdown({
  label,
  options,
  value,
  onChange,
  wide,
}: {
  label: string
  options: string[]
  value: string | null
  onChange: (value: string | null) => void
  wide?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${wide ? 'w-44' : ''} flex items-center ${wide ? 'justify-between' : 'justify-center gap-2'} rounded-2xl bg-[#EDEDED] p-4`}
      >
        <div className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
          {value ?? label}
        </div>
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
          <div
            className={`absolute inset-0 flex items-center justify-center transition-transform ${open ? 'rotate-[270deg]' : 'rotate-360'}`}
          >
            <AssetImage file="weui_arrow-filled-1.svg" className="h-3 w-6" />
          </div>
        </div>
      </button>

      {open && (
        <>
          {/* Click-away layer */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex min-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
            {value !== null && (
              <button
                type="button"
                onClick={() => {
                  onChange(null)
                  setOpen(false)
                }}
                className="whitespace-nowrap px-4 py-3 text-left font-['Montserrat'] text-lg font-medium text-[#6B7280] hover:bg-[#EDEDED]"
              >
                Clear
              </button>
            )}
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
                className={`whitespace-nowrap px-4 py-3 text-left font-['Montserrat'] text-lg font-medium hover:bg-[#EDEDED] ${
                  value === option ? 'text-[#1A1A1A]' : 'text-[#6B7280]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
const FilterComponent = () => {
  return <FilterBar />
}

export default FilterComponent
