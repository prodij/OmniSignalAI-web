/**
 * OmniSignalAI Design System
 *
 * A comprehensive design system ensuring consistency across the entire website.
 * This system provides:
 * - Type-safe design tokens
 * - Reusable base components
 * - Layout components for consistent page structure
 * - Utility functions for consistent styling
 * - Responsive design patterns
 */

// Constants and tokens
export * from './constants'

// Utility functions
export * from './utils'

// Base components
export {
  Button,
  Card,
  Input,
  Badge,
  Container,
  Section,
  Grid,
  Heading,
  Text,
} from './base-components'

// Layout components
export {
  PageLayout,
  HeroLayout,
  TwoColumnLayout,
  ContentSection,
  FeatureGrid,
  CTASection,
  StatsSection,
} from './layout-components'

// Re-export common utilities for convenience
export { cn } from './utils'