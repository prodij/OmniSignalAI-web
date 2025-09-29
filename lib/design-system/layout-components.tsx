'use client'

import React from 'react'
import { cn } from './utils'
import { Container, Section } from './base-components'

/**
 * Page Layout Component - Ensures consistent page structure
 */
interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
  fullWidth = false
}) => {
  return (
    <main className={cn('min-h-screen', fullWidth ? 'w-full' : '', className)}>
      {children}
    </main>
  )
}

/**
 * Hero Layout Component - Consistent hero section structure
 */
interface HeroLayoutProps {
  children: React.ReactNode
  variant?: 'default' | 'gradient' | 'video' | 'image'
  height?: 'auto' | 'screen' | 'large' | 'medium'
  overlay?: boolean
  className?: string
}

export const HeroLayout: React.FC<HeroLayoutProps> = ({
  children,
  variant = 'gradient',
  height = 'screen',
  overlay = false,
  className
}) => {
  const variantClasses = {
    default: 'bg-white',
    gradient: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700',
    video: 'bg-black relative overflow-hidden',
    image: 'bg-gray-900 relative bg-cover bg-center',
  }

  const heightClasses = {
    auto: 'py-20',
    screen: 'min-h-screen',
    large: 'min-h-[80vh]',
    medium: 'min-h-[60vh]',
  }

  return (
    <Section
      variant="default"
      padding="md"
      className={cn(
        'relative',
        variantClasses[variant],
        heightClasses[height],
        variant === 'gradient' && 'text-white',
        className
      )}
    >
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
      )}
      <Container className="relative z-20 h-full flex items-center">
        {children}
      </Container>
    </Section>
  )
}

/**
 * Two Column Layout Component
 */
interface TwoColumnLayoutProps {
  children: React.ReactNode
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  variant?: 'equal' | 'left-heavy' | 'right-heavy'
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  verticalAlign?: 'top' | 'center' | 'bottom'
  reverseOnMobile?: boolean
  className?: string
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  children,
  leftContent,
  rightContent,
  variant = 'equal',
  gap = 'lg',
  verticalAlign = 'center',
  reverseOnMobile = false,
  className
}) => {
  const variantClasses = {
    equal: 'lg:grid-cols-2',
    'left-heavy': 'lg:grid-cols-3',
    'right-heavy': 'lg:grid-cols-3',
  }

  const gapClasses = {
    sm: 'gap-8',
    md: 'gap-12',
    lg: 'gap-16',
    xl: 'gap-20',
  }

  const alignClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }

  const leftColSpan = variant === 'left-heavy' ? 'lg:col-span-2' : ''
  const rightColSpan = variant === 'right-heavy' ? 'lg:col-span-2' : ''

  return (
    <div className={cn(
      'grid grid-cols-1',
      variantClasses[variant],
      gapClasses[gap],
      alignClasses[verticalAlign],
      reverseOnMobile && 'flex flex-col-reverse lg:grid',
      className
    )}>
      {leftContent && (
        <div className={leftColSpan}>
          {leftContent}
        </div>
      )}
      {rightContent && (
        <div className={rightColSpan}>
          {rightContent}
        </div>
      )}
      {children}
    </div>
  )
}

/**
 * Content Section Layout - Consistent content sections
 */
