import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

const asset = (file: string) => `/home-page/${encodeURIComponent(file)}`

const footerLinks: Record<string, { label: string; path: string }[]> = {
  About: [
    { label: 'About Us', path: '/' },
    { label: 'Design Lab', path: '/' },
    { label: 'Dropship', path: '/dropshipping' },
  ],
  Shop: [
    { label: 'Men', path: '/season-must-haves' },
    { label: 'Kids', path: '/season-must-haves' },
    { label: 'Women', path: '/season-must-haves' },
  ],
  Help: [
    { label: 'FAQ', path: '/help-center' },
    { label: 'Contact', path: '/contact-details' },
    { label: 'Shipping', path: '/help-center' },
    { label: 'Returns', path: '/help-center' },
    { label: 'Track Order', path: '/my-orders' },
  ],
  Legal: [
    { label: 'Privacy', path: '/' },
    { label: 'Terms', path: '/' },
    { label: 'Cookies', path: '/' },
  ],
}

const socials = [
  'prime_twitter.svg',
  'ri_facebook-fill.svg',
  'ic_outline-tiktok.svg',
  'iconoir_instagram.svg',
]

function FooterColumn({
  title,
  items,
}: {
  title: string
  items: { label: string; path: string }[]
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="font-['Montserrat'] text-lg sm:text-xl lg:text-2xl font-medium text-[#1A1A1A]">
        {title}
      </div>
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className="font-['Montserrat'] text-base sm:text-lg lg:text-2xl font-medium text-[#6B7280] hover:text-[#1A1A1A]"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

type FooterProps = {
  top?: string
  height?: string
  innerHeight?: string
  style?: CSSProperties
}

export default function Footer({
  style,
}: FooterProps) {
  return (
    <div
      className="relative w-full overflow-hidden border-t border-[#E0E0E0] py-8 px-4 sm:px-6 lg:px-8"
      style={style}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Montserrat'] text-[80px] sm:text-[120px] lg:text-[200px] xl:text-[250px] font-medium text-gray-500/20 whitespace-nowrap select-none">
        GEN Z
      </div>
      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 flex-1">
            {Object.entries(footerLinks).map(([title, items]) => (
              <FooterColumn key={title} title={title} items={items} />
            ))}
          </div>
          <div className="flex flex-col gap-4 lg:w-[460px]">
            <div className="flex items-center gap-4">
              {socials.map((social) => (
                <div
                  key={social}
                  className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]"
                >
                  <img
                    src={asset(social)}
                    className="h-5 w-5 sm:h-8 sm:w-8"
                    alt=""
                    draggable={false}
                  />
                </div>
              ))}
            </div>
            <div className="font-['Montserrat'] text-base sm:text-lg lg:text-2xl font-medium text-[#1A1A1A]">
              SIGN UP FOR DISCOUNTS + UPDATES
            </div>
            <div className="flex w-full items-center justify-between rounded-2xl bg-[#EDEDED] p-3 sm:p-4">
              <div className="font-['Montserrat'] text-sm sm:text-base lg:text-xl font-medium text-[#6B7280]">
                Phone Number or Email
              </div>
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white">
                <img
                  src={asset('weui_arrow-filled-3.svg')}
                  className="h-4 w-2 sm:h-6 sm:w-3"
                  alt=""
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="font-['Montserrat'] text-sm sm:text-base font-medium text-[#1A1A1A]">
          © 2025 GenZ, LLC. All Rights Reserved.
        </div>
      </div>
    </div>
  )
}
