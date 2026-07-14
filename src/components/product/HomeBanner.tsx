import { useState } from "react";
import { useActiveShopBanners } from "../../hooks/queries/shopBannerQuery";
import { useNavigate } from "react-router-dom";

const HomeBanner = () => {
  const navigate = useNavigate();
  const { data: banners, isPending } = useActiveShopBanners("home");

  const [activeIndex, setActiveIndex] = useState(0);

  const handleBannerClick = () => {
    const link = banner.buttonLink || "/";

    if (link.startsWith(window.location.origin)) {
      navigate(new URL(link).pathname, { replace: true });
    } else {
      window.location.assign(link);
    }
  };

  if (isPending) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-50 dark:bg-card">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  const banner = banners[activeIndex];

  return (
    <section
      className="relative h-[500px] lg:h-[900px] max-w-[1440px] mx-auto w-full overflow-hidden flex items-center rounded-3xl"
      style={{
        backgroundColor: banner.backgroundColor,
      }}
    >
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 items-center h-full w-full">
        {/* Content */}
        <div className="text-white order-2 lg:order-1 px-12 lg:px-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 font-['Montserrat']">
            {banner.title}
          </h1>

          <p className="text-lg md:text-xl max-w-xl mb-8 opacity-90 font-['Montserrat'] font-light">
            {banner.description}
          </p>

          {banner.buttonText && (
            <button
              className="bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition shadow-lg font-['Montserrat']"
              onClick={handleBannerClick}
            >
              {banner.buttonText}
            </button>
          )}
        </div>

        {/* Image */}
        <div className="order-1 lg:order-2 hidden lg:block h-full">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeIndex === index ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeBanner;
