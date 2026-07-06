import { Link, useLocation } from 'react-router-dom'
import { Heart, Search, ShoppingBag, User } from 'lucide-react'

const asset = (file: string) => `/home-page/${encodeURIComponent(file)}`

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/season-must-haves' },
  { label: 'Wholesale', path: '/wholesale' },
  { label: 'Design Lab', path: '/design-lab' },
  { label: 'Dropshipping', path: '/dropshipping' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <div className="relative flex h-20 w-full items-center rounded-2xl bg-card px-4 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-stroke">
      <Link to="/" className="shrink-0">
        <img
          className="h-12 w-[90px] logo-theme"
          src={asset('logo gen-z 2 copy 1.png')}
          alt="Gen Z"
          draggable={false}
        />
      </Link>
      <div className="ml-8 inline-flex items-center justify-start gap-4">
        {navLinks.map((item) => {
          const isActive =
            item.label === 'Home'
              ? location.pathname === '/'
              : item.label === 'Shop'
                ? location.pathname === item.path ||
                location.pathname.startsWith('/collections/')
                : location.pathname === item.path

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`font-['Montserrat'] text-lg font-semibold transition-colors ${isActive
                ? 'flex items-center justify-center gap-2.5 rounded-lg bg-primary px-4 py-2 text-[#1A1A1A]'
                : 'text-foreground hover:text-primary'
                }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="inline-flex w-96 items-center justify-start gap-2 rounded-3xl bg-background p-2 outline outline-1 outline-offset-[-1px] outline-stroke">
          <Search className="h-6 w-6 text-foreground" strokeWidth={1.5} />
          <div className="font-['Montserrat'] text-base font-semibold text-gray-text">
            Search
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-6">
          <Link to="/bag">
            <ShoppingBag className="h-8 w-8 text-foreground hover:text-primary transition-colors" strokeWidth={1.5} />
          </Link>
          <Link to="/favorites">
            <Heart className="h-8 w-8 text-foreground hover:text-primary transition-colors" strokeWidth={1.5} />
          </Link>
          <Link to="/settings">
            <User className="h-8 w-8 text-foreground hover:text-primary transition-colors" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  )
}
