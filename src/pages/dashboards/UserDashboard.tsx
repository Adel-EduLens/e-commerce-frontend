import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { ProductCard } from "../../components/shared";
import CatalogFilters from "../../components/shared/CatalogFilters";
import { useHomeFilters } from "../../hooks/utils/HomeFilters";

const asset = (file: string) => `/home-page/${encodeURIComponent(file)}`

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
    </button>
  );
}

function ProductGallery({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-6 flex-1 min-w-0 max-w-md">
      <div className="self-start font-['Montserrat'] text-lg sm:text-xl font-bold text-foreground">
        {title}
      </div>
      <div className="w-full overflow-hidden rounded-lg bg-card outline outline-1 outline-offset-[-1px] outline-foreground">
        <div className="flex gap-2">
          {/* Main image */}
          <div className="flex-1 bg-[#F9FAFB] rounded-lg overflow-hidden">
            <img
              className="w-full h-full object-contain"
              src={asset("medium-shot-man-posing-with-blue-background-removebg-preview 1.png")}
              alt=""
              draggable={false}
            />
          </div>
          {/* Thumbnail column */}
          <div className="hidden sm:flex w-24 flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 bg-[#F9FAFB] rounded-lg overflow-hidden">
                <img
                  className="w-full h-full object-contain"
                  src={asset("medium-shot-man-posing-with-blue-background-removebg-preview 1.png")}
                  alt=""
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <ViewAllButton />
    </div>
  );
}

function RecommendedSection() {
  const filters = useHomeFilters();

  return (
    <div className="mt-12 flex w-full flex-col items-center gap-10">
      <div className="self-stretch font-['Montserrat'] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
        Recommended for You
      </div>
      <div className="w-full flex flex-col items-center gap-8">
        <CatalogFilters filters={filters} />
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCard key={index} />
          ))}
        </div>
        <ViewAllButton />
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="w-full">
      <h1 className="font-['Montserrat'] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
        HI, {user?.name?.toUpperCase() || "THERE"}
      </h1>

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <ProductGallery title="FAVORITES" />
        <ProductGallery title="VIEWED" />
      </div>

      <RecommendedSection />
    </div>
  );
}
