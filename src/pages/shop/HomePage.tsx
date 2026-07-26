import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Link } from 'react-router-dom'


import CategoriesSection from '../../components/shared/CategorySection'
import FaqSection from '../../components/shared/FaqSection'
import HomeBanner from '../../components/product/HomeBanner'

import { api } from '../../lib/axios'
import { toast } from 'sonner'
import { asset } from '../../lib/utils';


import { useCollections } from '../../hooks/queries/collectionsQuery'

type AssetImageProps = {
  file: string

  className: string
  alt?: string
}

function AssetImage({ file, className, alt = '' }: AssetImageProps) {
  return (
    <img className={className} src={file.startsWith('http') || file.startsWith('/uploads') || file.startsWith('/home-page') ? file : asset(file)} alt={alt} draggable={false} />
  )
}



function CollectionCard({ c, big }: { c: any; big?: boolean }) {
  const to = c.id?.startsWith?.('fallback') ? "/products" : `/products?collectionId=${c.id}`;
  if (big) {
    return (
      <Link
        to={to}
        className="relative block h-[400px] sm:h-[500px] lg:h-[770px] lg:flex-1 overflow-hidden rounded-3xl no-underline"
      >
        <AssetImage
          key={c.id + '-' + c.image}
          file={c.image}
          className="absolute inset-0 h-full w-full object-cover animate-swap-fade"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/25 to-transparent pointer-events-none" />
        <div className="absolute left-6 sm:left-8 top-6 sm:top-8 inline-flex w-64 sm:w-80 flex-col items-start justify-start gap-5 sm:gap-7">
          <div className="flex flex-col items-start justify-start gap-3 sm:gap-5">
            <div className="font-['Inter'] text-4xl sm:text-6xl lg:text-8xl font-normal leading-tight text-white">
              {c.name.split(' ').map((word: string, i: number) => (
                <span key={i}>{word}<br /></span>
              ))}
            </div>
            {c.description && (
              <div className="font-['Inter'] text-sm sm:text-lg font-normal leading-6 text-white opacity-80 line-clamp-3">
                {c.description}
              </div>
            )}
          </div>
          <div className="inline-flex h-10 sm:h-12 w-56 sm:w-72 items-center justify-center rounded-[200px] bg-secondary outline outline-1 outline-offset-[-1px]">
            <div className="text-center font-['Inter'] text-xs sm:text-sm font-medium leading-6 tracking-wide text-secondary-foreground">
              VIEW COLLECTIONS
            </div>
          </div>
        </div>
      </Link>
    );
  }
  return (
    <Link
      to={to}
      className="relative block h-48 sm:h-64 lg:h-[380px] flex-1 lg:flex-initial overflow-hidden rounded-2xl lg:rounded-[40px] bg-gray-light no-underline"
    >
      <AssetImage
        key={c.id + '-' + c.image}
        file={c.image}
        className="absolute inset-0 h-full w-full object-cover animate-swap-fade"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/10 to-transparent pointer-events-none" />
      <div className="absolute left-4 sm:left-[30px] top-4 sm:top-[30px] font-['Inter'] text-2xl sm:text-4xl font-normal leading-tight text-white drop-shadow-md">
        {c.name.split(' ').map((word: string, i: number) => (
          <span key={i}>{word}<br /></span>
        ))}
      </div>
    </Link>
  );
}

