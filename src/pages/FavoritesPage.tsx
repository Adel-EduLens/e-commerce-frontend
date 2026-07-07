import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ProductCard } from "../components/shared";

const asset = (file: string) => `/home%20page/${encodeURIComponent(file)}`;

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



function ProductRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      <ProductCard />
      <ProductCard featured accentClassName="bg-[#C4B5FD]" />
      <ProductCard />
      <ProductCard />
    </div>
  );
}

function FilterSection() {
  return (
    <div className="mt-6 inline-flex w-full flex-col items-start justify-start gap-3">
      <div className="self-stretch font-['Montserrat'] text-3xl font-bold text-foreground">
        Filter by
      </div>
      <div className="flex flex-wrap items-center gap-4 self-stretch">
        <div className="flex items-center justify-start gap-4">
          {/* Sort by */}
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-gray-light p-4">
            <div className="font-['Montserrat'] text-2xl font-medium text-gray-text">
              Sort by
            </div>
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white">
              <AssetImage
                file="weui_arrow-filled-1.svg"
                className="h-4 w-4 rotate-90"
              />
            </div>
          </div>
          {/* Filter by */}
          <div className="flex w-auto items-center justify-between rounded-2xl bg-gray-light p-4">
            <div className="font-['Montserrat'] text-2xl font-medium text-gray-text">
              Filter by
            </div>
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white">
              <AssetImage
                file="weui_arrow-filled-1.svg"
                className="h-4 w-4 rotate-90"
              />
            </div>
          </div>
        </div>
        {/* Search */}
        <div className="flex w-full sm:w-96 items-center justify-between rounded-2xl bg-gray-light p-4">
          <div className="font-['Montserrat'] text-2xl font-medium text-gray-text">
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
    <div className="w-full">
      <div className="font-['Montserrat'] text-4xl font-bold text-foreground">
        Favorites
      </div>
      <FilterSection />
      <div className="mt-6 flex flex-col gap-6">
        <ProductRow />
        <ProductRow />
        <ProductRow />
        <ProductRow />
      </div>
    </div>
  );
}
