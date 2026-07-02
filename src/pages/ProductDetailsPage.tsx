import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brush,
  Heart,
  RotateCcw,
  ScanFace,
  Share2,
  Shirt,
  ShoppingBag,
  Tag,
  ThumbsUp,
  Truck,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Footer, Navbar, ProductCard } from "../components/shared";

const asset = (file: string) => `/home%20page%20/${encodeURIComponent(file)}`;

type AssetImageProps = {
  file: string;
  className: string;
  alt?: string;
};

function AssetImage({ file, className, alt = "" }: AssetImageProps) {
  return (
    <img
      className={className}
      src={asset(file)}
      alt={alt}
      draggable={false}
    />
  );
}

function StarRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-start gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <AssetImage
          key={index}
          file="material-symbols_star.svg"
          className="h-6 w-6"
        />
      ))}
    </div>
  );
}

function ArrowCircle({
  direction = "right",
  dark = false,
  size = 48,
}: {
  direction?: "right" | "left" | "down";
  dark?: boolean;
  size?: 40 | 48;
}) {
  const icon =
    direction === "left"
      ? "weui_arrow-filled-2.svg"
      : direction === "down"
        ? "weui_arrow-filled-1.svg"
        : "weui_arrow-filled-3.svg";
  const iconClass =
    size === 40
      ? "absolute left-[14px] top-[8px] h-6 w-3"
      : direction === "left"
        ? "absolute left-[16px] top-[8px] h-8 w-4"
        : direction === "down"
          ? "absolute left-[12px] top-[18px] h-3 w-6"
          : "absolute left-[18px] top-[12px] h-6 w-3";

  return (
    <div
      className={`relative ${size === 40 ? "h-10 w-10" : "h-12 w-12"} overflow-hidden rounded-full ${
        dark ? "bg-[#0F1115]" : "bg-white"
      }`}
    >
      <AssetImage file={icon} className={iconClass} />
    </div>
  );
}

function DownFilter({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-start gap-2 rounded-2xl bg-[#EDEDED] p-4">
      <div className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
        {label}
      </div>
      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
        <AssetImage
          file="weui_arrow-filled-1.svg"
          className="absolute left-[4px] top-[10px] h-3 w-6"
        />
      </div>
    </div>
  );
}



function Gallery() {
  return (
    <>
      <AssetImage
        file="image 11.png"
        className="absolute left-[24px] top-[150px] h-[1013px] w-[750px] object-cover"
      />
      <div className="absolute left-[792px] top-[150px] inline-flex w-[150px] flex-col items-center justify-start gap-6">
        <div className="self-stretch flex flex-col items-start justify-start gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="relative h-[150px] self-stretch overflow-hidden rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#1A1A1A]"
            >
              <AssetImage
                file="image 11.png"
                className="absolute left-0 top-0 h-[250px] w-[150px] object-cover"
              />
            </div>
          ))}
        </div>
        <div className="inline-flex origin-top-left rotate-[-90deg] items-center justify-start gap-6">
          <ArrowCircle direction="left" dark />
          <div className="rounded-full outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <ArrowCircle />
          </div>
        </div>
      </div>
      <div className="absolute left-[232px] top-[1034px] h-[50.47px] w-[311px] rounded-full border-[1.5px] border-[#87C3FF]" />
      <div className="absolute left-[289px] top-[1047.31px] h-5 w-[136px] rounded-full opacity-70" />
      <div className="absolute left-[269.24px] top-[1073.58px] h-[3.96px] w-[4.03px] rounded-full bg-[#1A1A1A]" />
      <div className="absolute left-[491.67px] top-[1075.56px] h-[3.96px] w-[4.03px] rounded-full bg-[#1A1A1A]" />
      <AssetImage
        file="Group 133.svg"
        className="absolute left-[354.89px] top-[1057.65px] h-16 w-[65px]"
      />
    </>
  );
}

function TryOnButton({
  label,
  left,
  top,
  icon: Icon,
}: {
  label: string;
  left: string;
  top: string;
  icon: typeof ScanFace;
}) {
  return (
    <div
      className={`absolute ${left} ${top} inline-flex items-center justify-start gap-2 rounded-2xl bg-white p-4`}
    >
      <Icon className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
      <div className="flex flex-col justify-end font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
        {label}
      </div>
    </div>
  );
}

function FloatingActions() {
  return (
    <>
      <TryOnButton
        label="AR Try-On"
        left="left-[611px]"
        top="top-[174px]"
        icon={ScanFace}
      />
      <TryOnButton
        label="Customize"
        left="left-[607px]"
        top="top-[243px]"
        icon={Brush}
      />
      <TryOnButton
        label="Avatar Try-On"
        left="left-[427px]"
        top="top-[174px]"
        icon={Shirt}
      />
    </>
  );
}

