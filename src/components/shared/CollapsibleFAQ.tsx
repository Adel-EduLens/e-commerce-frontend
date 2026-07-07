import { useState } from "react";

export type FAQItem = {
  question: string;
  answer: string;
};

const asset = (file: string) =>
  `/dropshipping/${file.split("/").map(encodeURIComponent).join("/")}`;

export default function CollapsibleFAQ({
  faqs,
  defaultOpenIndex = 0,
}: {
  faqs: FAQItem[];
  defaultOpenIndex?: number;
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  return (
    <div className="flex flex-col gap-8">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={`${faq.question}-${index}`}
            className={`rounded-2xl p-4 sm:rounded-3xl sm:p-8 transition-colors duration-300 ${
              isOpen ? "bg-[#1C1B2E]" : "bg-gray-light"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between"
            >
              <h3
                className={`text-base sm:text-xl lg:text-2xl font-medium text-start ${
                  isOpen ? "text-primary" : "text-foreground"
                }`}
              >
                {faq.question}
              </h3>

              <div
                className={`rounded-full bg-white p-3 transition-transform duration-300 ${
                  isOpen ? "rotate-90" : ""
                }`}
              >
                <img
                  src={asset("weui_arrow-filled.svg")}
                  className="h-6 w-3"
                  alt=""
                  draggable={false}
                />
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "mt-6 max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className={`text-sm sm:text-base lg:text-xl ${isOpen ? "text-white" : "text-foreground"}`}>
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
