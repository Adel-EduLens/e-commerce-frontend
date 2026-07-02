import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Navbar, Footer, ProductCard } from "../components/shared";

const asset = (file: string) => `/home%20page%20/${encodeURIComponent(file)}`;

function AssetImage({
  file,
  className,
  alt = "",
}: {
  file: string;
  className: string;
  alt?: string;
}) {
  return (
    <img
      className={className}
      src={asset(file)}
      alt={alt}
      draggable={false}
    />
  );
}



function ProductRow({ top }: { top: string }) {
  return (
    <div className={`absolute left-[24px] ${top} inline-flex items-center justify-start gap-6`}>
      <ProductCard />
      <ProductCard featured accentClassName="bg-[#C4B5FD]" />
      <ProductCard />
      <ProductCard />
    </div>
  );
}

function FilterSection() {
  return (
    <div className="absolute left-[24px] top-[211px] inline-flex w-[1392px] flex-col items-start justify-start gap-3">
      <div className="self-stretch font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
        Filter by
      </div>
      <div className="inline-flex items-center justify-between self-stretch">
        <div className="flex items-center justify-start gap-4">
          {/* Sort by */}
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#EDEDED] p-4">
            <div className="font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
              Sort by
            </div>
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
              <div className="absolute left-[28px] top-[10px] h-6 w-0 origin-top-left rotate-90 overflow-hidden">
                <AssetImage
                  file="weui_arrow-filled-1.svg"
                  className="absolute left-0 top-0 h-6 w-6"
                />
              </div>
            </div>
          </div>
          {/* Filter by */}
          <div className="flex w-44 items-center justify-between rounded-2xl bg-[#EDEDED] p-4">
            <div className="font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
              Filter by
            </div>
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
              <div className="absolute left-[28px] top-[10px] h-6 w-0 origin-top-left rotate-90 overflow-hidden">
                <AssetImage
                  file="weui_arrow-filled-1.svg"
                  className="absolute left-0 top-0 h-6 w-6"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Search */}
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
  );
}



export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative h-[2483px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      <Navbar />
      <div className="absolute left-[24px] top-[122px] font-['Montserrat'] text-4xl font-bold text-[#1A1A1A]">
        Favorites
      </div>
      <FilterSection />
      <ProductRow top="top-[375px]" />
      <ProductRow top="top-[784px]" />
      <ProductRow top="top-[1193px]" />
      <ProductRow top="top-[1602px]" />
      <Footer top="top-[2041px]" />
    </div>
  );
}
