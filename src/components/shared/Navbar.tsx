import { Link, useLocation } from "react-router-dom";

const asset = (file: string) => `/home%20page/${encodeURIComponent(file)}`;

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/season-must-haves" },
  { label: "Wholesale", path: "/wholesale" },
  { label: "Design Lab", path: "/design-lab" },
  { label: "Dropshipping", path: "/dropshipping" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <div className="relative flex h-20 w-full items-center rounded-2xl bg-[#F9FAFB] px-4 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      <Link to="/" className="shrink-0">
        <img
          className="h-12 w-[90px]"
          src={asset("logo gen-z 2 copy 1.png")}
          alt="Gen Z"
          draggable={false}
        />
      </Link>
      <div className="ml-8 inline-flex items-center justify-start gap-4">
        {navLinks.map((item) => {
          const isActive =
            item.label === "Home"
              ? location.pathname === "/"
              : item.label === "Shop"
                ? location.pathname === item.path || location.pathname.startsWith("/collections/")
                : location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`font-['Montserrat'] text-xl font-semibold text-[#1A1A1A] ${
                isActive ? "flex items-center justify-center gap-2.5 rounded-lg bg-[#BBFF63] px-4 py-2" : ""
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="inline-flex w-96 items-center justify-start gap-2 rounded-3xl bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <img
            src={asset("mynaui_search-1.svg")}
            className="h-8 w-8"
            alt=""
            draggable={false}
          />
          <div className="font-['Montserrat'] text-base font-semibold text-[#6B7280]">
            Search
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-6">
          <Link to="/bag">
            <img
              src={asset("material-symbols-light_shopping-bag-outline.svg")}
              className="h-11 w-11"
              alt="Bag"
              draggable={false}
            />
          </Link>
          <Link to="/favorites">
            <img
              src={asset("mdi-light_heart.svg")}
              className="h-11 w-11"
              alt="Favorites"
              draggable={false}
            />
          </Link>
          <Link to="/settings">
            <img
              src={asset("iconamoon_profile-light.svg")}
              className="h-11 w-11"
              alt="Profile"
              draggable={false}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
