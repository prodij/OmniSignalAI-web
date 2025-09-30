'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from './utils'

/**
 * Number Ticker Component - Animates number changes
 */
interface NumberTickerProps {
  value: number
  className?: string
  duration?: number
  delay?: number
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  className,
  duration = 2000,
  delay = 0
}) => {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = Date.now()
      const startValue = currentValue

      const updateValue = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)

        const newValue = Math.floor(startValue + (value - startValue) * easeOutQuart)
        setCurrentValue(newValue)

        if (progress < 1) {
          requestAnimationFrame(updateValue)
        }
      }

      updateValue()
    }, delay)

    return () => clearTimeout(timer)
  }, [value, duration, delay, currentValue])

  return (
    <span className={cn("font-mono", className)}>
      {currentValue.toLocaleString()}
    </span>
  )
}

/**
 * Marquee Component - Infinite scrolling text
 */
interface MarqueeProps {
  children: React.ReactNode
  pauseOnHover?: boolean
  reverse?: boolean
  speed?: number
  className?: string
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  pauseOnHover = false,
  reverse = false,
  speed = 20,
  className
}) => {
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <motion.div
        className="inline-block"
        animate={{
          x: reverse ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={pauseOnHover ? { animationPlayState: "paused" } : {}}
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * Animated Beam Component - Connecting lines animation
 */
interface AnimatedBeamProps {
  className?: string
  duration?: number
  delay?: number
  fromRef: React.RefObject<HTMLElement>
  toRef: React.RefObject<HTMLElement>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  duration = 3,
  delay = 0,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  pathColor = "#3b82f6",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#3b82f6",
  gradientStopColor = "#8b5cf6",
}) => {
  const [pathD, setPathD] = useState("")
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updatePath = () => {
      if (fromRef.current && toRef.current) {
        const fromRect = fromRef.current.getBoundingClientRect()
        const toRect = toRef.current.getBoundingClientRect()

        const fromX = fromRect.left + fromRect.width / 2
        const fromY = fromRect.top + fromRect.height / 2
        const toX = toRect.left + toRect.width / 2
        const toY = toRect.top + toRect.height / 2

        const controlX = (fromX + toX) / 2
        const controlY = (fromY + toY) / 2 - curvature

        const d = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`
        setPathD(d)

        setSvgDimensions({
          width: Math.max(fromX, toX, controlX) + 10,
          height: Math.max(fromY, toY, controlY) + 10
        })
      }
    }

    updatePath()
    window.addEventListener('resize', updatePath)

    return () => window.removeEventListener('resize', updatePath)
  }, [fromRef, toRef, curvature])

  return (
    <svg
      className={cn("absolute inset-0 pointer-events-none", className)}
      width={svgDimensions.width}
      height={svgDimensions.height}
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="50%" stopColor={gradientStopColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStartColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        fill="none"
        opacity={pathOpacity}
      />

      <motion.path
        d={pathD}
        stroke="url(#beam-gradient)"
        strokeWidth={pathWidth}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          repeatType: reverse ? "reverse" : "loop",
          ease: "linear",
        }}
      />
    </svg>
  )
}

/**
 * Meteors Component - Falling meteor animation
 */
interface MeteorsProps {
  number?: number
  className?: string
}

export const Meteors: React.FC<MeteorsProps> = ({
  number = 20,
  className
}) => {
  const meteors = new Array(number).fill(true)

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {meteors.map((_, idx) => (
        <motion.span
          key={idx}
          className="absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]"
          style={{
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
          animate={{
            x: [0, -400],
            y: [0, 400],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.floor(Math.random() * (10 - 2) + 2),
            repeat: Infinity,
            delay: Math.random() * (0.8 - 0.2) + 0.2,
          }}
        >
          <div className="relative top-0 left-0 h-[1px] w-[50px] -translate-y-[50%] bg-gradient-to-r from-white to-transparent" />
        </motion.span>
      ))}
    </div>
  )
}

/**
 * Confetti Component - Celebration animation
 */
interface ConfettiProps {
  particleCount?: number
  className?: string
  colors?: string[]
}

export const Confetti: React.FC<ConfettiProps> = ({
  particleCount = 50,
  className,
  colors = ['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']
}) => {
  const particles = new Array(particleCount).fill(true)

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((_, idx) => (
        <motion.div
          key={idx}
          className="absolute w-2 h-2"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: Math.random() * 100 + "%",
            top: -10,
          }}
          animate={{
            y: [0, window.innerHeight + 10],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, 360],
            opacity: [1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

/**
 * Typing Animation Component
 */
interface TypingAnimationProps {
  text: string
  duration?: number
  className?: string
  onComplete?: () => void
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  duration = 200,
  className,
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, duration)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, duration, onComplete])

  return (
    <span className={cn("font-mono", className)}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  )
}

/**
 * Word Rotate Component - Rotating text animation
 */
interface WordRotateProps {
  words: string[]
  duration?: number
  className?: string
}

export const WordRotate: React.FC<WordRotateProps> = ({
  words,
  duration = 2500,
  className
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, duration)

    return () => clearInterval(interval)
  }, [words, duration])

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWordIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          {words[currentWordIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/**
 * Shine Border Component - Animated border effect
 */
interface ShineBorderProps {
  children: React.ReactNode
  className?: string
  color?: string
  borderWidth?: number
  borderRadius?: number
  duration?: number
}

export const ShineBorder: React.FC<ShineBorderProps> = ({
  children,
  className,
  color = "rgba(59, 130, 246, 0.6)",
  borderWidth = 1,
  borderRadius = 8,
  duration = 2
}) => {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ borderRadius }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          borderRadius,
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div
        className="relative bg-white"
        style={{
          margin: borderWidth,
          borderRadius: borderRadius - borderWidth,
        }}
      >
        {children}
      </div>
    </div>
  )
}