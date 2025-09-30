'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface LogoProps {
  className?: string
  animated?: boolean
}

export function Logo({ className = "w-10 h-10", animated = true }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Static version for SSR and non-animated contexts
  if (!animated) {
    // Static version for SSR and non-animated contexts
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="primaryGradient-static" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow-static">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Orbital rings - THICKER for visibility */}
        <circle
          cx="50"
          cy="50"
          r="35"
          stroke="url(#primaryGradient-static)"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <circle
          cx="50"
          cy="50"
          r="25"
          stroke="url(#primaryGradient-static)"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        <circle
          cx="50"
          cy="50"
          r="15"
          stroke="url(#primaryGradient-static)"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />

        {/* Orbital data nodes - MORE VISIBLE */}
        <circle cx="85" cy="50" r="3" fill="url(#primaryGradient-static)" opacity="0.9"/>
        <circle cx="50" cy="15" r="3" fill="url(#primaryGradient-static)" opacity="0.9"/>
        <circle cx="15" cy="50" r="3" fill="url(#primaryGradient-static)" opacity="0.9"/>
        <circle cx="50" cy="85" r="3" fill="url(#primaryGradient-static)" opacity="0.9"/>

        {/* Central processor core - LARGER */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="url(#primaryGradient-static)"
          filter="url(#glow-static)"
        />

        {/* Inner glow */}
        <circle
          cx="50"
          cy="50"
          r="5"
          fill="#ffffff"
          opacity="0.9"
        />

        {/* Signal output wave - THICKER */}
        <path
          d="M 50 50 Q 65 45, 75 50 T 90 50"
          stroke="url(#primaryGradient-static)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    )
  }

  return (
    <motion.div
      className={className}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#a78bfa', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Subtle dot matrix background */}
        <g opacity="0.1">
          {[...Array(8)].flatMap((_, i) =>
            [...Array(8)].map((_, j) => (
              <motion.circle
                key={`dot-${i}-${j}`}
                cx={15 + i * 10}
                cy={15 + j * 10}
                r="0.5"
                fill="#4f46e5"
                initial={{ opacity: 0.1 }}
                animate={{
                  opacity: isHovered ? [0.1, 0.3, 0.1] : 0.1,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: (i + j) * 0.1
                }}
              />
            ))
          )}
        </g>

        {/* Outer orbital ring - slow rotation */}
        <motion.circle
          cx="50"
          cy="50"
          r="35"
          stroke="url(#primaryGradient)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.2"
          animate={{
            opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2
          }}
          transition={{
            opacity: { duration: 2, repeat: Infinity }
          }}
        />

        {/* Orbital data nodes on outer ring - static positioned */}
        <motion.circle
          cx="85"
          cy="50"
          r="2"
          fill="url(#primaryGradient)"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <motion.circle
          cx="50"
          cy="15"
          r="2"
          fill="url(#primaryGradient)"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5
          }}
        />
        <motion.circle
          cx="15"
          cy="50"
          r="2"
          fill="url(#primaryGradient)"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1
          }}
        />
        <motion.circle
          cx="50"
          cy="85"
          r="2"
          fill="url(#primaryGradient)"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1.5
          }}
        />

        {/* Middle orbital ring - medium rotation */}
        <motion.circle
          cx="50"
          cy="50"
          r="25"
          stroke="url(#primaryGradient)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
          animate={{
            opacity: isHovered ? [0.3, 0.5, 0.3] : 0.3
          }}
          transition={{
            opacity: { duration: 2, repeat: Infinity }
          }}
        />

        {/* Orbital data nodes on middle ring (diagonal positions) */}
        <motion.circle
          cx="67.68"
          cy="67.68"
          r="1.5"
          fill="url(#primaryGradient)"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
          }}
        />
        <motion.circle
          cx="32.32"
          cy="32.32"
          r="1.5"
          fill="url(#primaryGradient)"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: 0.45
          }}
        />
        <motion.circle
          cx="67.68"
          cy="32.32"
          r="1.5"
          fill="url(#primaryGradient)"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: 0.9
          }}
        />
        <motion.circle
          cx="32.32"
          cy="67.68"
          r="1.5"
          fill="url(#primaryGradient)"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: 1.35
          }}
        />

        {/* Inner orbital ring - fast rotation */}
        <motion.circle
          cx="50"
          cy="50"
          r="15"
          stroke="url(#primaryGradient)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.4"
          animate={{
            opacity: isHovered ? [0.4, 0.6, 0.4] : 0.4
          }}
          transition={{
            opacity: { duration: 2, repeat: Infinity }
          }}
        />

        {/* Orbital data nodes on inner ring */}
        <motion.circle
          cx="50"
          cy="35"
          r="1.2"
          fill="url(#glowGradient)"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
        <motion.circle
          cx="63"
          cy="57.5"
          r="1.2"
          fill="url(#glowGradient)"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.5
          }}
        />
        <motion.circle
          cx="37"
          cy="57.5"
          r="1.2"
          fill="url(#glowGradient)"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 1
          }}
        />

        {/* Central processor core with pulse */}
        <motion.circle
          cx="50"
          cy="50"
          r="6"
          fill="url(#primaryGradient)"
          filter={isHovered ? "url(#strongGlow)" : "url(#glow)"}
          animate={{
            scale: isHovered ? [1, 1.15, 1] : [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Inner glow core */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill="#ffffff"
          animate={{
            opacity: isHovered ? [0.8, 1, 0.8] : [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />

        {/* Signal output wave - amplified clean signal */}
        <motion.path
          d="M 50 50 Q 65 45, 75 50 T 90 50"
          stroke="url(#primaryGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
          animate={{
            opacity: isHovered ? [0.6, 1, 0.6] : [0.4, 0.6, 0.4],
            pathLength: [0, 1],
          }}
          transition={{
            opacity: { duration: 2, repeat: Infinity },
            pathLength: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Secondary signal indicators */}
        <motion.path
          d="M 50 50 Q 45 35, 50 25"
          stroke="url(#glowGradient)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
          animate={{
            pathLength: [0, 1],
            opacity: isHovered ? [0.4, 0.7, 0.4] : [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 0.5
          }}
        />
      </svg>
    </motion.div>
  )
}