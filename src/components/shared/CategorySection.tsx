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
    <div className="mt-16 inline-flex w-full flex-col items-center justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        Explore Our Categories
      </div>
      <div className="self-stretch inline-flex items-center justify-start gap-6">
        {categories.map((category) => (
          <Link
            key={category.label}
            to={`/wholesale?category=${category.slug}`}
            className="relative h-[547px] w-[448px] overflow-hidden bg-white no-underline"
          >
            <AssetImage
              file={category.file}
              className="absolute left-0 top-0 h-[547px] w-[448px]"
            />
            <div className="absolute left-[88px] top-[471px] h-14 w-72 overflow-hidden bg-white">
              <div
                className={`absolute ${category.labelLeft} top-[7px] font-['Montserrat'] text-4xl font-bold text-[#1A1A1A]`}
              >
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
