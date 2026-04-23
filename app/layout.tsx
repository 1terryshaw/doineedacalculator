import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import Footer from "@/components/Footer";
import calculatorConfig from "@/lib/calculator-config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "DoINeedACalculator.com — Free Calculators for Big Decisions",
    template: "%s | DoINeedACalculator.com",
  },
  description:
    "Fast, free, no-nonsense calculators for life's biggest financial decisions. Mortgage affordability, renovation costs, closing costs, and more.",
  metadataBase: new URL("https://doineedacalculator.com"),
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://doineedacalculator.com",
    siteName: "DoINeedACalculator.com",
    title: "DoINeedACalculator.com — Free Calculators for Big Decisions",
    description:
      "Fast, free, no-nonsense calculators for life's biggest financial decisions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoINeedACalculator.com — Free Calculators for Big Decisions",
    description:
      "Fast, free, no-nonsense calculators for life's biggest financial decisions.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-PLACEHOLDER"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span
                className="text-xl font-bold"
                style={{ color: calculatorConfig.primaryColor }}
              >
                DoINeedACalculator
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Beta
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
              {calculatorConfig.calculators
                .filter((c) => c.live)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {c.title}
                  </Link>
                ))}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