function ProductInfoPanel() {
  return (
    <div className="absolute left-[968px] top-[150px] inline-flex w-[438px] flex-col items-start justify-start gap-4">
      <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
        Plain Maxi Tabard Dress
      </div>
      <div className="flex w-[309px] flex-col items-start justify-start gap-2">
        <div className="self-stretch font-['Montserrat'] text-sm font-normal leading-6 text-[#1A1A1A]">
          Crafted from a piece of cotton blend fabric, this round neck t-shirt
          dress is{" "}
          <span className="font-semibold text-[#1A1A1A]">Read More</span>
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
        1000 EGP
      </div>
      <div className="inline-flex items-center justify-start gap-2">
        <Tag className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
        <div className="flex w-[50px] flex-col justify-end font-['Montserrat'] text-base font-medium text-[#6B7280]">
          Nike
        </div>
      </div>
      <div className="self-stretch inline-flex items-center justify-start gap-[73px]">
        <div className="flex items-center justify-start gap-2">
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            4.8
          </div>
          <StarRow />
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-medium text-[#6B7280]">
            (124 Reviews)
          </div>
        </div>
        <div className="flex items-center justify-start gap-2">
          <Share2 className="h-6 w-6 fill-[#1A1A1A] text-[#1A1A1A]" />
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
            Share
          </div>
        </div>
      </div>
      <div className="flex w-[121px] flex-col items-start justify-start gap-2">
        <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-xl text-[#1A1A1A]">
          <span className="font-medium text-[#6B7280]">Color:</span>{" "}
          <span className="font-normal text-[#1A1A1A]">Black</span>
        </div>
        <div className="inline-flex items-center justify-start gap-[7px] self-stretch">
          <div className="relative h-[25px] w-[25px]">
            <div className="absolute left-0 top-0 h-[25px] w-[25px] rounded-full bg-[#1A1A1A]" />
            <div className="absolute left-[1px] top-[1px] h-[23px] w-[23px] rounded-full border-2 border-white" />
          </div>
          <div className="h-[25px] w-[25px] rounded-full bg-[#F6D1C9]" />
          <div className="h-[25px] w-[25px] rounded-full bg-[#A29F8E]" />
          <div className="h-[25px] w-[25px] rounded-full bg-[#D1BBA4]" />
        </div>
      </div>
      <div className="inline-flex w-[323px] flex-wrap content-start items-start justify-start gap-x-[167px] gap-y-2">
        <div className="flex flex-col justify-end font-['Montserrat'] text-xl text-[#1A1A1A]">
          <span className="font-medium text-[#6B7280]">Size:</span>{" "}
          <span className="font-normal text-[#1A1A1A]">M</span>
        </div>
        <div className="flex flex-col justify-end font-['Montserrat'] text-base font-medium text-[#6B7280] underline">
          Size Guide
        </div>
        <div className="flex items-center justify-start gap-2.5">
          {["S", "M", "L"].map((size) => (
            <div
              key={size}
              className={`relative h-8 w-8 overflow-hidden rounded-full outline outline-1 outline-offset-[-1px] outline-[#E0E0E0] ${
                size === "M" ? "bg-[#BBFF63]" : ""
              }`}
            >
              <div
                className={`absolute top-[1px] flex flex-col justify-end font-['Poppins'] text-xl font-normal text-[#1A1A1A] ${
                  size === "S"
                    ? "left-[10px]"
                    : size === "M"
                      ? "left-[7px]"
                      : "left-[11px]"
                }`}
              >
                {size}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-[136px] flex-col items-start justify-start gap-2">
        <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-xl font-medium text-[#6B7280]">
          Quantity:
        </div>
        <div className="inline-flex items-center justify-start gap-4 self-stretch rounded-3xl bg-[#EDEDED] p-2">
          <ArrowCircle direction="left" size={40} />
          <div className="flex flex-col justify-end font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
            1
          </div>
          <ArrowCircle size={40} />
        </div>
      </div>
      <div className="inline-flex items-center justify-start gap-4 self-stretch">
        <div className="flex items-center justify-start gap-2 rounded-2xl bg-white px-2 py-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <Heart className="h-6 w-6 text-[#1A1A1A]" strokeWidth={2} />
          <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            Add to favorite
          </div>
        </div>
        <div className="flex items-center justify-start gap-2 rounded-2xl bg-white px-2 py-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <ShoppingBag className="h-6 w-6 text-[#1A1A1A]" fill="#1A1A1A" />
          <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            Add to Cart
          </div>
        </div>
        <div className="flex items-center justify-start gap-2 rounded-2xl bg-[#BBFF63] px-2 py-4">
          <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            Buy Now
          </div>
        </div>
      </div>
      <div className="flex w-[295px] flex-col items-start justify-start gap-4">
        <div className="inline-flex items-center justify-start gap-1.5 self-stretch">
          <Truck className="h-[34px] w-[34px] text-[#1A1A1A]" fill="#1A1A1A" />
          <div className="w-[252px] font-['Montserrat'] text-sm font-medium leading-6">
            <span className="text-[#D6001C]">
              Get it Tomorrow, 29th Sep,
              <br />
            </span>
            <span className="text-[#1A1A1A]">
              Order within 3 Hours &amp; 26minutes
            </span>
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-1.5">
          <RotateCcw className="h-[34px] w-[34px] text-[#1A1A1A]" />
          <div className="font-['Poppins'] text-sm font-medium leading-6 text-[#1A1A1A]">
            Free online returns within 14 days
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewAllButton() {
  return (
    <div className="inline-flex items-center justify-start gap-2 rounded-2xl bg-[#BBFF63] p-4">
      <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
        View All
      </div>
      <ArrowCircle size={40} />
    </div>
  );
}

function ProductShelf({
  title,
  top,
}: {
  title: "Recommended for You" | "Complete the look";
  top: string;
}) {
  return (
    <div
      className={`absolute left-[24px] ${top} inline-flex w-[1392px] flex-col items-center justify-start gap-10`}
    >
      <div className="self-stretch font-['Montserrat'] text-5xl font-bold text-[#1A1A1A]">
        {title}
      </div>
      <div className="flex w-[1392px] flex-col items-center justify-start gap-8">
        <div className="self-stretch flex flex-col items-start justify-start gap-6">
          <div className="self-stretch inline-flex items-center justify-start gap-6">
            <ProductCard />
            <ProductCard featured />
            <ProductCard featured />
            <ProductCard />
          </div>
        </div>
        <ViewAllButton />
      </div>
    </div>
  );
}

function ReviewsSection() {
  return (
    <>
      <div className="absolute left-[24px] top-[1203px] inline-flex items-center justify-start gap-6">
        <div className="font-['Montserrat'] text-5xl font-bold text-[#1A1A1A]">
          Reviews
        </div>
        <div className="flex items-center justify-start gap-2">
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            4.8
          </div>
          <StarRow />
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-medium text-[#6B7280]">
            (124 Reviews)
          </div>
        </div>
      </div>
      <div className="absolute left-[24px] top-[1286px] inline-flex items-center justify-start gap-[180px]">
        <div className="flex flex-col justify-end font-['Montserrat'] text-xl font-medium text-[#6B7280]">
          Showing 3 of 80 reviews
        </div>
        <div className="flex items-center justify-start gap-4">
          <DownFilter label="Filter by rating all" />
          <DownFilter label="Sort by highest" />
        </div>
      </div>
      <div className="absolute left-[24px] top-[1366px] h-[365px] w-[918px]">
        <div className="absolute left-0 top-0 inline-flex items-center justify-start gap-6">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[#EDEDED]">
            <div className="absolute left-[25px] top-[21px] flex flex-col justify-end font-['Montserrat'] text-[32px] font-medium text-[#1A1A1A]">
              M
            </div>
          </div>
          <div className="inline-flex w-[127px] flex-col items-start justify-start gap-1.5">
            <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
              Mariam K.
            </div>
            <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-xl font-medium text-[#6B7280]">
              Mar 20, 2025
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-[96px] inline-flex items-center justify-start gap-2">
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            4.8
          </div>
          <StarRow />
        </div>
        <div className="absolute left-0 top-[144px] inline-flex items-center justify-start gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="relative h-20 w-20 overflow-hidden rounded-3xl"
            >
              <AssetImage
                file="image 11.png"
                className="absolute left-0 top-0 h-[134px] w-20 object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute left-0 top-[248px] inline-flex w-[918px] flex-col items-start justify-start gap-4">
          <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
            Amazing
          </div>
          <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-xl font-medium text-[#6B7280]">
            I love this fur coat! literally amazing trust me if you are looking
            for a fur coat this is the one!!! It’s so cute and the quality is
            amazing. It’s not oversized but it’s true to size so if you’re
            petite and looking for an xs this is perfect.
          </div>
        </div>
        <div className="absolute left-[748px] top-[12px] inline-flex items-center justify-start gap-2 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <ThumbsUp className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
          <div className="font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
            Helpful (4)
          </div>
        </div>
      </div>
      <div className="absolute left-[402px] top-[1771px] inline-flex items-center justify-start gap-2 rounded-2xl bg-[#BBFF63] p-4">
        <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
          View All
        </div>
      </div>
    </>
  );
}



export default function ProductDetailsPage() {
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
    <div className="relative h-[3584px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      <Navbar top="top-[24px]" />
      <Gallery />
      <FloatingActions />
      <div className="absolute left-[24px] top-[122px] flex flex-col justify-end font-['Montserrat'] text-base font-normal text-[#6B7280]">
        Home / Women / Dresses
      </div>
      <ReviewsSection />
      <ProductShelf title="Recommended for You" top="top-[1912px]" />
      <ProductShelf title="Complete the look" top="top-[2540px]" />
      <ProductInfoPanel />
      <Footer top="top-[3142px]" height="h-[442px]" innerHeight="h-[378px]" />
    </div>
  );
}