function CollectionSection() {
  const { data: serverCollections = [], isLoading } = useCollections(true);
  const [rotated, setRotated] = useState<any[]>([]);

  useEffect(() => {
    setRotated(serverCollections);
  }, [serverCollections]);

  // Rotate only when there are 2+ collections
  useEffect(() => {
    if (rotated.length < 2) return;
    const timer = setInterval(() => {
      setRotated(([first, ...rest]) => [...rest, first]);
    }, 4000);
    return () => clearInterval(timer);
  }, [rotated]);

  if (isLoading || rotated.length === 0) return null;

  const [c1, c2, c3] = rotated;

  return (
    <div className="mt-10 sm:mt-16 flex flex-col lg:flex-row gap-2.5 w-full">
      <CollectionCard c={c1} big />
      {(c2 || c3) && (
        <div className="flex flex-row lg:flex-col gap-2.5 lg:w-[352px]">
          {c2 && <CollectionCard c={c2} />}
          {c3 && <CollectionCard c={c3} />}
        </div>
      )}
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
          className={`absolute ${position} ${size} rounded-full outline outline-2 outline-offset-[-1px] outline-primary-foreground/15`}
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

import { useDesigns } from '../../hooks/queries/designsQuery';
import { handleApiError } from '../../lib/utils';
import ProductsSection from '../../components/shared/ProductsSection'

function VoteSection() {
  const queryClient = useQueryClient()
  const { data: designs = [] } = useDesigns();
  const [currentIndex, setCurrentIndex] = useState(0)
  const [voting, setVoting] = useState(false)
  const { t } = useTranslation("vote")

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
    if (!current || voting || current.hasVoted) return
    setVoting(true)
    try {
      const res = await api.put(`/trader/designs/vote/${current.id}`)
      if (res.status === 200) {
        toast.success(t('successMessage', 'Your vote has been counted!'))
        queryClient.setQueryData(['designs'], (prev: VoteDesign[] | undefined) =>
          prev?.map((design) =>
            design.id === current.id
              ? { ...design, votes: (design.votes ?? 0) + 1, hasVoted: true }
              : design
          )
        )
      }
    } catch (error) {
      handleApiError(error, t('errorMessage', 'Failed to submit vote'));
    } finally {
      setVoting(false)
    }
  }

  return (
    <div className="mt-10 sm:mt-16 w-full">
      <div className="w-full font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        {t('title', 'Vote for next design')}
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
            <div className="font-['Montserrat'] text-xl font-medium text-primary-foreground">
              {t('noDesigns', 'No designs to vote on yet.')}
            </div>
          ) : (
            <>
              <div className="font-['Montserrat'] text-2xl sm:text-3xl font-semibold text-primary-foreground break-words">
                {current.title?.trim() || t('untitled', 'Untitled design')}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-['Montserrat'] text-xl font-semibold text-primary-foreground">{t('votes', 'Votes')}</div>
                  <div className="font-['Montserrat'] text-xl font-normal text-primary-foreground">{(current.votes ?? 0).toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  onClick={handleVote}
                  disabled={voting || Boolean(current?.hasVoted)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-card px-6 py-3 font-['Montserrat'] text-xl font-medium text-foreground shadow-sm hover:bg-card/90 transition disabled:opacity-60 cursor-pointer"
                >
                  {voting ? (
                    <span className="h-6 w-6 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground" />
                  ) : current.hasVoted ? (
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {t('votedButton', 'Voted')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="text-foreground">
                        <path d="M12 15.9997L14.6667 18.6663L20 13.333" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M29.3334 25.3332H2.66675M6.66675 9.33317C6.66675 7.8665 7.86675 6.6665 9.33341 6.6665H22.6667C23.374 6.6665 24.0523 6.94746 24.5524 7.44755C25.0525 7.94765 25.3334 8.62593 25.3334 9.33317V25.3332H6.66675V9.33317Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {t('voteButton', 'Vote')}
                    </div>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Previous design"
                  className="h-10 w-10 rounded-full bg-card text-foreground shadow-sm flex items-center justify-center cursor-pointer hover:bg-card/90 transition"
                >
                  <svg width="12" height="24" viewBox="0 0 16 32" fill="none" className="text-foreground">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.45738 15.052L10 7.50931L11.8854 9.39465L5.28538 15.9946L11.8854 22.5946L10 24.48L2.45738 16.9373C2.20742 16.6873 2.06699 16.3482 2.06699 15.9946C2.06699 15.6411 2.20742 15.302 2.45738 15.052Z" fill="currentColor"/>
                  </svg>
                </button>
                <div className="flex items-center gap-1">
                  {designs.map((design, index) => (
                    <button
                      key={design.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition cursor-pointer ${index === currentIndex ? 'bg-primary-foreground' : 'bg-primary-foreground/30 hover:bg-primary-foreground/50'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next design"
                  className="h-10 w-10 rounded-full bg-card text-foreground shadow-sm flex items-center justify-center cursor-pointer hover:bg-card/90 transition"
                >
                  <svg width="12" height="24" viewBox="0 0 16 32" fill="none" className="text-foreground">
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.5426 16.948L5.99996 24.4907L4.11462 22.6054L10.7146 16.0054L4.11462 9.40535L5.99996 7.52002L13.5426 15.0627C13.7926 15.3127 13.933 15.6518 13.933 16.0054C13.933 16.3589 13.7926 16.698 13.5426 16.948Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block relative h-[1242px] ">
        <div className="absolute left-0 top-[266px] h-[772px] w-full overflow-hidden rounded-3xl bg-primary">
          <VoteRings />
          {!current ? (
            <div className="absolute left-[714px] top-[330px] w-[539px] font-['Montserrat'] text-3xl font-medium text-primary-foreground">
              {t('noDesigns', 'No designs to vote on yet.')}
            </div>
          ) : (
            <>
              <div className="absolute left-[714px] top-[196px] w-[539px] break-words font-['Montserrat'] text-5xl font-semibold text-primary-foreground">
                {current.title?.trim() || t('untitled', 'Untitled design')}
              </div>
              <div className="absolute left-[714px] top-[350px] inline-flex flex-col items-start justify-start gap-4">
                <div className="self-stretch font-['Montserrat'] text-4xl font-semibold text-primary-foreground">
                  {t('votes', 'Votes')}
                </div>
                <div className="self-stretch font-['Montserrat'] text-4xl font-normal text-primary-foreground">
                  {(current.votes ?? 0).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={handleVote}
                disabled={voting || Boolean(current?.hasVoted)}
                className="absolute left-[1222px] top-[669px] inline-flex items-center justify-center gap-2 rounded-3xl bg-card p-4 font-['Montserrat'] text-3xl font-medium text-foreground shadow-lg hover:bg-card/90 transition disabled:opacity-60 cursor-pointer"
              >
                {voting ? (
                  <span className="h-8 w-8 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground" />
                ) : current.hasVoted ? (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t('votedButton', 'Voted')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-foreground">
                      <path d="M12 15.9997L14.6667 18.6663L20 13.333" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M29.3334 25.3332H2.66675M6.66675 9.33317C6.66675 7.8665 7.86675 6.6665 9.33341 6.6665H22.6667C23.374 6.6665 24.0523 6.94746 24.5524 7.44755C25.0525 7.94765 25.3334 8.62593 25.3334 9.33317V25.3332H6.66675V9.33317Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t('voteButton', 'Vote')}
                  </div>
                )}
              </button>
            </>
          )}
          {current && (
            <div className="absolute left-[604px] top-[672px] z-10 h-16 w-52 rounded-2xl bg-card flex items-center justify-center shadow-lg">
              <div className="flex items-center justify-start gap-4">
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Previous design"
                  className="relative z-10 h-12 w-12 overflow-hidden rounded-full bg-secondary text-secondary-foreground flex items-center justify-center cursor-pointer hover:opacity-90 transition"
                >
                  <svg width="16" height="32" viewBox="0 0 16 32" fill="none" className="text-secondary-foreground">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.45738 15.052L10 7.50931L11.8854 9.39465L5.28538 15.9946L11.8854 22.5946L10 24.48L2.45738 16.9373C2.20742 16.6873 2.06699 16.3482 2.06699 15.9946C2.06699 15.6411 2.20742 15.302 2.45738 15.052Z" fill="currentColor"/>
                  </svg>
                </button>
                <div className="flex items-center justify-start gap-1">
                  {designs.map((design, index) => (
                    <button
                      key={design.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition cursor-pointer ${index === currentIndex ? 'bg-secondary' : 'bg-stroke hover:bg-gray-pressed'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next design"
                  className="relative z-10 h-12 w-12 overflow-hidden rounded-full bg-secondary text-secondary-foreground flex items-center justify-center cursor-pointer hover:opacity-90 transition"
                >
                  <svg width="16" height="32" viewBox="0 0 16 32" fill="none" className="text-secondary-foreground">
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.5426 16.948L5.99996 24.4907L4.11462 22.6054L10.7146 16.0054L4.11462 9.40535L5.99996 7.52002L13.5426 15.0627C13.7926 15.3127 13.933 15.6518 13.933 16.0054C13.933 16.3589 13.7926 16.698 13.5426 16.948Z" fill="currentColor"/>
                  </svg>
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
    <div className="w-full overflow-hidden flex flex-col gap-10">
      <HomeBanner />
      <CollectionSection />
      <ProductsSection
        title="This Season's Must-Haves"
        navigateTo="/products?filter=must-have"
        query={{
          filter: "must-have",
        }}
      />
      <CategoriesSection isShop />
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
