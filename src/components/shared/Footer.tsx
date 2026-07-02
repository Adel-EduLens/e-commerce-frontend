import { Link } from "react-router-dom";

const asset = (file: string) => `/home%20page/${encodeURIComponent(file)}`;

const footerLinks: Record<string, { label: string; path: string }[]> = {
  About: [
    { label: "About Us", path: "/" },
    { label: "Design Lab", path: "/" },
    { label: "Dropship", path: "/dropshipping" },
  ],
  Shop: [
    { label: "Men", path: "/season-must-haves" },
    { label: "Kids", path: "/season-must-haves" },
    { label: "Women", path: "/season-must-haves" },
  ],
  Help: [
    { label: "FAQ", path: "/help-center" },
    { label: "Contact", path: "/contact-details" },
    { label: "Shipping", path: "/help-center" },
    { label: "Returns", path: "/help-center" },
    { label: "Track Order", path: "/my-orders" },
  ],
  Legal: [
    { label: "Privacy", path: "/" },
    { label: "Terms", path: "/" },
    { label: "Cookies", path: "/" },
  ],
};

const socials = [
  "prime_twitter.svg",
  "ri_facebook-fill.svg",
  "ic_outline-tiktok.svg",
  "iconoir_instagram.svg",
];

function FooterColumn({ title, items }: { title: string; items: { label: string; path: string }[] }) {
  return (
    <div className="inline-flex w-48 flex-col items-start justify-center gap-4">
      <div className="self-stretch font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
        {title}
      </div>
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className="self-stretch font-['Montserrat'] text-2xl font-medium text-[#6B7280] hover:text-[#1A1A1A]"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

type FooterProps = {
  top?: string;
  height?: string;
  innerHeight?: string;
};

export default function Footer({ top = "top-[1507px]", height = "h-96", innerHeight = "h-96" }: FooterProps) {
  return (
    <div className={`absolute left-0 ${top} ${height} w-[1440px] overflow-hidden border-t border-[#E0E0E0]`}>
      <div className="absolute left-[323px] top-[69px] font-['Montserrat'] text-[250px] font-medium text-gray-500/20">
        GEN Z
      </div>
      <div className={`absolute left-[24px] top-[32px] ${innerHeight} w-[1392px]`}>
        <div className="absolute left-0 top-[80px] inline-flex items-start justify-start gap-8">
          {Object.entries(footerLinks).map(([title, items]) => (
            <FooterColumn key={title} title={title} items={items} />
          ))}
        </div>
        <div className="absolute left-[1096px] top-0 inline-flex items-center justify-start gap-6">
          {socials.map((social) => (
            <div
              key={social}
              className="relative h-14 w-14 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]"
            >
              <img
                src={asset(social)}
                className="absolute left-[12px] top-[12px] h-8 w-8"
                alt=""
                draggable={false}
              />
            </div>
          ))}
        </div>
        <div className="absolute left-[932px] top-[72px] font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
          SIGN UP FOR DISCOUNTS + UPDATES
        </div>
        <div className="absolute left-0 top-[358px] font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
          © 2025 GenZ, LLC. All Rights Reserved.
        </div>
        <div className="absolute left-[932px] top-[117px] inline-flex w-[460px] items-center justify-between rounded-2xl bg-[#EDEDED] p-4">
          <div className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
            Phone Number or Email
          </div>
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
            <img
              src={asset("weui_arrow-filled-3.svg")}
              className="absolute left-[18px] top-[12px] h-6 w-3"
              alt=""
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
