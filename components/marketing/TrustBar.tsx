'use client'

import { Text } from '@/lib/design-system'

// Placeholder company logos - these represent the types of companies using the product
// In production, replace with actual customer logos
const trustedCompanies = [
  { name: 'TechCorp', industry: 'SaaS' },
  { name: 'GrowthLabs', industry: 'Marketing Agency' },
  { name: 'Scale Ventures', industry: 'B2B SaaS' },
  { name: 'Digital Pro', industry: 'Consulting' },
  { name: 'CloudSystems', industry: 'Enterprise Tech' },
  { name: 'InnovateCo', industry: 'Startup' },
]

export function TrustBar() {
  return (
    <section className="bg-white border-t border-b border-gray-200 py-12">
      <div className="mx-auto w-full max-w-screen-xl px-6">
        <div className="text-center mb-8">
          <Text size="sm" color="muted" weight="medium" className="uppercase tracking-wide">
            Trusted by 500+ growing companies
          </Text>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {trustedCompanies.map((company, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              {/* Placeholder for company logo - in production replace with actual logos */}
              <div className="w-full h-12 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                <Text size="sm" weight="semibold" className="text-gray-600">
                  {company.name}
                </Text>
              </div>
              <Text size="xs" color="muted" className="mt-2">
                {company.industry}
              </Text>
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <Text size="sm" color="muted">
              12M+ posts generated
            </Text>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <Text size="sm" color="muted">
              4.9/5 average rating
            </Text>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <Text size="sm" color="muted">
              89% engagement improvement
            </Text>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <Text size="sm" color="muted">
              SOC 2 Type II Certified
            </Text>
          </div>
        </div>
      </div>
    </section>
  )
}