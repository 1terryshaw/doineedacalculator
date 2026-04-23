import Link from "next/link";
import {
  Home,
  FileText,
  Hammer,
  HardHat,
  Truck,
  DollarSign,
  BadgeDollarSign,
  Zap,
  MapPin,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import calculatorConfig from "@/lib/calculator-config";

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-8 h-8" />,
  FileText: <FileText className="w-8 h-8" />,
  Hammer: <Hammer className="w-8 h-8" />,
  HardHat: <HardHat className="w-8 h-8" />,
  Truck: <Truck className="w-8 h-8" />,
  DollarSign: <DollarSign className="w-8 h-8" />,
};

const valuePropIcons: Record<string, React.ReactNode> = {
  BadgeDollarSign: <BadgeDollarSign className="w-8 h-8 text-blue-600" />,
  Zap: <Zap className="w-8 h-8 text-blue-600" />,
  MapPin: <MapPin className="w-8 h-8 text-blue-600" />,
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-20 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${calculatorConfig.heroGradientFrom}, ${calculatorConfig.heroGradientTo})`,
        }}
      >
        {/* Floating dots */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute w-2 h-2 rounded-full bg-white/10 top-[15%] left-[10%]" />
          <div className="absolute w-3 h-3 rounded-full bg-white/[0.07] top-[30%] right-[15%]" />
          <div className="absolute w-2 h-2 rounded-full bg-white/[0.05] top-[60%] left-[25%]" />
          <div className="absolute w-4 h-4 rounded-full bg-white/[0.04] top-[20%] right-[30%]" />
          <div className="absolute w-2 h-2 rounded-full bg-white/[0.08] top-[75%] right-[10%]" />
          <div className="absolute w-3 h-3 rounded-full bg-white/[0.06] top-[45%] left-[60%]" />
        </div>

        <div className="max-w-4xl mx-auto text-center text-white relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">
            Find the Right Calculator for Your Decision
          </h1>
          <p
            className="text-lg md:text-xl opacity-90 mb-8 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            {calculatorConfig.description}
          </p>
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/mortgage-affordability"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-blue-900 bg-white hover:bg-blue-50 transition-colors shadow-lg"
            >
              Try Mortgage Affordability Calculator &rarr;
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              &#10003; Free to Use
            </span>
            <span className="flex items-center gap-1.5">
              &#10003; No Sign-Up Required
            </span>
            <span className="flex items-center gap-1.5">
              &#10003; Canadian Math
            </span>
          </div>
        </div>
      </section>

      {/* Calculator Grid */}
      <FadeIn as="section" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculatorConfig.calculators.map((calc) => {
              const isLive = calc.live;
              const CardTag = isLive ? Link : "div";
              return (
                <CardTag
                  key={calc.slug}
                  href={isLive ? `/${calc.slug}` : undefined as never}
                  className={`card-lift block border rounded-xl p-6 bg-white overflow-hidden relative ${
                    isLive
                      ? "hover:border-blue-300 cursor-pointer"
                      : "opacity-60 cursor-default"
                  }`}
                >
                  {/* Gradient top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{
                      background: `linear-gradient(to right, ${calculatorConfig.primaryColor}, transparent)`,
                    }}
                  />
                  <div className="flex items-start gap-4">
                    <div className="text-blue-600 flex-shrink-0 mt-1">
                      {iconMap[calc.icon] || <DollarSign className="w-8 h-8" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {calc.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {calc.description}
                      </p>
                      {isLive ? (
                        <span className="inline-block mt-3 text-sm font-medium text-blue-600">
                          Open Calculator &rarr;
                        </span>
                      ) : (
                        <span className="inline-block mt-3 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </CardTag>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* Value Props */}
      <FadeIn as="section" className="py-16 px-4 bg-white" delay={100}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">
            Why DoINeedACalculator?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {calculatorConfig.valueProps.map((vp) => (
              <div key={vp.title} className="text-center">
                <div className="flex justify-center mb-4">
                  {valuePropIcons[vp.icon] || (
                    <Zap className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {vp.title}
                </h3>
                <p className="text-sm text-gray-600">{vp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Cross-Referrals */}
      <FadeIn as="section" className="py-16 px-4" delay={200}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Need More Than a Calculator?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {calculatorConfig.crossReferrals.map((ref) => (
              <a
                key={ref.name}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift block border rounded-xl p-6 bg-white text-center"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {ref.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {ref.description}
                </p>
                <span className="text-sm font-medium text-blue-600">
                  Visit &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </FadeIn>
    </>
  );
}
