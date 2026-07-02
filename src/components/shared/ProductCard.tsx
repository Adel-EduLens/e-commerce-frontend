import { Link } from "react-router-dom";

const asset = (file: string) => `/home%20page/${encodeURIComponent(file)}`;

const defaultImage = asset(
  "medium-shot-man-posing-with-blue-background-removebg-preview 1.png"
);

export type ProductCardProps = {
  title?: string;
  sizeLabel?: string;
  price?: string;
  to?: string;
  featured?: boolean;
  accentClassName?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export default function ProductCard({
  title = "Amber Blaze Classic Tee",
  sizeLabel = "XS - XXL",
  price = "$250",
  to = "/product-details",
  featured = false,
  accentClassName = "bg-[#BEA1DF]",
  imageSrc = defaultImage,
  imageAlt,
  className = "",
}: ProductCardProps) {
  const rootTone = featured ? accentClassName : "bg-white";
  const mediaTone = featured ? accentClassName : "bg-[#F9FAFB]";

  return (
    <Link
      to={to}
      aria-label={`Open details for ${title}`}
      className={`group relative block h-96 w-80 overflow-hidden rounded-2xl shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BBFF63]/60 ${rootTone} ${className}`}
    >
      <div
        className={`absolute left-[8px] top-[8px] overflow-hidden rounded-lg ${featured ? `h-96 w-80 ${mediaTone}` : `h-64 w-80 ${mediaTone}`}`}
      >
        <img
          className={`absolute left-1/2 top-0 -translate-x-1/2 object-contain ${
            featured ? "h-[392px] w-[269px]" : "h-[371px] w-[247px]"
          }`}
          src={imageSrc}
          alt={imageAlt ?? title}
          draggable={false}
        />
        <div className="pointer-events-none absolute left-[266px] top-[8px] h-10 w-10 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#EDEDED]">
          <img
            className="absolute left-[8px] top-[8px] h-6 w-6"
            src={asset("mdi_heart.svg")}
            alt=""
            draggable={false}
          />
        </div>
      </div>

      <div
        className={`absolute left-[8px] h-24 w-80 rounded-lg bg-white ${
          featured
            ? "top-[282px] outline outline-1 outline-offset-[-1px] outline-[#1A1A1A]"
            : "top-[274px]"
        }`}
      >
        <div className="absolute left-[170px] top-[8px] inline-flex items-center justify-start gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <img
              key={index}
              className="h-6 w-6"
              src={asset("material-symbols_star.svg")}
              alt=""
              draggable={false}
            />
          ))}
        </div>

        <div className="absolute left-[8px] top-[8px] w-40 font-['Montserrat'] text-xl font-medium leading-6 text-[#1A1A1A]">
          {title}
        </div>
        <div className="absolute left-[8px] top-[66.50px] font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
          {sizeLabel}
        </div>
        <div className="absolute left-[246px] top-[62px] font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
          {price}
        </div>
      </div>
    </Link>
  );
}
