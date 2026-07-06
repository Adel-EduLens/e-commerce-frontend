import CollapsibleFAQ from './CollapsibleFAQ'

const asset = (file: string) => `/home-page/${encodeURIComponent(file)}`

function AssetImage({
  file,
  className,
  alt = '',
}: {
  file: string
  className: string
  alt?: string
}) {
  return (
    <img className={className} src={asset(file)} alt={alt} draggable={false} />
  )
}

function FaqSection() {
  const faqs = [
    {
      question: 'Can Cancel at any time ?',
      answer:
        'You can return items within 14 days of receiving your order, as long as they are in their original condition, unused, and with the receipt or proof of purchase. For more details, please visit our "Return Policy" page.',
    },
    {
      question: 'How do I track my order?',
      answer: 'You can track your order from your account page.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide.',
    },
    {
      question: 'How can I contact support?',
      answer: 'You can contact us via email or live chat.',
    },
  ]

  return (
    <div className="mt-16 mb-16 flex w-full flex-col items-start justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        Frequently asked questions
      </div>
      <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
        <AssetImage
          file="image 17.png"
          className="h-[300px] sm:h-[450px] lg:h-[721px] w-full max-w-[566px] rounded-3xl object-cover"
        />
        <div className="flex w-full flex-col items-start justify-start gap-8 lg:flex-1">
          <CollapsibleFAQ faqs={faqs} />
        </div>
      </div>
    </div>
  )
}

export default FaqSection
