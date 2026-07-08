

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { Link } from 'react-router-dom'


import CategoriesSection from '../components/shared/CategorySection'
import FaqSection from '../components/shared/FaqSection'

import { api } from '../lib/axios'
import { toast } from 'sonner'
import { asset } from '../lib/utils';


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

function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-primary">
      {/* Mobile/Tablet layout */}
      <div className="relative z-10 flex flex-col px-6 py-10 lg:hidden">
        <div className="font-['Montserrat'] text-5xl sm:text-7xl font-bold text-foreground">
          Discover
        </div>
        <div className="relative my-2">
          <div className="h-12 sm:h-16 w-3/4 rounded-2xl bg-secondary" />
          <div className="absolute left-2 -top-2 font-['Montserrat'] text-5xl sm:text-7xl font-bold text-white">
            fashion
          </div>
        </div>
        <div className="font-['Montserrat'] text-3xl sm:text-5xl font-bold text-foreground">
          Fits Your Story
        </div>
        <div className="mt-6 rounded-xl bg-background p-4">
          <p className="font-['Inter'] text-base sm:text-lg font-medium text-foreground">
            step into the spotlight with our latest drop. each piece is made to
            turn heads while keeping you comfortable from day to night.
          </p>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="relative hidden lg:block h-[978px]">
        <div className="absolute left-[625px] top-[162px] h-[480px] w-[480px] rounded-full border-2 border-secondary" />
        <div className="absolute left-[30px] top-[367.19px] h-32 w-[504.79px] origin-top-left rotate-[-7.42deg] rounded-3xl bg-secondary" />
        <div className="absolute left-[24px] top-[121px] inline-flex w-[649px] flex-col items-start justify-start">
          <div className="self-stretch font-['Montserrat'] text-9xl font-bold text-foreground">
            Discover
          </div>
          <div className="relative h-56 w-[517.21px]">
            <div className="absolute left-0 top-[84.19px] h-32 w-[504px] origin-top-left rotate-[-7.42deg] rounded-3xl bg-secondary" />
            <div className="absolute left-[8px] top-0 font-['Montserrat'] text-9xl font-bold text-white">
              fashion
            </div>
          </div>
          <div className="self-stretch font-['Montserrat'] text-7xl font-bold text-foreground">
            Fits Your Story
          </div>
        </div>
        <div className="absolute left-[24px] top-[649px] h-72 w-[597px]">
          <div className="absolute left-0 top-[28px] h-64 w-[597px] overflow-hidden bg-background rounded-3xl border border-stroke shadow-sm">
            <div className="absolute left-[24px] top-[50px] h-36 w-80 font-['Montserrat'] text-2xl font-medium text-foreground">
              step into the spotlight with our latest drop. each piece is made to
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
        <div className="absolute left-[1001px] top-[772px] h-40 w-96 overflow-hidden bg-background">
          <div className="absolute left-[24px] top-[24px] h-28 w-80 font-['Montserrat'] text-2xl font-medium text-foreground">
            Unlock fresh styles, exclusive drops, and a whole new vibe that&apos;s
            set to dominate 2025
            <br />
            <br />
          </div>
        </div>
        <div className="absolute left-[579px] top-[513px] h-0 w-[554.16px] origin-top-left rotate-[-47.41deg] border-t-2 border-secondary" />
      </div>
    </div>
  )
}

