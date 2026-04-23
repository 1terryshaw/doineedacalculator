import Link from "next/link";
import calculatorConfig from "@/lib/calculator-config";
import ShareButtons from "@/components/ShareButtons";

export default function Footer() {
  return (
    <footer
      className="bg-gray-900 text-gray-300 mt-auto"
      style={{
        borderTop: "2px solid transparent",
        borderImage: `linear-gradient(to right, ${calculatorConfig.primaryColor}, transparent) 1`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              {calculatorConfig.name}
            </h3>
            <p className="text-sm">{calculatorConfig.description}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {calculatorConfig.calculators
                .filter((c) => c.live)
                .map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/${c.slug}`}
                      className="hover:text-white transition-colors"
                    >
                      {c.title} Calculator
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">
              Related Resources
            </h4>
            <ul className="space-y-2 text-sm">
              {calculatorConfig.crossReferrals.map((ref) => (
                <li key={ref.name}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {ref.name} &rarr;
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            These calculators provide estimates for informational purposes only.
            They do not constitute financial advice. Consult a qualified
            mortgage broker or financial advisor for personalized guidance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              &copy; {new Date().getFullYear()} {calculatorConfig.name}
            </p>
            <ShareButtons variant="compact" title={calculatorConfig.name} />
          </div>
        </div>
      </div>
    </footer>
  );
}
