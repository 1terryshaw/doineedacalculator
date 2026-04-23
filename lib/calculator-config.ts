export interface CalculatorCard {
  slug: string;
  title: string;
  description: string;
  icon: string;
  live: boolean;
}

export interface CrossReferral {
  name: string;
  url: string;
  description: string;
}

const calculatorConfig = {
  name: "DoINeedACalculator",
  tagline: "Find the Right Calculator for Your Decision",
  description:
    "Fast, free, no-nonsense calculators for life's biggest financial decisions.",
  domain: "doineedacalculator.com",

  primaryColor: "#2563eb", // blue-600
  primaryColorDark: "#1d4ed8", // blue-700
  primaryColorLight: "#eff6ff", // blue-50
  accentColor: "#3b82f6", // blue-500
  heroGradientFrom: "#2563eb",
  heroGradientTo: "#1e3a5f",

  calculators: [
    {
      slug: "mortgage-affordability",
      title: "Mortgage Affordability",
      description:
        "Find out how much house you can afford with Canadian stress-test math.",
      icon: "Home",
      live: true,
    },
    {
      slug: "closing-cost",
      title: "Closing Cost",
      description:
        "Estimate land transfer tax, legal fees, and other closing costs.",
      icon: "FileText",
      live: false,
    },
    {
      slug: "renovation-cost",
      title: "Renovation Cost",
      description:
        "Budget your kitchen, bathroom, or full-home renovation project.",
      icon: "Hammer",
      live: false,
    },
    {
      slug: "roofing-cost",
      title: "Roofing Cost",
      description:
        "Get a ballpark estimate for roof replacement or repair.",
      icon: "HardHat",
      live: false,
    },
    {
      slug: "moving-cost",
      title: "Moving Cost",
      description:
        "Estimate the cost of your local or long-distance move.",
      icon: "Truck",
      live: false,
    },
    {
      slug: "home-affordability",
      title: "Home Affordability",
      description:
        "See what home price fits your budget including all monthly costs.",
      icon: "DollarSign",
      live: false,
    },
  ] as CalculatorCard[],

  crossReferrals: [
    {
      name: "Not Sure Which Pro?",
      url: "https://doineedapro.com",
      description: "Free AI triage to find the right professional.",
    },
    {
      name: "Find a Pro Near You",
      url: "https://getapro.ca",
      description: "Browse verified professionals in your area.",
    },
    {
      name: "Find a Mortgage Broker",
      url: "https://findmymortgagebroker.ca",
      description: "Compare mortgage brokers across Canada.",
    },
  ] as CrossReferral[],

  valueProps: [
    {
      title: "100% Free",
      description: "No sign-up walls, no hidden fees. Just answers.",
      icon: "BadgeDollarSign",
    },
    {
      title: "Instant Results",
      description: "Real math, not guesswork. Get your answer in seconds.",
      icon: "Zap",
    },
    {
      title: "Canadian-First",
      description:
        "Built for Canadian rules — CMHC, stress tests, provincial taxes.",
      icon: "MapPin",
    },
  ],

  provinces: [
    { code: "AB", name: "Alberta" },
    { code: "BC", name: "British Columbia" },
    { code: "MB", name: "Manitoba" },
    { code: "NB", name: "New Brunswick" },
    { code: "NL", name: "Newfoundland and Labrador" },
    { code: "NS", name: "Nova Scotia" },
    { code: "NT", name: "Northwest Territories" },
    { code: "NU", name: "Nunavut" },
    { code: "ON", name: "Ontario" },
    { code: "PE", name: "Prince Edward Island" },
    { code: "QC", name: "Quebec" },
    { code: "SK", name: "Saskatchewan" },
    { code: "YT", name: "Yukon" },
    { code: "Other", name: "Other" },
  ],
};

export default calculatorConfig;
