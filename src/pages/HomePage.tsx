import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { ProductCard } from '../components/shared'
import CategoriesSection from '../components/shared/CategorySection'
import FaqSection from '../components/shared/FaqSection'
import FilterComponent from '../components/shared/FilterComponent'

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

function FilterButton({
  label,
  compact = false,
}: {
  label: string
  compact?: boolean
}) {
  return (
    <div
      className={`${compact ? 'justify-center gap-2' : 'w-44 justify-between'} flex items-center rounded-2xl bg-[#EDEDED] p-4`}
    >
      <div className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
        {label}
      </div>
      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
        <AssetImage
          file="weui_arrow-filled-1.svg"
          className="absolute left-[4px] top-[10px] h-3 w-6"
        />
      </div>
    </div>
  )
}

function ViewAllButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-start gap-2 rounded-2xl bg-[#BBFF63] p-4"
    >
      <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
        View All
      </div>
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
        <AssetImage
          file="weui_arrow-filled-3.svg"
          className="absolute left-[14px] top-[8px] h-6 w-3"
        />
      </div>
    </button>
  )
}

function ProductGrid({ featuredIndex }: { featuredIndex?: number }) {
  return (
    <div className="w-full flex flex-col items-center justify-start gap-8">
      <FilterComponent />
      <div className="self-stretch inline-flex items-center justify-start gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCard
            key={index}
            featured={featuredIndex === index}
            accentClassName="bg-violet-300"
          />
        ))}
      </div>
      <ViewAllButton />
    </div>
  )
}

function HeroSection() {
  return (
    <div className="relative h-[978px] w-full rounded-3xl bg-[#BBFF63]">
      <div className="absolute left-[625px] top-[162px] h-[480px] w-[480px] rounded-full border-2 border-[#1A1A1A]" />
      <div className="absolute left-[30px] top-[367.19px] h-32 w-[504.79px] origin-top-left rotate-[-7.42deg] rounded-3xl bg-[#1A1A1A]" />
      <div className="absolute left-[24px] top-[121px] inline-flex w-[649px] flex-col items-start justify-start">
        <div className="self-stretch font-['Montserrat'] text-9xl font-bold text-[#1A1A1A]">
          Discover
        </div>
        <div className="relative h-56 w-[517.21px]">
          <div className="absolute left-0 top-[84.19px] h-32 w-[504px] origin-top-left rotate-[-7.42deg] rounded-3xl bg-[#1A1A1A]" />
          <div className="absolute left-[8px] top-0 font-['Montserrat'] text-9xl font-bold text-white">
            fashion
          </div>
        </div>
        <div className="self-stretch font-['Montserrat'] text-7xl font-bold text-[#1A1A1A]">
          Fits Your Story
        </div>
      </div>
      <div className="absolute left-[24px] top-[649px] h-72 w-[597px]">
        <div className="absolute left-0 top-0 h-64 w-[597px] overflow-hidden bg-[#F9FAFB] opacity-75">
          <div className="absolute left-[24px] top-[50px] h-36 w-80 font-['Inter'] text-2xl font-medium text-[#1A1A1A]">
            step into the spotilght with our latest drop. each piece is made to
            turn heads while keeping you comfortable from day to night.
            <br />
          </div>
          <div className="absolute left-[354px] top-[11px] h-60 w-56 overflow-hidden rounded-2xl">
            <AssetImage
              file="medium-shot-man-posing-with-blue-background 1_2.png"
              className="absolute left-[1px] top-0 h-60 w-[222px]"
            />
          </div>
        </div>
        <div className="absolute left-0 top-[28px] h-64 w-[597px] overflow-hidden bg-[#F9FAFB]">
          <div className="absolute left-[24px] top-[50px] h-36 w-80 font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
            step into the spotilght with our latest drop. each piece is made to
            turn heads while keeping you comfortable from day to night.
            <br />
          </div>
          <div className="absolute left-[354px] top-[11px] h-60 w-56 overflow-hidden rounded-2xl">
            <AssetImage
              file="medium-shot-man-posing-with-blue-background 1.png"
              className="absolute left-[1px] top-0 h-60 w-[222px]"
            />
          </div>
        </div>
      </div>
      <div className="absolute left-[675px] top-[7px] h-[971px] w-[788px] overflow-hidden">
        <AssetImage
          file="image 1.png"
          className="absolute left-0 top-0 h-[971px] w-[741px]"
        />
      </div>
      <div className="absolute left-[1001px] top-[772px] h-40 w-96 overflow-hidden bg-[#F9FAFB]">
        <div className="absolute left-[24px] top-[24px] h-28 w-80 font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
          Unlock fresh styles, exclusive drops, and a whole new vibe that&apos;s
          set to dominarte 2025
          <br />
          <br />
        </div>
      </div>
      <div className="absolute left-[579px] top-[513px] h-0 w-[554.16px] origin-top-left rotate-[-47.41deg] border-t-2 border-[#1A1A1A]" />
    </div>
  )
}