interface ContentSectionProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  description?: string
  centered?: boolean
  variant?: 'default' | 'primary' | 'secondary' | 'dark'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  headerSpacing?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  children,
  title,
  subtitle,
  description,
  centered = false,
  variant = 'default',
  padding = 'lg',
  maxWidth = 'xl',
  headerSpacing = 'lg',
  className
}) => {
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  }

  const spacingClasses = {
    sm: 'mb-8',
    md: 'mb-12',
    lg: 'mb-16',
  }

  return (
    <Section variant={variant} padding={padding} className={className}>
      <Container className={maxWidthClasses[maxWidth]}>
        {(title || subtitle || description) && (
          <div className={cn(
            spacingClasses[headerSpacing],
            centered && 'text-center'
          )}>
            {subtitle && (
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className={cn(
                'text-3xl md:text-4xl lg:text-5xl font-bold font-heading',
                variant === 'dark' ? 'text-white' : 'text-gray-900',
                centered && 'mx-auto',
                !centered && title.length > 50 && 'max-w-4xl'
              )}>
                {title}
              </h2>
            )}
            {description && (
              <p className={cn(
                'text-lg md:text-xl mt-4',
                variant === 'dark' ? 'text-gray-300' : 'text-gray-600',
                centered ? 'mx-auto max-w-3xl' : 'max-w-4xl'
              )}>
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </Section>
  )
}

/**
 * Feature Grid Layout
 */
interface FeatureGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
  className?: string
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  children,
  columns = 3,
  gap = 'lg',
  responsive = true,
  className
}) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const gapClasses = {
    sm: 'gap-6',
    md: 'gap-8',
    lg: 'gap-10',
    xl: 'gap-12',
  }

  return (
    <div className={cn(
      'grid',
      responsive ? columnClasses[columns] : `grid-cols-${columns}`,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

/**
 * CTA Section Layout
 */
interface CTASectionProps {
  children?: React.ReactNode
  title?: string
  description?: string
  primaryButton?: {
    text: string
    href?: string
    onClick?: () => void
  }
  secondaryButton?: {
    text: string
    href?: string
    onClick?: () => void
  }
  variant?: 'default' | 'gradient' | 'dark'
  centered?: boolean
  className?: string
}

export const CTASection: React.FC<CTASectionProps> = ({
  children,
  title,
  description,
  primaryButton,
  secondaryButton,
  variant = 'gradient',
  centered = true,
  className
}) => {
  const variantClasses = {
    default: 'bg-white',
    gradient: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
    dark: 'bg-gray-900 text-white',
  }

  return (
    <Section padding="xl" className={cn(variantClasses[variant], className)}>
      <Container>
        <div className={cn(
          'max-w-4xl',
          centered && 'mx-auto text-center'
        )}>
          {title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg md:text-xl mb-8 opacity-90">
              {description}
            </p>
          )}

          {(primaryButton || secondaryButton) && (
            <div className={cn(
              'flex gap-4',
              centered ? 'justify-center' : 'justify-start',
              'flex-col sm:flex-row'
            )}>
              {primaryButton && (
                <button
                  onClick={primaryButton.onClick}
                  className={cn(
                    'px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200',
                    variant === 'gradient'
                      ? 'bg-white text-indigo-600 hover:bg-gray-100'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700',
                    'hover:scale-105 shadow-lg hover:shadow-xl'
                  )}
                >
                  {primaryButton.text}
                </button>
              )}
              {secondaryButton && (
                <button
                  onClick={secondaryButton.onClick}
                  className={cn(
                    'px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200',
                    'border-2 border-current hover:bg-white hover:bg-opacity-10'
                  )}
                >
                  {secondaryButton.text}
                </button>
              )}
            </div>
          )}

          {children}
        </div>
      </Container>
    </Section>
  )
}

/**
 * Stats Section Layout
 */
interface StatsSectionProps {
  stats: Array<{
    value: string
    label: string
    description?: string
  }>
  variant?: 'default' | 'dark' | 'primary'
  columns?: 2 | 3 | 4
  centered?: boolean
  className?: string
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  variant = 'default',
  columns = 4,
  centered = true,
  className
}) => {
  const variantClasses = {
    default: 'bg-white',
    dark: 'bg-gray-900 text-white',
    primary: 'bg-indigo-50',
  }

  const columnClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  return (
    <Section variant="default" padding="lg" className={cn(variantClasses[variant], className)}>
      <Container>
        <div className={cn(
          'grid gap-8',
          columnClasses[columns],
          centered && 'text-center'
        )}>
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className={cn(
                'text-3xl md:text-4xl font-bold font-heading',
                variant === 'dark' ? 'text-white' : 'text-indigo-600'
              )}>
                {stat.value}
              </div>
              <div className={cn(
                'text-sm font-semibold uppercase tracking-wide',
                variant === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                {stat.label}
              </div>
              {stat.description && (
                <div className={cn(
                  'text-sm',
                  variant === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {stat.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}