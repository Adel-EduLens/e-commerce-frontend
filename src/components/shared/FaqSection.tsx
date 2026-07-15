import { useTranslation } from 'react-i18next'
import CollapsibleFAQ from './CollapsibleFAQ'
import { asset } from '../../lib/utils';
import { usePublicFAQs } from '../../hooks/queries/faqQuery';
import LoadingSpinner from './LoadingSpinner';

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
  const { t } = useTranslation("dropshipping");
  const { data: apiFaqs, isLoading } = usePublicFAQs();

  const fallbackFaqs = [
    {
      question: t("faq.items.cancel.question", "Can I cancel at any time?"),
      answer: t(
        "faq.items.cancel.answer",
        'You can return items within 14 days of receiving your order, as long as they are in their original condition, unused, and with the receipt or proof of purchase.'
      ),
    },
    {
      question: t("faq.items.trackOrder.question", "How do I track my order?"),
      answer: t("faq.items.trackOrder.answer", "You can track your order from your account page."),
    },
    {
      question: t("faq.items.internationalShipping.question", "Do you ship internationally?"),
      answer: t("faq.items.internationalShipping.answer", "Yes, we ship to most countries worldwide."),
    },
    {
      question: t("faq.items.contactSupport.question", "How can I contact support?"),
      answer: t("faq.items.contactSupport.answer", "You can contact us via email or live chat."),
    },
  ];

  const faqs = apiFaqs && apiFaqs.length > 0 ? apiFaqs.slice(0, 4) : fallbackFaqs;

  return (
    <div className="mt-16 mb-16 flex w-full flex-col items-start justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground">
        {t("faq.title", "Frequently asked questions")}
      </div>
      <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
        <AssetImage
          file="image 17.png"
          className="h-[300px] sm:h-[450px] lg:h-[721px] w-full max-w-[566px] rounded-3xl object-cover"
        />
        <div className="flex w-full flex-col items-start justify-start gap-8 lg:flex-1">
          {isLoading ? (
            <LoadingSpinner containerClassName="py-12" />
          ) : (
            <CollapsibleFAQ faqs={faqs} />
          )}
        </div>
      </div>
    </div>
  )
}

export default FaqSection