function CollectionSection() {
  return (
    <div className="mt-10 sm:mt-16 flex flex-col lg:flex-row gap-2.5 w-full">
      <Link
        to="/collections/men"
        className="relative block h-[400px] sm:h-[500px] lg:h-[770px] lg:flex-1 overflow-hidden rounded-3xl no-underline"
      >
        <AssetImage
          file="image 2.png"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute left-6 sm:left-8 top-6 sm:top-8 inline-flex w-64 sm:w-80 flex-col items-start justify-start gap-5 sm:gap-7">
          <div className="flex flex-col items-start justify-start gap-3 sm:gap-5">
            <div className="font-['Inter'] text-4xl sm:text-6xl lg:text-8xl font-normal leading-tight text-white">
              Color of
              <br />
              Summer
              <br />
              Outfit
            </div>
            <div className="font-['Inter'] text-sm sm:text-lg font-normal leading-6 text-white opacity-80">
              100+ Collections for your outfit inspirations in this summer
            </div>
          </div>
          <div className="inline-flex h-10 sm:h-12 w-56 sm:w-72 items-center justify-center rounded-[200px] bg-secondary outline outline-1 outline-offset-[-1px]">
            <div className="text-center font-['Inter'] text-xs sm:text-sm font-medium leading-6 tracking-wide text-white">
              VIEW COLLECTIONS
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-row lg:flex-col gap-2.5 lg:w-[352px]">
        <Link
          to="/collections/men"
          className="relative block h-48 sm:h-64 lg:h-[380px] flex-1 lg:flex-initial overflow-hidden rounded-2xl lg:rounded-[40px] bg-gray-light no-underline"
        >
          <AssetImage
            file="image 4.png"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute left-4 sm:left-[30px] top-4 sm:top-[30px] font-['Inter'] text-2xl sm:text-4xl font-normal leading-tight text-foreground">
            Outdoor
            <br />
            Active
          </div>
        </Link>
        <Link
          to="/collections/men"
          className="relative block h-48 sm:h-64 lg:h-[380px] flex-1 lg:flex-initial overflow-hidden rounded-2xl lg:rounded-[40px] bg-gray-light no-underline"
        >
          <AssetImage
            file="image 5.png"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute left-4 sm:left-[30px] top-4 sm:top-[30px] font-['Inter'] text-2xl sm:text-4xl font-normal leading-tight text-foreground">
            Casual
            <br />
            Comfort
          </div>
        </Link>
      </div>
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

type VoteDesign = {
  id: string
  title: string
  imagePath: string
  votes?: number
}

import { useDesigns } from '../hooks/queries/designsQuery';
import { handleApiError } from '../lib/utils';
import ProductsSection from '../components/shared/ProductsSection'

function VoteSection() {
  const queryClient = useQueryClient()
  const { data: designs = [] } = useDesigns();
  const [currentIndex, setCurrentIndex] = useState(0)
  const [voting, setVoting] = useState(false)

  const current = designs[currentIndex]

  function goToPrevious() {
    setCurrentIndex((i) => {
      if (designs.length === 0) return i
      return (i - 1 + designs.length) % designs.length
    })
  }

  function goToNext() {
    setCurrentIndex((i) => {
      if (designs.length === 0) return i
      return (i + 1) % designs.length
    })
  }

  async function handleVote() {
    if (!current || voting) return
    setVoting(true)
    try {
      const res = await api.put(`/upload/vote/${current.id}`)
      if (res.status === 200) {
        toast.success('Your vote has been counted!')
        queryClient.setQueryData(['designs'], (prev: VoteDesign[] | undefined) =>
          prev?.map((design) =>
            design.id === current.id
              ? { ...design, votes: (design.votes ?? 0) + 1 }
              : design
          )
        )
      }
    } catch (error) {
      handleApiError(error, 'Failed to submit vote');
    } finally {
      setVoting(false)
    }
  }

  return (
    <div className="mt-10 sm:mt-16 w-full">
      <div className="w-full font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        Vote for next design
      </div>

      {/* Mobile/Tablet layout */}
      <div className="mt-8 flex flex-col gap-6 lg:hidden">
        {current ? (
          <img
            src={current.imagePath}
            alt={current.title}
            className="w-full h-64 sm:h-96 rounded-3xl object-cover"
          />
        ) : (
          <AssetImage
            file="image 11.png"
            className="w-full h-64 sm:h-96 rounded-3xl object-cover"
          />
        )}
        <div className="rounded-3xl bg-primary p-6 flex flex-col gap-4">
          {!current ? (
            <div className="font-['Montserrat'] text-xl font-medium text-foreground">
              No designs to vote on yet.
            </div>
          ) : (
            <>
              <div className="font-['Montserrat'] text-2xl sm:text-3xl font-semibold text-foreground break-words">
                {current.title?.trim() || 'Untitled design'}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-['Montserrat'] text-xl font-semibold text-foreground">Votes</div>
                  <div className="font-['Montserrat'] text-xl font-normal text-foreground">{(current.votes ?? 0).toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  onClick={handleVote}
                  disabled={voting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 disabled:opacity-60"
                >
                  {voting ? (
                    <span className="h-6 w-6 animate-spin rounded-full border-4 border-secondary/20 border-t-[#1A1A1A]" />
                  ) : (
                    <div className="font-['Montserrat'] text-xl font-medium text-foreground flex gap-1">
                      <AssetImage file="lucide_vote.svg" className="h-6 w-6" />
                      Vote
                    </div>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Previous design"
                  className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:opacity-95 transition"
                >
                  <AssetImage file="weui_arrow-filled-2.svg" className="h-6 w-3" />
                </button>
                <div className="flex items-center gap-1">
                  {designs.map((design, index) => (
                    <button
                      key={design.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition cursor-pointer ${index === currentIndex ? 'bg-secondary' : 'bg-white hover:bg-white/80'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next design"
                  className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:opacity-95 transition"
                >
                  <AssetImage file="weui_arrow-filled.svg" className="h-6 w-3" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block relative h-[1242px] mt-8">
        <div className="absolute left-0 top-[266px] h-[772px] w-full overflow-hidden rounded-3xl bg-primary">
          <VoteRings />
          {!current ? (
            <div className="absolute left-[714px] top-[330px] w-[539px] font-['Montserrat'] text-3xl font-medium text-foreground">
              No designs to vote on yet.
            </div>
          ) : (
            <>
              <div className="absolute left-[714px] top-[196px] w-[539px] break-words font-['Montserrat'] text-5xl font-semibold text-foreground">
                {current.title?.trim() || 'Untitled design'}
              </div>
              <div className="absolute left-[714px] top-[350px] inline-flex flex-col items-start justify-start gap-4">
                <div className="self-stretch font-['Montserrat'] text-4xl font-semibold text-foreground">
                  Votes
                </div>
                <div className="self-stretch font-['Montserrat'] text-4xl font-normal text-foreground">
                  {(current.votes ?? 0).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={handleVote}
                disabled={voting}
                className="absolute left-[1222px] top-[669px] inline-flex items-center justify-center gap-2 rounded-3xl bg-white p-4 disabled:opacity-60"
              >
                {voting ? (
                  <span className="h-8 w-8 animate-spin rounded-full border-4 border-secondary/20 border-t-[#1A1A1A]" />
                ) : (
                  <div className="font-['Montserrat'] text-3xl font-medium text-foreground flex gap-1">
                    <AssetImage file="lucide_vote.svg" className="h-8 w-8" />
                    Vote
                  </div>
                )}
              </button>
            </>
          )}
          {current && (
            <div className="absolute left-[604px] top-[672px] z-10 h-16 w-52 rounded-2xl bg-white flex items-center justify-center shadow-md">
              <div className="flex items-center justify-start gap-4">
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Previous design"
                  className="relative z-10 h-12 w-12 overflow-hidden rounded-full bg-secondary cursor-pointer hover:opacity-95 transition"
                >
                  <AssetImage
                    file="weui_arrow-filled-2.svg"
                    className="pointer-events-none absolute left-[16px] top-[8px] h-8 w-4"
                  />
                </button>
                <div className="flex items-center justify-start gap-1">
                  {designs.map((design, index) => (
                    <button
                      key={design.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition cursor-pointer ${
                        index === currentIndex ? 'bg-secondary' : 'bg-stroke hover:bg-[#D0D5DD]'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next design"
                  className="relative z-10 h-12 w-12 overflow-hidden rounded-full bg-secondary cursor-pointer hover:opacity-95 transition"
                >
                  <AssetImage
                    file="weui_arrow-filled.svg"
                    className="pointer-events-none absolute left-[16px] top-[8px] h-8 w-4"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
        {current ? (
          <img
            src={current.imagePath}
            alt={current.title}
            className="absolute left-[4px] top-[157px] h-[1085px] w-[665px] rounded-3xl object-cover"
          />
        ) : (
          <AssetImage
            file="image 11.png"
            className="absolute left-[4px] top-[157px] h-[1085px] w-[665px]"
          />
        )}
      </div>
    </div>
  )
}


export function HomePage() {


  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <CollectionSection />
      <ProductsSection
        title="This Season's Must-Haves"
        navigateTo="/products?filter=must-have"
        query={{
          filter: "must-have",
        }}
      />
      <CategoriesSection />
      <ProductsSection
        title="Recommended for You"
        navigateTo="/products"
        query={{
          sortBy: "rating",
          sortOrder: "desc",
        }}
      />
      <VoteSection />
      <ProductsSection
        title="Flash Deals"
        navigateTo="/products?filter=flash-deals"
        query={{
          filter: "flash-deals",
        }}
      />
      <FaqSection />
    </div>
  )
}

export default HomePage
