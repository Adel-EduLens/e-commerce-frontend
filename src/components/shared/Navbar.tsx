import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, Search, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../../store/useCartStore'

const asset = (file: string) => `/home-page/${encodeURIComponent(file)}`

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/products' },
  { label: 'Wholesale', path: '/wholesale' },
  { label: 'Design Lab', path: '/design-lab' },
  { label: 'Dropshipping', path: '/dropshipping' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const items = useCartStore((state) => state.items)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/season-must-haves?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

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
        <form onSubmit={handleSearchSubmit} className="inline-flex w-96 items-center justify-start gap-2 rounded-3xl bg-background p-2 outline outline-1 outline-offset-[-1px] outline-stroke">
          <button type="submit" className="focus:outline-none">
            <Search className="h-6 w-6 text-foreground hover:text-primary transition-colors" strokeWidth={1.5} />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent font-['Montserrat'] text-base font-semibold text-foreground placeholder:text-gray-text focus:outline-none"
          />
        </form>
        <div className="inline-flex items-center justify-start gap-6">
          <Link to="/bag" className="relative flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-foreground hover:text-primary transition-colors" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center border border-background">
                {itemCount}
              </span>
            )}
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
