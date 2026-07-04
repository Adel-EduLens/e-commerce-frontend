import { ChevronRight, Mail, MessageSquare, Phone } from 'lucide-react'

function CategoryCard({ title }: { title: string }) {
  return (
    <div className="relative h-32 w-80 overflow-hidden rounded-2xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      <div className="absolute left-[12px] top-[24px] font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
        {title}
      </div>
      <div className="absolute left-[314px] top-[114px] -rotate-180 origin-top-left">
        <div className="relative h-11 w-11 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <div className="absolute left-[16px] top-[8px] h-6 w-3 -rotate-180 overflow-hidden">
            <ChevronRight className="h-6 w-3 text-[#1A1A1A]" />
          </div>
        </div>
      </div>
    </div>
  )
}

function HelpCenterPanel() {
  const categoriesRow1 = [
    'Orders & Shipping',
    'Payments & Wallet',
    'Returns & Refunds',
  ]
  const categoriesRow2 = [
    'Wholesale & Dropshipping',
    'Account & Profile',
    'Technical Issues',
  ]

  return (
    <>
      <div className="absolute left-[378px] top-[138px] inline-flex w-[613px] items-center justify-between">
        <div className="font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
          Help Center
        </div>
      </div>
      <div className="absolute left-[378px] top-[209px] inline-flex w-[613px] items-center justify-between">
        <div className="font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
          Categories
        </div>
      </div>
      <div className="absolute left-[378px] top-[262px] inline-flex items-center justify-start gap-6">
        {categoriesRow1.map((title) => (
          <CategoryCard key={title} title={title} />
        ))}
      </div>
      <div className="absolute left-[378px] top-[416px] inline-flex items-center justify-start gap-6">
        {categoriesRow2.map((title) => (
          <CategoryCard key={title} title={title} />
        ))}
      </div>
      <div className="absolute left-[378px] top-[578px] inline-flex w-[613px] items-center justify-between">
        <div className="font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
          Contact Support
        </div>
      </div>
      <div className="absolute left-[378px] top-[623px] font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
        Need more help?
      </div>
      <div className="absolute left-[378px] top-[667px] inline-flex items-center justify-start gap-4">
        <div className="flex items-center justify-start gap-2 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <MessageSquare className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
          <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            Live Chat
          </div>
        </div>
        <div className="flex items-center justify-start gap-2 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <Mail className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
          <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            Email Us
          </div>
        </div>
        <div className="flex items-center justify-start gap-2 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <Phone className="h-5 w-5 text-[#1A1A1A]" strokeWidth={1.5} />
          <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            Call Center
          </div>
        </div>
      </div>
    </>
  )
}

export default function HelpCenterPage() {
  return <HelpCenterPanel />
}
