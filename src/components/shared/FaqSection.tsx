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
    <div className="mt-16 mb-16 inline-flex w-full flex-col items-start justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-8xl font-bold text-foreground">
        Frequently asked questions
      </div>
      <div className="self-stretch inline-flex items-center justify-between">
        <AssetImage
          file="image 17.png"
          className="h-[721px] w-[566px] rounded-3xl"
        />
        <div className="inline-flex w-[802px] flex-col items-start justify-start gap-8">
          <CollapsibleFAQ faqs={faqs} />
        </div>
      </div>
    </div>
  )
}

export default FaqSection
