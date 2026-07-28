import { useState } from "react";
import { ChevronRight } from "lucide-react";

export type FAQItem = {
  question: string;
  answer: string;
};

export default function CollapsibleFAQ({
  faqs,
  defaultOpenIndex = 0,
}: {
  faqs: FAQItem[];
  defaultOpenIndex?: number;
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  return (
    <div className="flex flex-col gap-8 w-full">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={`${faq.question}-${index}`}
            className="rounded-2xl p-4 sm:rounded-3xl sm:p-8 bg-gray-light transition-colors duration-300"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between cursor-pointer text-start gap-4"
            >
              <h3
                className={`text-base sm:text-xl lg:text-2xl font-medium transition-colors duration-300 ${
                  isOpen ? "text-primary" : "text-foreground"
                }`}
              >
                {faq.question}
              </h3>

              <div
                className={`rounded-full bg-card p-3 transition-transform duration-300 flex items-center justify-center shrink-0 ${
                  isOpen ? "rotate-90" : ""
                }`}
              >
                <ChevronRight className="h-6 w-6 text-foreground transition-colors" />
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "mt-6 max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-sm sm:text-base lg:text-xl text-gray-text leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
