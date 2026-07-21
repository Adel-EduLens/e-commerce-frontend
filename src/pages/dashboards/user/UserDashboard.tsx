import { useAuthStore } from "../../../store/useAuthStore";
import { asset } from '../../../lib/utils';
import { RecommedProducts } from "../../../components/product/recommedProducts";
import { useWishlist } from "../../../hooks/useWishlist";
import { useRecentlyViewed } from "../../../hooks/useRecentlyViewed";
import { useProducts } from "../../../hooks/queries/productsQuery";
import { useNavigate } from "react-router-dom";

function ViewAllButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-start gap-2 rounded-2xl bg-primary p-4"
    >
      <div className="font-['Montserrat'] text-xl font-semibold text-foreground">
        View All
      </div>
    </button>
  );
}

type DashboardProduct = {
  image?: string;
  images?: Array<{ url?: string } | string>;
  imageUrl?: string;
  product?: DashboardProduct;
  retailProduct?: DashboardProduct;
  shopProduct?: DashboardProduct;
  wholesaleProduct?: DashboardProduct;
  [key: string]: unknown;
};

const getProductImage = (prod: DashboardProduct | null | undefined, fallback: string) => {
  if (!prod) return fallback;
  if (typeof prod.image === 'string') return prod.image;
  if (Array.isArray(prod.images) && prod.images.length > 0) {
    const firstImg = prod.images[0];
    if (typeof firstImg === 'string') return firstImg;
    return firstImg.url || fallback;
  }
  if (prod.imageUrl) return prod.imageUrl;
  return fallback;
};

function ProductGallery({ title, products = [], onNavigate }: { title: string; products?: DashboardProduct[]; onNavigate?: () => void }) {
  const fallbackImg = asset("medium-shot-man-posing-with-blue-background-removebg-preview 1.png");
  const mainImage = getProductImage(products[0], fallbackImg);
  const thumbnailProducts = products.slice(1, 4).filter(Boolean);

  return (
    <div className="flex flex-col items-center gap-6 flex-1 min-w-0 max-w-md w-full">
      <div className="self-start font-['Montserrat'] text-lg sm:text-xl font-bold text-foreground">
        {title}
      </div>
      <div className="w-full overflow-hidden rounded-lg bg-card outline outline-1 outline-offset-[-1px] outline-foreground p-2">
        <div className="flex gap-2 justify-center">
          {/* Main image */}
          <div className="w-1/2 shrink-0 bg-background rounded-lg overflow-hidden aspect-square relative flex items-center justify-center">
            <img
              className="absolute inset-0 w-full h-full object-contain p-2"
              src={mainImage}
              alt=""
              draggable={false}
            />
          </div>
          {/* Thumbnail column */}
          {thumbnailProducts.length > 0 && (
            <div className="hidden sm:flex flex-1 flex-col gap-2">
              {thumbnailProducts.map((prod, i) => (
                <div key={i} className="flex-1 bg-background rounded-lg overflow-hidden aspect-square relative flex items-center justify-center">
                  <img
                    className="absolute inset-0 w-full h-full object-contain p-1"
                    src={getProductImage(prod, fallbackImg)}
                    alt=""
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ViewAllButton onClick={onNavigate} />
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: defaultData } = useProducts({ limit: 8 });
  const defaultProducts = defaultData?.products || [];

  const { data: wishlistData } = useWishlist();
  const apiFavorites = Array.isArray(wishlistData?.data)
    ? wishlistData.data.map((item: DashboardProduct) => item.product || item.retailProduct || item.shopProduct || item.wholesaleProduct).filter(Boolean)
    : [];
  const favoriteProducts = apiFavorites.length > 0 ? apiFavorites : defaultProducts.slice(0, 4);

  const { data: recentlyViewedData } = useRecentlyViewed();
  const apiRecentlyViewed = Array.isArray(recentlyViewedData?.data)
    ? recentlyViewedData.data.map((item: DashboardProduct) => item.product).filter(Boolean)
    : [];

  const viewedProducts = apiRecentlyViewed.length > 0
    ? apiRecentlyViewed
    : (defaultProducts.slice(4, 8).length > 0 ? defaultProducts.slice(4, 8) : defaultProducts.slice(0, 4));

  return (
    <div className="w-full">
      <h1 className="font-['Montserrat'] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
        HI, {user?.name?.toUpperCase() || "THERE"}
      </h1>

      <div className="mt-8 flex justify-between flex-col lg:flex-row gap-8">
        <ProductGallery
          title="FAVORITES"
          products={favoriteProducts}
          onNavigate={() => navigate("/favorites")}
        />
        <ProductGallery
          title="VIEWED"
          products={viewedProducts}
          onNavigate={() => navigate("/recently-viewed")}
        />
      </div>

      <div className="mt-8">
        <RecommedProducts />
      </div>
    </div>
  );
}
