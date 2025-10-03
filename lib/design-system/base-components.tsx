'use client'

import React, { useId } from 'react'
import { cn, styleGenerators, animations, focus } from './utils'

/**
 * Base Button Component with consistent styling
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    disabled,
    ...props
  }, ref) => {
    return (
      <button
        className={cn(
          styleGenerators.button(variant, size),
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          animations.hoverScale,
          focus.ring,
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

/**
 * Base Card Component
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', interactive = false, children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          styleGenerators.card(variant),
          paddingClasses[padding],
          interactive && cn(animations.hoverLift, 'cursor-pointer'),
          focus.ring,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

/**
 * Base Input Component
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error'
  inputSize?: 'sm' | 'md' | 'lg'
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant = 'default',
    inputSize = 'md',
    label,
    error,
    leftIcon,
    rightIcon,
    type = 'text',
    id,
    ...props
  }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId
    const errorVariant = error ? 'error' : variant

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{leftIcon}</span>
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={cn(
              styleGenerators.input(errorVariant, inputSize),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

/**
 * Base Badge Component
 */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          styleGenerators.badge(variant, size),
          className
        )}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"

/**
 * Base Select Component
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'error'
  selectSize?: 'sm' | 'md' | 'lg'
  label?: string
  error?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    variant = 'default',
    selectSize = 'md',
    label,
    error,
    id,
    children,
    ...props
  }, ref) => {
    const generatedId = useId()
    const selectId = id || generatedId
    const errorVariant = error ? 'error' : variant

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    }

    const variantClasses = {
      default: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'block w-full rounded-md border shadow-sm transition-colors',
            'focus:outline-none focus:ring-2',
            sizeClasses[selectSize],
            variantClasses[errorVariant],
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

/**
 * Base Textarea Component
 */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error'
  textareaSize?: 'sm' | 'md' | 'lg'
  label?: string
  error?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    variant = 'default',
    textareaSize = 'md',
    label,
    error,
    resize = 'vertical',
    id,
    ...props
  }, ref) => {
    const generatedId = useId()
    const textareaId = id || generatedId
    const errorVariant = error ? 'error' : variant

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    }

    const variantClasses = {
      default: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    }

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'block w-full rounded-md border shadow-sm transition-colors',
            'focus:outline-none focus:ring-2',
            sizeClasses[textareaSize],
            variantClasses[errorVariant],
            resizeClasses[resize],
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

/**
 * Base Container Component
 */
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'xl', padding = 'md', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      full: 'max-w-full',
    }

    const paddingClasses = {
      none: '',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full',
          sizeClasses[size],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Container.displayName = "Container"

/**
 * Base Section Component
 */
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'dark'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  fullHeight?: boolean
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'default', padding = 'lg', fullHeight = false, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white',
      primary: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      secondary: 'bg-gray-50',
      dark: 'bg-gray-900 text-white',
    }

    const paddingClasses = {
      sm: 'py-12',
      md: 'py-16',
      lg: 'py-20',
      xl: 'py-24',
    }

    return (
      <section
        ref={ref}
        className={cn(
          variantClasses[variant],
          paddingClasses[padding],
          fullHeight && 'min-h-screen flex items-center',
          className
        )}
        {...props}
      >
        {children}
      </section>
    )
  }
)
Section.displayName = "Section"

/**
 * Base Grid Component
 */
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  }
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 'md', responsive, children, ...props }, ref) => {
    const gapClasses = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
    }

    const getColClass = (colCount: number) => {
      const colMap = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        12: 'grid-cols-12',
      }
      return colMap[colCount as keyof typeof colMap]
    }

    const responsiveClasses = responsive ? [
      responsive.sm && `sm:${getColClass(responsive.sm)}`,
      responsive.md && `md:${getColClass(responsive.md)}`,
      responsive.lg && `lg:${getColClass(responsive.lg)}`,
      responsive.xl && `xl:${getColClass(responsive.xl)}`,
    ].filter(Boolean).join(' ') : ''

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          getColClass(cols),
          gapClasses[gap],
          responsiveClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Grid.displayName = "Grid"

/**
 * Base Typography Components
 */
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'error'
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = 'h2', size = 'lg', weight = 'bold', color = 'default', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '7xl': 'text-7xl',
    }

    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    }

    const colorClasses = {
      default: 'text-gray-900',
      muted: 'text-gray-600',
      primary: 'text-indigo-600',
      secondary: 'text-purple-600',
      error: 'text-red-600',
    }

    return (
      <Component
        ref={ref}
        className={cn(
          'font-heading leading-tight',
          sizeClasses[size],
          weightClasses[weight],
          colorClasses[color],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Heading.displayName = "Heading"

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  as?: 'p' | 'span' | 'div'
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, as: Component = 'p', size = 'base', weight = 'normal', color = 'default', children, ...props }, ref) => {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    }

    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    }

    const colorClasses = {
      default: 'text-gray-900',
      muted: 'text-gray-600',
      primary: 'text-indigo-600',
      secondary: 'text-purple-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
    }

    return (
      <Component
        ref={ref}
        className={cn(
          'leading-relaxed',
          sizeClasses[size],
          weightClasses[weight],
          colorClasses[color],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Text.displayName = "Text"