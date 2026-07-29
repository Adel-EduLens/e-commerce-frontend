import { useState } from "react";
import { Link } from "react-router-dom";
import { useActiveShopBanners } from "../../hooks/queries/shopBannerQuery";

const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

function getBannerLinkProps(buttonLink?: string) {
  const defaultLink = "/products";
  const link = buttonLink?.trim() || defaultLink;

  try {
    if (link.startsWith("http://") || link.startsWith("https://")) {
      const url = new URL(link);
      if (url.origin === window.location.origin) {
        return { isExternal: false, to: url.pathname + url.search + url.hash };
      }
      return { isExternal: true, href: link };
    }
  } catch {
    // Ignore URL parse error for relative paths
  }

  const to = link.startsWith("/") ? link : `/${link}`;
  return { isExternal: false, to };
}

const ShopBanner = () => {
  const { data: banners, isPending } = useActiveShopBanners("shop");
  const [activeIndex, setActiveIndex] = useState(0);

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  const banner = banners[activeIndex];
  const isBannerArabic =
    isArabic(banner.title) || isArabic(banner.description);

  const { isExternal, to, href } = getBannerLinkProps(banner.buttonLink);
  const btnClassName = "inline-block bg-black text-white px-8 py-3 rounded-lg hover:opacity-90 transition text-center no-underline";

  return (
    <section
      className="relative h-screen w-full overflow-hidden flex items-center"
      style={{
        backgroundColor: banner.backgroundColor,
      }}
    >
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 items-center h-full w-full">
        {/* Content */}
        <div
          dir={isBannerArabic ? "rtl" : "ltr"}
          className={`text-white order-2 lg:order-1 px-6 ${
            isBannerArabic ? "text-right" : "text-left"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            {banner.title}
          </h1>

          <p className="text-lg md:text-xl max-w-xl mb-8">
            {banner.description}
          </p>

          {banner.buttonText && (
            isExternal && href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={btnClassName}
              >
                {banner.buttonText}
              </a>
            ) : (
              <Link to={to || "#"} className={btnClassName}>
                {banner.buttonText}
              </Link>
            )
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              activeIndex === index ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ShopBanner;