function CollectionSection() {
  return (
    <div className="mt-16 relative h-[770px] w-full">
      <Link
        to="/collections/men"
        className="absolute left-0 top-0 block h-[770px] w-[1029px] overflow-hidden rounded-3xl no-underline"
      >
        <AssetImage
          file="image 2.png"
          className="absolute left-0 top-0 h-[770px] w-[1029px]"
        />
        <div className="absolute left-[32px] top-[32px] inline-flex w-80 flex-col items-start justify-start gap-7">
          <div className="self-stretch flex flex-col items-start justify-start gap-5">
            <div className="self-stretch font-['Inter'] text-8xl font-normal leading-[75px] text-white">
              Color of
              <br />
              Summer
              <br />
              Outfit
            </div>
            <div className="self-stretch font-['Inter'] text-lg font-normal leading-6 text-white opacity-80">
              100+ Collections for your outfit inspirations in this summer
            </div>
          </div>
          <div className="inline-flex h-12 w-72 items-center justify-center rounded-[200px] bg-[#1A1A1A] outline outline-1 outline-offset-[-1px]">
            <div className="h-6 w-44 text-center font-['Inter'] text-sm font-medium leading-6 tracking-wide text-white">
              VIEW COLLECTIONS
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute left-[1040px] top-0 inline-flex w-[352px] flex-col items-start justify-start gap-2.5">
        <Link
          to="/collections/men"
          className="relative block h-[380px] self-stretch overflow-hidden rounded-[40px] bg-[#EDEDED] no-underline"
        >
          <AssetImage
            file="image 4.png"
            className="absolute left-0 top-0 h-[380px] w-[352px]"
          />
          <div className="absolute left-[30px] top-[30px] font-['Inter'] text-4xl font-normal leading-10 text-[#1A1A1A]">
            Outdoor
            <br />
            Active
          </div>
        </Link>
        <Link
          to="/collections/men"
          className="relative block h-[380px] self-stretch overflow-hidden rounded-[40px] bg-[#EDEDED] no-underline"
        >
          <AssetImage
            file="image 5.png"
            className="absolute left-0 top-0 h-[380px] w-[352px]"
          />
          <div className="absolute left-[30px] top-[30px] font-['Inter'] text-4xl font-normal leading-10 text-[#1A1A1A]">
            Casual
            <br />
            Comfort
          </div>
        </Link>
      </div>
    </div>
  )
}

function MustHavesSection() {
  const navigate = useNavigate()

  return (
    <div className="mt-16 w-full">
      <div className="w-[909px] font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        This Season's Must-Haves
      </div>
      <div className="mt-10 inline-flex w-full flex-col items-center justify-start gap-8">
        <FilterComponent />
        <div className="self-stretch inline-flex items-center justify-start gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCard key={index} />
          ))}
        </div>
        <ViewAllButton onClick={() => navigate('/season-must-haves')} />
      </div>
    </div>
  )
}

function RecommendedSection() {
  return (
    <div className="mt-16 inline-flex w-full flex-col items-center justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        Recommended for You
      </div>
      <ProductGrid />
    </div>
  )
}

function VoteRings() {
  const rings = [
    ['w-[992.90px] h-[992.90px]', 'left-[894px] top-[-479px]'],
    ['w-[958.66px] h-[958.66px]', 'left-[911.12px] top-[-461.88px]'],
    ['w-[924.42px] h-[924.42px]', 'left-[928.24px] top-[-444.76px]'],
    ['w-[890.19px] h-[890.19px]', 'left-[945.36px] top-[-427.64px]'],
    ['w-[855.95px] h-[855.95px]', 'left-[962.48px] top-[-410.52px]'],
    ['w-[821.71px] h-[821.71px]', 'left-[979.59px] top-[-393.41px]'],
    ['w-[787.47px] h-[787.47px]', 'left-[996.71px] top-[-376.29px]'],
    ['w-[753.23px] h-[753.23px]', 'left-[1013.83px] top-[-359.17px]'],
    ['w-[719px] h-[719px]', 'left-[1030.95px] top-[-342.05px]'],
    ['w-[684.76px] h-[684.76px]', 'left-[1048.07px] top-[-324.93px]'],
    ['w-[650.52px] h-[650.52px]', 'left-[1065.19px] top-[-307.81px]'],
    ['w-[616.28px] h-[616.28px]', 'left-[1082.31px] top-[-290.69px]'],
    ['w-[582.04px] h-[582.04px]', 'left-[1099.43px] top-[-273.57px]'],
    ['w-[547.81px] h-[547.81px]', 'left-[1116.55px] top-[-256.45px]'],
    ['w-[513.57px] h-[513.57px]', 'left-[1133.67px] top-[-239.33px]'],
    ['w-[479.33px] h-[479.33px]', 'left-[1150.78px] top-[-222.22px]'],
    ['h-96 w-96', 'left-[1167.90px] top-[-205.10px]'],
    ['h-96 w-96', 'left-[1185.02px] top-[-187.98px]'],
    ['h-96 w-96', 'left-[1202.14px] top-[-170.86px]'],
    ['h-80 w-80', 'left-[1219.26px] top-[-153.74px]'],
    ['h-80 w-80', 'left-[1236.38px] top-[-136.62px]'],
    ['h-72 w-72', 'left-[1253.50px] top-[-119.50px]'],
    ['h-60 w-60', 'left-[1270.62px] top-[-102.38px]'],
    ['h-52 w-52', 'left-[1287.74px] top-[-85.26px]'],
    ['h-44 w-44', 'left-[1304.86px] top-[-68.14px]'],
    ['h-36 w-36', 'left-[1321.97px] top-[-51.03px]'],
    ['h-24 w-24', 'left-[1339.09px] top-[-33.91px]'],
    ['h-16 w-16', 'left-[1356.21px] top-[-16.79px]'],
    ['h-9 w-9', 'left-[1373.33px] top-[0.33px]'],
  ]

  return (
    <>
      {rings.map(([size, position]) => (
        <div
          key={`${size}-${position}`}
          className={`absolute ${position} ${size} rounded-full outline outline-2 outline-offset-[-1px] outline-slate-400/50`}
        />
      ))}
    </>
  )
}

