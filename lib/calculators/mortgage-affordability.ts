export interface MortgageInputs {
  annualIncome: number;
  monthlyDebt: number;
  downPayment: number;
  annualPropertyTax: number;
  monthlyHeating: number;
  interestRate: number;
  amortizationYears: number;
  province?: string;
}

export interface MortgageResult {
  maxHomePrice: number;
  maxMortgage: number;
  monthlyPayment: number;
  stressTestRate: number;
  gdsRatio: number;
  tdsRatio: number;
  breakdown: {
    principal: number;
    propertyTax: number;
    heating: number;
    debt: number;
  };
  cmhcPremium: number;
  cmhcRequired: boolean;
  cmhcPremiumRate: number;
}

const BANK_OF_CANADA_BENCHMARK = 5.25;
const MAX_GDS = 0.39;
const MAX_TDS = 0.44;

/**
 * Get CMHC insurance premium rate based on down payment percentage.
 * Rates effective as of 2024 CMHC schedule.
 */
function getCMHCPremiumRate(downPaymentPercent: number): number {
  if (downPaymentPercent >= 20) return 0;
  if (downPaymentPercent >= 15) return 0.028; // 2.80%
  if (downPaymentPercent >= 10) return 0.031; // 3.10%
  if (downPaymentPercent >= 5) return 0.04; // 4.00%
  return 0; // Below 5% — not allowed, but handle gracefully
}

/**
 * Calculate monthly mortgage payment using standard amortization formula.
 * PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  amortizationYears: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const n = amortizationYears * 12;
  if (monthlyRate === 0) return principal / n;
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
    (Math.pow(1 + monthlyRate, n) - 1)
  );
}

/**
 * Calculate max loan amount given a monthly payment, rate, and amortization.
 * PV = PMT * [(1 - (1+r)^-n) / r]
 */
function calculateMaxLoan(
  monthlyPayment: number,
  annualRate: number,
  amortizationYears: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const n = amortizationYears * 12;
  if (monthlyRate === 0) return monthlyPayment * n;
  return (
    monthlyPayment *
    ((1 - Math.pow(1 + monthlyRate, -n)) / monthlyRate)
  );
}

export function calculateMortgageAffordability(
  inputs: MortgageInputs
): MortgageResult | null {
  const {
    annualIncome,
    monthlyDebt,
    downPayment,
    annualPropertyTax,
    monthlyHeating,
    interestRate,
    amortizationYears,
  } = inputs;

  const grossMonthlyIncome = annualIncome / 12;

  // Stress test: higher of (contract rate + 2%) or BoC benchmark
  const stressTestRate = Math.max(
    interestRate + 2,
    BANK_OF_CANADA_BENCHMARK
  );

  const monthlyPropertyTax = annualPropertyTax / 12;

  // Max monthly mortgage payment from GDS ceiling
  const maxPaymentGDS =
    grossMonthlyIncome * MAX_GDS - monthlyPropertyTax - monthlyHeating;

  // Max monthly mortgage payment from TDS ceiling
  const maxPaymentTDS =
    grossMonthlyIncome * MAX_TDS -
    monthlyPropertyTax -
    monthlyHeating -
    monthlyDebt;

  // Binding constraint is the lower of the two
  const maxMonthlyPayment = Math.min(maxPaymentGDS, maxPaymentTDS);

  if (maxMonthlyPayment <= 0) return null;

  // Max loan amount qualifying at the stress-test rate
  const maxLoanAtStress = calculateMaxLoan(
    maxMonthlyPayment,
    stressTestRate,
    amortizationYears
  );

  // Iteratively solve for home price considering CMHC insurance.
  // CMHC premium is added to the mortgage, so the total insured mortgage
  // must fit within maxLoanAtStress.
  let homePrice = maxLoanAtStress + downPayment;

  for (let i = 0; i < 20; i++) {
    const mortgage = homePrice - downPayment;
    if (mortgage <= 0) break;

    const downPct = (downPayment / homePrice) * 100;
    const premiumRate = getCMHCPremiumRate(downPct);

    // totalLoan = mortgage * (1 + premiumRate) must equal maxLoanAtStress
    const actualMortgage = maxLoanAtStress / (1 + premiumRate);
    const newHomePrice = actualMortgage + downPayment;

    if (Math.abs(newHomePrice - homePrice) < 1) break;
    homePrice = newHomePrice;
  }

  homePrice = Math.floor(homePrice);

  const mortgage = homePrice - downPayment;
  if (mortgage <= 0) return null;

  const downPct = (downPayment / homePrice) * 100;
  const cmhcPremiumRate = getCMHCPremiumRate(downPct);
  const cmhcPremium = Math.round(mortgage * cmhcPremiumRate);
  const totalMortgage = mortgage + cmhcPremium;
  const cmhcRequired = cmhcPremiumRate > 0;

  // Monthly payment at the actual contract rate (not stress test)
  const monthlyPayment = calculateMonthlyPayment(
    totalMortgage,
    interestRate,
    amortizationYears
  );

  // Actual GDS/TDS ratios at contract rate
  const gdsRatio =
    (monthlyPayment + monthlyPropertyTax + monthlyHeating) /
    grossMonthlyIncome;
  const tdsRatio =
    (monthlyPayment + monthlyPropertyTax + monthlyHeating + monthlyDebt) /
    grossMonthlyIncome;

  return {
    maxHomePrice: homePrice,
    maxMortgage: totalMortgage,
    monthlyPayment: Math.round(monthlyPayment),
    stressTestRate,
    gdsRatio,
    tdsRatio,
    breakdown: {
      principal: Math.round(monthlyPayment),
      propertyTax: Math.round(monthlyPropertyTax),
      heating: Math.round(monthlyHeating),
      debt: Math.round(monthlyDebt),
    },
    cmhcPremium,
    cmhcRequired,
    cmhcPremiumRate,
  };
}
