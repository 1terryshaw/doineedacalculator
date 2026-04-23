import MortgageCalculator from "@/components/MortgageCalculator";
import FadeIn from "@/components/FadeIn";

const tips = [
  {
    title: "How much mortgage can you afford? A quick guide",
    content:
      "Canadian lenders use two key ratios — GDS (Gross Debt Service) and TDS (Total Debt Service) — to decide how much you can borrow. GDS looks at housing costs (mortgage, taxes, heating) as a share of your gross income, capped at 39%. TDS adds all other debts and caps at 44%. Our calculator applies both ceilings automatically, so the number you see is the maximum a lender would consider before reviewing your credit history and employment stability.",
  },
  {
    title: "What is the Canadian mortgage stress test?",
    content:
      "Since 2018, all Canadian mortgage applicants must qualify at a stress-test rate — the higher of their contract rate plus 2%, or the Bank of Canada's qualifying rate (currently 5.25%). This ensures you can still make payments if rates rise. Even if your lender offers you 4.5%, you'd qualify at 6.5%. The stress test applies to purchases, renewals with a new lender, and refinances. Our calculator automatically applies this rule to give you a realistic affordability estimate.",
  },
  {
    title: "How much down payment do you need in Canada?",
    content:
      "The minimum down payment in Canada depends on the purchase price. For homes up to $500,000, you need at least 5%. For the portion between $500,000 and $1,499,999, you need 10%. Homes at $1.5 million or above require 20% down. If your down payment is less than 20%, you must pay CMHC mortgage insurance, which is added to your loan amount. A larger down payment means lower monthly payments and no insurance premium.",
  },
  {
    title: "Should I get a 25- or 30-year mortgage?",
    content:
      "A 25-year amortization is standard in Canada and results in higher monthly payments but significantly less interest paid over the life of the loan. A 30-year amortization lowers your monthly payment, which can help you qualify for a larger mortgage. However, 30-year amortizations are only available with a minimum 20% down payment (insured mortgages are capped at 25 years). Use our calculator to compare both options and see the impact on your affordability.",
  },
  {
    title: "What is CMHC insurance?",
    content:
      "CMHC (Canada Mortgage and Housing Corporation) mortgage insurance protects the lender if you default on your loan. It's required when your down payment is less than 20% of the purchase price. The premium ranges from 2.8% to 4.0% of the mortgage amount, depending on your loan-to-value ratio, and is added to your mortgage balance. While it increases your total borrowing cost, it allows you to buy a home sooner with a smaller down payment.",
  },
];

const faqs = [
  {
    question: "How is mortgage affordability calculated in Canada?",
    answer:
      "Canadian lenders use two ratios: GDS (housing costs / gross income, max 39%) and TDS (housing + all debt / gross income, max 44%). Your maximum mortgage is the amount where both ratios stay within limits at the stress-test rate.",
  },
  {
    question: "What GDS and TDS ratios do banks use?",
    answer:
      "Most Canadian lenders cap GDS at 39% and TDS at 44%, following CMHC guidelines. Some alternative lenders may allow slightly higher ratios with compensating factors like excellent credit or significant assets.",
  },
  {
    question: "What is the mortgage stress test?",
    answer:
      "The stress test requires you to qualify at the higher of your contract rate plus 2% or 5.25% (the Bank of Canada benchmark). This ensures affordability even if interest rates rise after you lock in.",
  },
  {
    question:
      "How much down payment do I need to avoid CMHC insurance?",
    answer:
      "You need a down payment of at least 20% of the purchase price to avoid CMHC mortgage insurance. Below 20%, the insurance premium (2.8%–4.0% of the mortgage) is added to your loan.",
  },
  {
    question: "Can I afford a house making $100,000 per year?",
    answer:
      "With a $100,000 annual income, no other debts, and a 5% down payment, you could typically afford a home around $450,000–$500,000 depending on property taxes and the current interest rate. Use our calculator above for your specific numbers.",
  },
  {
    question: "Is this calculator accurate for pre-approval?",
    answer:
      "This calculator uses the same GDS/TDS formulas and stress-test rules that Canadian lenders apply. However, a formal pre-approval also considers your credit score, employment history, and other factors. Use this as a reliable starting point before speaking with a mortgage broker.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Canadian Mortgage Affordability Calculator",
      url: "https://doineedacalculator.com/mortgage-affordability",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CAD",
      },
      description:
        "Free Canadian mortgage affordability calculator with CMHC stress test. Calculate how much house you can afford based on income, debt, and down payment.",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    },
    {
      "@type": "HowTo",
      name: "How to Calculate Your Mortgage Affordability in Canada",
      step: [
        {
          "@type": "HowToStep",
          name: "Enter your income",
          text: "Enter your annual household income before taxes.",
        },
        {
          "@type": "HowToStep",
          name: "Enter your debts and down payment",
          text: "Add monthly debt payments and how much you have saved for a down payment.",
        },
        {
          "@type": "HowToStep",
          name: "Review your results",
          text: "See your maximum affordable home price, monthly payment, and GDS/TDS ratios with CMHC stress-test math applied.",
        },
      ],
    },
  ],
};

export default function MortgageAffordabilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section
        className="relative py-16 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2563eb, #1e3a5f)",
        }}
      >
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute w-2 h-2 rounded-full bg-white/10 top-[20%] left-[12%]" />
          <div className="absolute w-3 h-3 rounded-full bg-white/[0.07] top-[35%] right-[18%]" />
          <div className="absolute w-2 h-2 rounded-full bg-white/[0.05] top-[65%] left-[30%]" />
          <div className="absolute w-4 h-4 rounded-full bg-white/[0.04] top-[25%] right-[35%]" />
        </div>
        <div className="max-w-4xl mx-auto text-center text-white relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">
            How Much Mortgage Can I Afford in Canada?
          </h1>
          <p
            className="text-lg md:text-xl opacity-90 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            CMHC-compliant stress-test math. Free, instant, and built for
            Canadian buyers.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8">
            <MortgageCalculator />
          </div>
        </div>
      </section>

      {/* Tips */}
      <FadeIn as="section" className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Understanding Mortgage Affordability in Canada
          </h2>
          <div className="space-y-8">
            {tips.map((tip) => (
              <div key={tip.title}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tip.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* FAQ */}
      <FadeIn as="section" className="py-16 px-4" delay={100}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 font-medium hover:bg-gray-50 text-gray-900">
                  {faq.question}
                  <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">
                    &#9662;
                  </span>
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </FadeIn>
    </>
  );
}
