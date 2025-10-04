"use client"

import { useState } from 'react'
import { Text } from '@/lib/design-system'
import { Calculator, TrendingUp, DollarSign } from 'lucide-react'

/**
 * ROICalculator Component
 *
 * Strategic Purpose: Reframe price as investment with immediate ROI proof
 * Psychology: Turn objection ("too expensive") into desire ("this pays for itself")
 * Placement: Inside PricingSection, after pricing tiers
 *
 * Key Insight: If they spend 8 hours/week at $50/hr = $1,600/month
 *              Professional plan at $79/month = $1,521/month savings
 *              ROI is immediate and undeniable
 */

export const ROICalculator = () => {
  const [hoursPerWeek, setHoursPerWeek] = useState(8)
  const [hourlyRate, setHourlyRate] = useState(50)

  // Calculations
  const monthlyTimeCost = hoursPerWeek * 4 * hourlyRate
  const omnisignalCost = 79 // Professional plan
  const monthlySavings = monthlyTimeCost - omnisignalCost
  const annualSavings = monthlySavings * 12
  const timesSaved = Math.floor(monthlyTimeCost / omnisignalCost)

  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl border-2 border-green-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-6 h-6 text-white" />
            <Text className="text-2xl font-bold text-white">
              Calculate Your ROI
            </Text>
          </div>
          <Text className="text-green-100">
            See how much you'll save every month with OmniSignalAI
          </Text>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Input: Hours per week */}
            <div>
              <label className="block mb-3">
                <Text className="font-semibold text-gray-900 mb-2">
                  Hours spent on content creation per week
                </Text>
                <div className="relative">
                  <input
                    type="range"
                    min="2"
                    max="40"
                    step="1"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between mt-2">
                    <Text className="text-xs text-gray-500">2 hrs</Text>
                    <Text className="text-xs text-gray-500">40 hrs</Text>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <Text className="text-3xl font-bold text-green-600">
                    {hoursPerWeek} hours
                  </Text>
                  <Text className="text-sm text-gray-600">per week</Text>
                </div>
              </label>
            </div>

            {/* Input: Hourly rate */}
            <div>
              <label className="block mb-3">
                <Text className="font-semibold text-gray-900 mb-2">
                  Your hourly rate (or cost)
                </Text>
                <div className="relative">
                  <input
                    type="range"
                    min="25"
                    max="200"
                    step="5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between mt-2">
                    <Text className="text-xs text-gray-500">$25/hr</Text>
                    <Text className="text-xs text-gray-500">$200/hr</Text>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <Text className="text-3xl font-bold text-green-600">
                    ${hourlyRate}/hr
                  </Text>
                  <Text className="text-sm text-gray-600">hourly value</Text>
                </div>
              </label>
            </div>
          </div>

          {/* Calculation Results */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Cost */}
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <DollarSign className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <Text className="text-sm text-gray-600 mb-1">Current Monthly Cost</Text>
                <Text className="text-3xl font-bold text-red-600">
                  ${monthlyTimeCost.toLocaleString()}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {hoursPerWeek * 4} hours × ${hourlyRate}/hr
                </Text>
              </div>

              {/* OmniSignalAI Cost */}
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <Text className="text-sm text-gray-600 mb-1">OmniSignalAI Cost</Text>
                <Text className="text-3xl font-bold text-blue-600">
                  ${omnisignalCost}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Professional Plan/month
                </Text>
              </div>

              {/* Monthly Savings */}
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <Text className="text-sm text-gray-600 mb-1">Monthly Savings</Text>
                <Text className="text-3xl font-bold text-green-600">
                  ${monthlySavings.toLocaleString()}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {timesSaved}x return on investment
                </Text>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Text className="text-green-100 text-sm mb-2">Annual Savings</Text>
                <Text className="text-4xl font-bold mb-1">
                  ${annualSavings.toLocaleString()}
                </Text>
                <Text className="text-green-100 text-sm">
                  That's a new team member's salary
                </Text>
              </div>
              <div>
                <Text className="text-green-100 text-sm mb-2">Time Saved</Text>
                <Text className="text-4xl font-bold mb-1">
                  {hoursPerWeek * 52} hours
                </Text>
                <Text className="text-green-100 text-sm">
                  per year (that's {Math.floor((hoursPerWeek * 52) / 40)} work weeks!)
                </Text>
              </div>
            </div>
          </div>

          {/* Value Statements */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
              <div>
                <Text className="font-semibold text-gray-900 mb-1">
                  Pays for itself in Week 1
                </Text>
                <Text className="text-sm text-gray-600">
                  First month savings: ${monthlySavings.toLocaleString()}. That's {timesSaved}x your investment.
                </Text>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
              <div>
                <Text className="font-semibold text-gray-900 mb-1">
                  Risk-free to try
                </Text>
                <Text className="text-sm text-gray-600">
                  14-day free trial. If you don't save 10+ hours in your first month, full refund.
                </Text>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Start Saving ${monthlySavings.toLocaleString()}/Month - Free Trial
            </button>
            <Text className="text-xs text-gray-500 mt-3">
              No credit card required • Cancel anytime • Setup in 2 minutes
            </Text>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 text-center">
        <Text className="text-xs text-gray-500">
          Calculations based on industry averages. Your actual savings may vary based on usage and workflow efficiency.
        </Text>
      </div>
    </div>
  )
}
