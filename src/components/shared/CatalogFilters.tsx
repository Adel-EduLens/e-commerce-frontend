const asset = (file: string) => `/home-page/${encodeURIComponent(file)}`

type AssetImageProps = {
  file: string
  className: string
  alt?: string
}

function AssetImage({ file, className, alt = '' }: AssetImageProps) {
  return (
    <img className={className} src={asset(file)} alt={alt} draggable={false} />
  )
}

function DownCircle() {
  return (
    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
      <AssetImage
        file="weui_arrow-filled-1.svg"
        className="absolute left-[4px] top-[10px] h-3 w-6"
      />
    </div>
  )
}

function FilterButton({
  label,
  wide = false,
}: {
  label: string
  wide?: boolean
}) {
  return (
    <div
      className={`${wide ? 'w-44 justify-between' : 'justify-center gap-2'} flex items-center rounded-2xl bg-[#EDEDED] p-4`}
    >
      <div className="font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
        {label}
      </div>
      <DownCircle />
    </div>
  )
}

type CatalogFiltersProps = {
  className?: string
}

export default function CatalogFilters({
  className = '',
}: CatalogFiltersProps) {
  return (
    <div
      className={`inline-flex w-full flex-col items-start justify-start gap-3 ${className}`}
    >
      <div className="self-stretch font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
        Filter by
      </div>
      <div className="self-stretch inline-flex items-center justify-between">
        <div className="flex items-center justify-start gap-4">
          <FilterButton label="Sort by" />
          <FilterButton label="Filter by" wide />
        </div>
        <div className="flex w-96 items-center justify-between rounded-2xl bg-[#EDEDED] p-4">
          <div className="font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
            Search
          </div>
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
            <AssetImage
              file="mynaui_search.svg"
              className="absolute left-[8px] top-[8px] h-6 w-6"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
