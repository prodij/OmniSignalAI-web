'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface DarkModeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load dark mode preference from localStorage
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      setIsDarkMode(saved === 'true')
    } else {
      // Check system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Apply dark mode class to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Save preference
    localStorage.setItem('darkMode', String(isDarkMode))
  }, [isDarkMode, mounted])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  // Prevent flash on initial render
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    // Return default values if provider not found (prevents crash during SSR)
    console.warn('useDarkMode used outside DarkModeProvider, returning defaults')
    return {
      isDarkMode: false,
      toggleDarkMode: () => {},
    }
  }
  return context
}
