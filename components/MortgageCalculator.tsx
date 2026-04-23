'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Calculator, RotateCcw, ArrowRight, Lock, Mail } from 'lucide-react';
import {
  calculateMortgageAffordability,
  type MortgageInputs,
  type MortgageResult,
} from '@/lib/calculators/mortgage-affordability';
import { captureLead } from '@/app/actions/capture-lead';
import calculatorConfig from '@/lib/calculator-config';
import AdSense from '@/components/AdSense';

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatPercent(n: number): string {
  return (n * 100).toFixed(1) + '%';
}

const initialInputs: MortgageInputs = {
  annualIncome: 0,
  monthlyDebt: 0,
  downPayment: 0,
  annualPropertyTax: 5000,
  monthlyHeating: 150,
  interestRate: 5.5,
  amortizationYears: 25,
  province: '',
};

export default function MortgageCalculator() {
  const [inputs, setInputs] = useState<MortgageInputs>(initialInputs);
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [calculated, setCalculated] = useState(false);
  const [emailUnlocked, setEmailUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const updateInput = useCallback(
    (field: keyof MortgageInputs, value: string) => {
      setInputs((prev) => {
        if (field === 'province') return { ...prev, province: value };
        if (field === 'amortizationYears')
          return { ...prev, amortizationYears: parseInt(value) || 25 };
        // Strip non-numeric chars for currency/percent fields
        const cleaned = value.replace(/[^0-9.]/g, '');
        const num = parseFloat(cleaned) || 0;
        return { ...prev, [field]: num };
      });
      // Clear validation error for this field
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (!inputs.annualIncome || inputs.annualIncome <= 0) {
      errors.annualIncome = 'Enter your annual household income';
    }
    if (!inputs.downPayment || inputs.downPayment <= 0) {
      errors.downPayment = 'Enter your down payment amount';
    }
    if (inputs.interestRate <= 0 || inputs.interestRate > 20) {
      errors.interestRate = 'Enter a valid interest rate (e.g. 5.5)';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [inputs]);

  const handleCalculate = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setShowSpinner(true);
      // Brief spinner for UX authority
      setTimeout(() => {
        const res = calculateMortgageAffordability(inputs);
        setResult(res);
        setCalculated(true);
        setShowSpinner(false);
      }, 800);
    },
    [inputs, validate]
  );

  const handleReset = useCallback(() => {
    setInputs(initialInputs);
    setResult(null);
    setCalculated(false);
    setEmailUnlocked(false);
    setEmail('');
    setEmailError('');
    setValidationErrors({});
  }, []);

  const handleEmailSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address');
        return;
      }

      setEmailSubmitting(true);
      setEmailError('');

      const res = await captureLead({
        email,
        calculatorSlug: 'mortgage-affordability',
        inputSnapshot: inputs as unknown as Record<string, unknown>,
        resultSnapshot: (result || {}) as unknown as Record<string, unknown>,
      });

      setEmailSubmitting(false);

      if (res.success) {
        setEmailUnlocked(true);
      } else {
        setEmailError(res.error || 'Something went wrong');
      }
    },
    [email, inputs, result]
  );

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div>
      {/* Calculator Form */}
      <form onSubmit={handleCalculate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Annual Income */}
          <div>
            <label htmlFor="annualIncome" className={labelClass}>
              Annual Household Income *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                id="annualIncome"
                type="text"
                inputMode="numeric"
                placeholder="100,000"
                value={inputs.annualIncome || ''}
                onChange={(e) => updateInput('annualIncome', e.target.value)}
                className={`${inputClass} pl-8 ${validationErrors.annualIncome ? 'border-red-400' : ''}`}
              />
            </div>
            {validationErrors.annualIncome && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.annualIncome}</p>
            )}
          </div>

          {/* Monthly Debt */}
          <div>
            <label htmlFor="monthlyDebt" className={labelClass}>
              Monthly Debt Payments
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                id="monthlyDebt"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={inputs.monthlyDebt || ''}
                onChange={(e) => updateInput('monthlyDebt', e.target.value)}
                className={`${inputClass} pl-8`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Credit cards, car loans, student loans, etc.
            </p>
          </div>

          {/* Down Payment */}
          <div>
            <label htmlFor="downPayment" className={labelClass}>
              Down Payment Saved *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                id="downPayment"
                type="text"
                inputMode="numeric"
                placeholder="50,000"
                value={inputs.downPayment || ''}
                onChange={(e) => updateInput('downPayment', e.target.value)}
                className={`${inputClass} pl-8 ${validationErrors.downPayment ? 'border-red-400' : ''}`}
              />
            </div>
            {validationErrors.downPayment && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.downPayment}</p>
            )}
          </div>

          {/* Property Tax */}
          <div>
            <label htmlFor="annualPropertyTax" className={labelClass}>
              Annual Property Tax Estimate
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                id="annualPropertyTax"
                type="text"
                inputMode="numeric"
                placeholder="5,000"
                value={inputs.annualPropertyTax || ''}
                onChange={(e) => updateInput('annualPropertyTax', e.target.value)}
                className={`${inputClass} pl-8`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Typically 0.5&ndash;1.5% of home value
            </p>
          </div>

          {/* Heating */}
          <div>
            <label htmlFor="monthlyHeating" className={labelClass}>
              Monthly Heating Cost Estimate
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                id="monthlyHeating"
                type="text"
                inputMode="numeric"
                placeholder="150"
                value={inputs.monthlyHeating || ''}
                onChange={(e) => updateInput('monthlyHeating', e.target.value)}
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label htmlFor="interestRate" className={labelClass}>
              Mortgage Interest Rate
            </label>
            <div className="relative">
              <input
                id="interestRate"
                type="text"
                inputMode="decimal"
                placeholder="5.5"
                value={inputs.interestRate || ''}
                onChange={(e) => updateInput('interestRate', e.target.value)}
                className={`${inputClass} pr-8 ${validationErrors.interestRate ? 'border-red-400' : ''}`}
              />
              <span className="absolute right-3 top-3 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Current 5-year fixed rate in Canada
            </p>
            {validationErrors.interestRate && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.interestRate}</p>
            )}
          </div>

          {/* Amortization */}
          <div>
            <label htmlFor="amortizationYears" className={labelClass}>
              Amortization Period
            </label>
            <select
              id="amortizationYears"
              value={inputs.amortizationYears}
              onChange={(e) => updateInput('amortizationYears', e.target.value)}
              className={inputClass}
            >
              <option value="25">25 years</option>
              <option value="30">30 years</option>
            </select>
          </div>

          {/* Province */}
          <div>
            <label htmlFor="province" className={labelClass}>
              Province (optional)
            </label>
            <select
              id="province"
              value={inputs.province}
              onChange={(e) => updateInput('province', e.target.value)}
              className={inputClass}
            >
              <option value="">Select province...</option>
              {calculatorConfig.provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={showSpinner}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Calculator className="w-5 h-5" />
            {showSpinner ? 'Calculating...' : 'Calculate Affordability'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </form>

      {/* Loading Spinner */}
      {showSpinner && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">
            Crunching the numbers with CMHC stress-test math...
          </p>
        </div>
      )}

      {/* AdSense between form and result */}
      {calculated && !showSpinner && (
        <div className="no-print">
          <AdSense />
        </div>
      )}

      {/* Results */}
      {calculated && !showSpinner && (
        <div className="mt-8">
          {result === null ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to Calculate
              </h3>
              <p className="text-sm text-red-600">
                Based on your inputs, the monthly housing costs exceed
                allowable GDS/TDS ratios. Try increasing your income, reducing
                debt payments, or adjusting other inputs.
              </p>
            </div>
          ) : (
            <>
              {/* Email Gate */}
              {!emailUnlocked && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Your results are ready!
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter your email to see your full affordability breakdown.
                  </p>
                  <form
                    onSubmit={handleEmailSubmit}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError('');
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={emailSubmitting}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {emailSubmitting ? 'Saving...' : 'Show My Results'}
                    </button>
                  </form>
                  {emailError && (
                    <p className="text-red-500 text-xs mt-2">{emailError}</p>
                  )}
                </div>
              )}

              {/* Result Cards — blurred until email entered */}
              <div className={emailUnlocked ? 'result-clear' : 'result-blur'}>
                {/* Hero Number */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white text-center mb-6">
                  <p className="text-sm opacity-80 mb-1">
                    Maximum Affordable Home Price
                  </p>
                  <p className="text-4xl md:text-5xl font-bold">
                    {formatCurrency(result.maxHomePrice)}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white border rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      Maximum Mortgage
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(result.maxMortgage)}
                    </p>
                  </div>
                  <div className="bg-white border rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      Monthly Payment
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(result.monthlyPayment)}
                    </p>
                  </div>
                  <div className="bg-white border rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">GDS Ratio</p>
                    <p className={`text-lg font-bold ${result.gdsRatio > 0.39 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatPercent(result.gdsRatio)}
                    </p>
                  </div>
                  <div className="bg-white border rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">TDS Ratio</p>
                    <p className={`text-lg font-bold ${result.tdsRatio > 0.44 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatPercent(result.tdsRatio)}
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-white border rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Monthly Cost Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Mortgage Payment (Principal + Interest)
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(result.breakdown.principal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Property Tax</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(result.breakdown.propertyTax)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Heating</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(result.breakdown.heating)}
                      </span>
                    </div>
                    {result.breakdown.debt > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Other Debt Payments
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(result.breakdown.debt)}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between text-sm font-semibold">
                      <span>Total Monthly Housing Cost</span>
                      <span>
                        {formatCurrency(
                          result.breakdown.principal +
                            result.breakdown.propertyTax +
                            result.breakdown.heating +
                            result.breakdown.debt
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white border rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Stress-Test Qualifying Rate
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {result.stressTestRate}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Higher of contract rate + 2% or 5.25%
                    </p>
                  </div>
                  <div className="bg-white border rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      CMHC Insurance
                    </p>
                    {result.cmhcRequired ? (
                      <>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(result.cmhcPremium)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Premium rate: {(result.cmhcPremiumRate * 100).toFixed(1)}%
                          (added to mortgage)
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-bold text-green-600">
                          Not Required
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Down payment is 20% or more
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Lead-Forward CTA */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center no-print">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Not sure about rates? Compare mortgage brokers in your area.
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get personalized quotes from verified Canadian mortgage
                    brokers.
                  </p>
                  <a
                    href="https://findmymortgagebroker.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Find a Mortgage Broker
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Cross-sell */}
                <div className="mt-4 text-center no-print">
                  <p className="text-sm text-gray-500">
                    Also calculate:{' '}
                    <span className="text-blue-600 font-medium">
                      Closing Cost Calculator
                    </span>{' '}
                    &rarr;{' '}
                    <span className="text-xs text-gray-400">Coming soon</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
