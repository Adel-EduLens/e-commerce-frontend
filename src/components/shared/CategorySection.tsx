import { Link } from 'react-router-dom'

type AssetImageProps = {
  file: string
  className: string
  alt?: string
}

const asset = (file: string) => `/home-page/${encodeURIComponent(file)}`
function AssetImage({ file, className, alt = '' }: AssetImageProps) {
  return (
    <img className={className} src={asset(file)} alt={alt} draggable={false} />
  )
}

function CategoriesSection() {
  const categories = [
    {
      label: 'Men',
      slug: 'men',
      file: 'image 8.png',
      labelLeft: 'left-[96px]',
    },
    {
      label: 'Kids',
      slug: 'kids',
      file: 'image 9.png',
      labelLeft: 'left-[96px]',
    },
    {
      label: 'Women',
      slug: 'women',
      file: 'image 7.png',
      labelLeft: 'left-[62px]',
    },
  ]

  return (
    <div className="mt-16 flex w-full flex-col items-center justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        Explore Our Categories
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Link
            key={category.label}
            to={`/products?category=${category.slug}`}
            className="relative w-full overflow-hidden rounded-2xl bg-white no-underline aspect-[448/547]"
          >
            <AssetImage
              file={category.file}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 sm:px-8 sm:py-3">
              <div className="font-['Montserrat'] text-xl sm:text-2xl lg:text-4xl font-bold text-[#1A1A1A] whitespace-nowrap">
                {category.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoriesSection
