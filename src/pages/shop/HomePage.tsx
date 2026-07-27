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




import { useDesigns, type VoteDesign } from '../../hooks/queries/designsQuery';
import { handleApiError } from '../../lib/utils';
import ProductsSection from '../../components/shared/ProductsSection'

function VoteSection() {
  const queryClient = useQueryClient();
  const { data: designs = [] } = useDesigns();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [voting, setVoting] = useState(false);
  const { t } = useTranslation("vote");

  const defaultDesigns: VoteDesign[] = [
    {
      id: "demo-1",
      title: "Vote for next design",
      description: "Premium oversized drop-shoulder jacket featuring windproof tech-canvas and utility pockets for maximum comfort.",
      imagePath: asset("image 11.png"),
      votes: 1200,
    },
    {
      id: "demo-2",
      title: "Urban Utility Oversized Hoodie",
      description: "Heavyweight 450GSM organic cotton hoodie with modular cargo pockets and water-resistant finish.",
      imagePath: asset("image 1.png"),
      votes: 980,
    },
    {
      id: "demo-3",
      title: "Cyberpunk Techwear Windbreaker",
      description: "Reflective multi-zipper shell jacket built for high mobility and extreme weather resistance.",
      imagePath: asset("image 2.png"),
      votes: 1450,
    },
    {
      id: "demo-4",
      title: "Minimalist Essential Track Jacket",
      description: "Sleek matte nylon jacket with hidden zip closure and custom embroidered branding.",
      imagePath: asset("image 4.png"),
      votes: 830,
    },
    {
      id: "demo-5",
      title: "Vintage Washed Denim Outerwear",
      description: "Artisanal distressed denim jacket with fleece lining and custom brass hardware.",
      imagePath: asset("image 7.png"),
      votes: 1120,
    },
  ];

  const activeDesigns = designs.length > 0 ? designs : defaultDesigns;
  const safeIndex = currentIndex % activeDesigns.length;
  const current = activeDesigns[safeIndex];

  useEffect(() => {
    if (activeDesigns.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeDesigns.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeDesigns.length]);

  async function handleVote() {
    if (!current || voting || current.hasVoted) return;

    if (current.id.startsWith("demo-")) {
      setVoting(true);
      setTimeout(() => {
        current.votes = (current.votes ?? 0) + 1;
        current.hasVoted = true;
        setVoting(false);
        toast.success(t("successMessage", "Your vote has been counted!"));
      }, 400);
      return;
    }

    setVoting(true);
    try {
      const res = await api.put(`/trader/designs/vote/${current.id}`);
      if (res.status === 200) {
        toast.success(t("successMessage", "Your vote has been counted!"));
        queryClient.setQueryData(["designs"], (prev: VoteDesign[] | undefined) =>
          prev?.map((design) =>
            design.id === current.id
              ? { ...design, votes: (design.votes ?? 0) + 1, hasVoted: true }
              : design
          )
        );
      }
    } catch (error) {
      handleApiError(error, t("errorMessage", "Failed to submit vote"));
    } finally {
      setVoting(false);
    }
  }

  const rawVotes = current?.votes ?? 1200;
  const formattedVotes =
    rawVotes >= 1000 ? `+${(rawVotes / 1000).toFixed(1)}K` : `+${rawVotes}`;

  return (
    <div className="mt-10 sm:mt-16 w-full max-w-[1400px] mx-auto font-['Montserrat'] px-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl sm:rounded-[36px] bg-[#9E121B] shadow-2xl grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-[520px]">
        {/* Left Section (Red Background with Swirl Overlay and Content) */}
        <div className="relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white overflow-hidden bg-gradient-to-br from-[#A8121B] via-[#9B0F17] to-[#880B13] h-full">
          {/* Organic Background Swirl Overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
            viewBox="0 0 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M-100 300C50 150 250 450 400 300C550 150 700 450 850 300"
              stroke="white"
              strokeWidth="50"
              strokeLinecap="round"
            />
            <path
              d="M-50 450C100 300 300 600 450 450C600 300 750 600 900 450"
              stroke="white"
              strokeWidth="35"
              strokeLinecap="round"
            />
            <path
              d="M-150 150C0 0 200 300 350 150C500 0 650 300 800 150"
              stroke="white"
              strokeWidth="45"
              strokeLinecap="round"
            />
          </svg>

          {/* Top/Middle Text Content */}
          <div className="relative z-10 flex flex-col items-start justify-center my-auto space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {t("title", "Vote for next design")}
            </h2>

            <p className="text-sm sm:text-base text-white/85 font-normal leading-relaxed max-w-lg line-clamp-3">
              {current?.description ||
                "Premium oversized drop-shoulder jacket featuring windproof tech-canvas and utility pockets for maximum comfort."}
            </p>

            <div className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide">
              {formattedVotes} Votes
            </div>

            <button
              type="button"
              onClick={handleVote}
              disabled={voting || Boolean(current?.hasVoted)}
              className="rounded-xl border border-white bg-transparent px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:bg-white hover:text-[#9B0F17] active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {voting
                ? "Voting..."
                : current?.hasVoted
                ? "Voted ✓"
                : t("voteNow", "Vote Now")}
            </button>
          </div>

          {/* Carousel Dots at Bottom Center */}
          <div className="relative z-10 flex items-center justify-center gap-2 pt-6 sm:pt-10">
            {activeDesigns.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === safeIndex
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Section (Fixed Height Product Image Container) */}
        <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[520px] overflow-hidden bg-zinc-900">
          <img
            key={current?.id || safeIndex}
            src={current?.imagePath || asset("image 11.png")}
            alt={current?.title || "Next Design"}
            className="absolute inset-0 w-full h-full object-cover object-center animate-swap-fade"
          />
        </div>
      </div>
    </div>
  );
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