function VoteSection() {
  return (
    <div className="mt-16 relative h-[1242px] w-full">
      <div className="absolute left-0 top-0 w-[646px] font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        Vote for next design
      </div>
      <div className="absolute left-0 top-[266px] h-[772px] w-full overflow-hidden rounded-3xl bg-[#BBFF63]">
        <div className="absolute left-[604px] top-[672px] h-16 w-52 rounded-2xl bg-white">
          <div className="absolute left-[12px] top-[12px] inline-flex items-center justify-start gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#1A1A1A]">
              <AssetImage
                file="weui_arrow-filled-2.svg"
                className="absolute left-[16px] top-[8px] h-8 w-4"
              />
            </div>
            <div className="flex items-center justify-start gap-1">
              <div className="h-2 w-2 rounded-full bg-[#E0E0E0]" />
              <div className="h-2 w-2 rounded-full bg-[#BBFF63]" />
              <div className="h-2 w-2 rounded-full bg-[#E0E0E0]" />
              <div className="h-2 w-2 rounded-full bg-[#E0E0E0]" />
              <div className="h-2 w-2 rounded-full bg-[#E0E0E0]" />
            </div>
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#1A1A1A]">
              <AssetImage
                file="weui_arrow-filled.svg"
                className="absolute left-[16px] top-[8px] h-8 w-4"
              />
            </div>
          </div>
        </div>
        <VoteRings />
        <div className="absolute left-[714px] top-[196px] w-[539px] font-['Montserrat'] text-5xl font-semibold text-[#1A1A1A]">
          Streetwear Oversized Jacket – SS2025
        </div>
        <div className="absolute left-[714px] top-[330px] w-[496px] font-['Montserrat'] text-4xl font-normal text-[#1A1A1A]">
          Willy Bogner
        </div>
        <div className="absolute left-[714px] top-[390px] inline-flex w-24 flex-col items-start justify-start gap-4">
          <div className="self-stretch font-['Montserrat'] text-4xl font-semibold text-[#1A1A1A]">
            Vote
          </div>
          <div className="self-stretch font-['Montserrat'] text-4xl font-normal text-[#1A1A1A]">
            1,200
          </div>
        </div>
        <div className="absolute left-[1222px] top-[669px] inline-flex items-center justify-center gap-2 rounded-3xl bg-white p-4">
          <AssetImage file="lucide_vote.svg" className="h-8 w-8" />
          <div className="font-['Montserrat'] text-3xl font-medium text-[#1A1A1A]">
            Vote
          </div>
        </div>
      </div>
      <AssetImage
        file="image 11.png"
        className="absolute left-[4px] top-[157px] h-[1085px] w-[665px]"
      />
    </div>
  )
}

function FlashDealsSection() {
  return (
    <div className="mt-16 inline-flex w-full flex-col items-start justify-start gap-10">
      <div className="inline-flex items-center justify-center gap-11">
        <div className="font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
          Flash Deals
        </div>
        <div className="flex items-center justify-start gap-6">
          <div className="font-['Montserrat'] text-3xl font-semibold text-[#1A1A1A]">
            Ends in
          </div>
          <div className="flex items-center justify-start gap-2">
            {['08', ':', '30', ':', '48'].map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="font-['Montserrat'] text-3xl font-semibold text-[#1A1A1A]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ProductGrid featuredIndex={2} />
    </div>
  )
}

export function HomePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login')
    }
  }, [isAuthenticated, user, navigate])

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <CollectionSection />
      <MustHavesSection />
      <CategoriesSection />
      <RecommendedSection />
      <VoteSection />
      <FlashDealsSection />
      <FaqSection />
    </div>
  )
}

export default HomePage
