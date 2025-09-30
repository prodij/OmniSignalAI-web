import { cn } from '@/lib/design-system'

interface SectionSeparatorProps {
  variant?: 'subtle' | 'gradient' | 'none'
  className?: string
}

export function SectionSeparator({ variant = 'subtle', className }: SectionSeparatorProps) {
  if (variant === 'none') return null

  if (variant === 'gradient') {
    return (
      <div className={cn('relative h-px', className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
    )
  }

  // subtle variant
  return <div className={cn('border-t border-gray-100', className)} />
}