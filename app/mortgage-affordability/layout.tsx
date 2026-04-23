import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Mortgage Affordability Calculator Canada — How Much Mortgage Can I Afford?",
  description:
    "Canadian mortgage affordability calculator with CMHC stress test. Find out how much house you can afford based on your income, debt, and down payment. Free, instant, and no signup required to start.",
  openGraph: {
    title:
      "Mortgage Affordability Calculator Canada — How Much Mortgage Can I Afford? | DoINeedACalculator.com",
    description:
      "Canadian mortgage affordability calculator with CMHC stress test. Find out how much house you can afford based on your income, debt, and down payment.",
    url: "https://doineedacalculator.com/mortgage-affordability",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Mortgage Affordability Calculator Canada | DoINeedACalculator.com",
    description:
      "Canadian mortgage affordability calculator with CMHC stress test. Free, instant, and no signup required.",
  },
  alternates: {
    canonical: "https://doineedacalculator.com/mortgage-affordability",
  },
};

export default function MortgageAffordabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
