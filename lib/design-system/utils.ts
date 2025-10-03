import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { colors, spacing, typography, radius, shadows, durations, easings } from './constants'

/**
 * Utility for merging Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Type-safe color utilities
 */
export const colorUtils = {
  primary: (opacity?: number) =>
    opacity ? `rgb(99 102 241 / ${opacity})` : colors.brand.primary,
  secondary: (opacity?: number) =>
    opacity ? `rgb(168 85 247 / ${opacity})` : colors.brand.secondary,
  accent: (opacity?: number) =>
    opacity ? `rgb(34 211 238 / ${opacity})` : colors.brand.accent,
  success: (opacity?: number) =>
    opacity ? `rgb(34 197 94 / ${opacity})` : colors.semantic.success,
  warning: (opacity?: number) =>
    opacity ? `rgb(251 146 60 / ${opacity})` : colors.semantic.warning,
  error: (opacity?: number) =>
    opacity ? `rgb(239 68 68 / ${opacity})` : colors.semantic.error,
  gray: (shade: keyof typeof colors.neutral.gray, opacity?: number) =>
    opacity ? `rgb(${colors.neutral.gray[shade].replace('rgb(', '').replace(')', '')} / ${opacity})` : colors.neutral.gray[shade],
}

/**
 * Spacing utilities with type safety
 */
export const spaceUtils = {
  get: (value: keyof typeof spacing) => spacing[value],
  responsive: (sm: keyof typeof spacing, md?: keyof typeof spacing, lg?: keyof typeof spacing) => ({
    default: spacing[sm],
    sm: spacing[sm],
    md: md ? spacing[md] : spacing[sm],
    lg: lg ? spacing[lg] : md ? spacing[md] : spacing[sm],
  })
}

/**
 * Typography utilities
 */
export const textUtils = {
  size: (size: keyof typeof typography.sizes) => typography.sizes[size],
  weight: (weight: keyof typeof typography.weights) => typography.weights[weight],
  font: (family: keyof typeof typography.fonts) => typography.fonts[family],
  lineHeight: (height: keyof typeof typography.lineHeights) => typography.lineHeights[height],
}

/**
 * Animation utilities
 */
export const animationUtils = {
  transition: (duration: keyof typeof durations = 'base', easing: keyof typeof easings = 'easeInOut') =>
    `all ${durations[duration]} ${easings[easing]}`,

  transformTransition: (duration: keyof typeof durations = 'base', easing: keyof typeof easings = 'easeInOut') =>
    `transform ${durations[duration]} ${easings[easing]}`,

  fadeIn: (duration: keyof typeof durations = 'base') => ({
    animation: `fadeIn ${durations[duration]} ${easings.easeOut} forwards`,
  }),

  slideUp: (duration: keyof typeof durations = 'base') => ({
    animation: `slideUp ${durations[duration]} ${easings.easeOut} forwards`,
  }),
}

/**
 * Layout utilities
 */
export const layoutUtils = {
  container: (padding: keyof typeof spacing = 4) =>
    `max-w-7xl mx-auto px-${spacing[padding]}`,

  section: (py: keyof typeof spacing = 20) =>
    `py-${spacing[py]}`,

  grid: (cols: number, gap: keyof typeof spacing = 4) =>
    `grid grid-cols-${cols} gap-${spacing[gap]}`,

  flex: (direction: 'row' | 'col' = 'row', align: 'start' | 'center' | 'end' = 'center', justify: 'start' | 'center' | 'end' | 'between' = 'center') =>
    `flex flex-${direction} items-${align} justify-${justify}`,
}

/**
 * Component variant creators
 */
export const createVariants = <T extends Record<string, Record<string, string>>>(variants: T) => {
  return (variant: keyof T, size?: keyof T[keyof T]) => {
    const variantClasses = variants[variant]
    if (!variantClasses) return ''

    if (size && variantClasses[size]) {
      return variantClasses[size]
    }

    // Return first variant if size not specified
    return Object.values(variantClasses)[0] || ''
  }
}

/**
 * Responsive utilities
 */
export const responsive = {
  breakpoint: (bp: 'sm' | 'md' | 'lg' | 'xl' | '2xl', classes: string) =>
    `${bp}:${classes}`,

  hide: (bp: 'sm' | 'md' | 'lg' | 'xl' | '2xl') =>
    `${bp}:hidden`,

  show: (bp: 'sm' | 'md' | 'lg' | 'xl' | '2xl') =>
    `hidden ${bp}:block`,
}

/**
 * Component style generators
 */
export const styleGenerators = {
  button: (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400',
      secondary: 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 focus:ring-purple-500 dark:focus:ring-purple-400',
      outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950 focus:ring-indigo-500 dark:focus:ring-indigo-400',
      ghost: 'text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950 focus:ring-indigo-500 dark:focus:ring-indigo-400',
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-xl',
    }

    return cn(baseClasses, variants[variant], sizes[size])
  },

  card: (variant: 'default' | 'elevated' | 'bordered' = 'default') => {
    const baseClasses = 'bg-white dark:bg-gray-900 rounded-2xl'

    const variants = {
      default: 'shadow-md dark:shadow-gray-800',
      elevated: 'shadow-lg hover:shadow-xl dark:shadow-gray-800 dark:hover:shadow-gray-700 transition-shadow duration-300',
      bordered: 'border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-800',
    }

    return cn(baseClasses, variants[variant])
  },

  input: (variant: 'default' | 'error' = 'default', size: 'sm' | 'md' | 'lg' = 'md') => {
    const baseClasses = 'w-full border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0'

    const variants = {
      default: 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400',
      error: 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400',
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    }

    return cn(baseClasses, variants[variant], sizes[size])
  },

  badge: (variant: 'default' | 'success' | 'warning' | 'error' = 'default', size: 'sm' | 'md' = 'md') => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full'

    const variants = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
    }

    return cn(baseClasses, variants[variant], sizes[size])
  }
}

/**
 * Animation presets
 */
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',

  // Hover animations
  hoverScale: 'transform transition-transform duration-200 hover:scale-105',
  hoverLift: 'transform transition-transform duration-200 hover:-translate-y-1',
  hoverGlow: 'transition-shadow duration-200 hover:shadow-lg',

  // Loading states
  skeleton: 'animate-pulse bg-gray-200 dark:bg-gray-800 rounded',
  shimmer: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
}

/**
 * Focus utilities for accessibility
 */
export const focus = {
  ring: 'focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
  ringInset: 'focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-inset',
  visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
}