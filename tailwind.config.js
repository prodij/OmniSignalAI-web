/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "bounce-x": {
          "0%, 100%": {
            transform: "translateX(0)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "translateX(25%)",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
        "typewriter": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        "pulse-sequence": {
          "0%, 100%": { opacity: "1" },
          "25%": { opacity: "0.5" },
          "50%": { opacity: "1" },
          "75%": { opacity: "0.5" },
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "bounce-gentle": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "bounce-x": "bounce-x 1s infinite",
        "typewriter": "typewriter 3s steps(40, end)",
        "pulse-sequence": "pulse-sequence 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.neutral.700'),
            fontSize: '1.125rem', // 18px
            lineHeight: '1.75', // 28px (1.56 ratio)

            // Paragraphs - balanced spacing
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },

            // Headings - clear hierarchy without excessive space
            'h1, h2, h3, h4': {
              color: theme('colors.neutral.900'),
              fontWeight: '700',
              lineHeight: '1.3',
            },
            h2: {
              fontSize: '2rem', // 32px
              marginTop: '2.5em', // 80px
              marginBottom: '0.75em', // 24px
              paddingBottom: '0.5em',
              borderBottom: `1px solid ${theme('colors.neutral.200')}`,
            },
            h3: {
              fontSize: '1.5rem', // 24px
              marginTop: '2em', // 48px
              marginBottom: '0.75em', // 18px
            },
            h4: {
              fontSize: '1.25rem', // 20px
              marginTop: '1.75em', // 35px
              marginBottom: '0.5em', // 10px
            },

            // Links - subtle, not distracting
            a: {
              color: theme('colors.indigo.600'),
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: `1px solid ${theme('colors.indigo.200')}`,
              transition: 'border-color 0.2s',
              '&:hover': {
                borderBottomColor: theme('colors.indigo.600'),
              },
            },

            // Strong - use sparingly
            strong: {
              color: theme('colors.neutral.900'),
              fontWeight: '600',
            },

            // Lists - clear visual hierarchy
            'ul, ol': {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              paddingLeft: '1.5em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'li > p': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },

            // Blockquotes - visual emphasis
            blockquote: {
              fontWeight: '400',
              fontStyle: 'italic',
              color: theme('colors.neutral.600'),
              borderLeftWidth: '4px',
              borderLeftColor: theme('colors.indigo.500'),
              paddingLeft: '1.5em',
              paddingTop: '0.5em',
              paddingBottom: '0.5em',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },

            // Code blocks
            code: {
              color: theme('colors.neutral.900'),
              backgroundColor: theme('colors.neutral.100'),
              paddingLeft: '0.4em',
              paddingRight: '0.4em',
              paddingTop: '0.2em',
              paddingBottom: '0.2em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.neutral.900'),
              color: theme('colors.neutral.100'),
              padding: '1.5em',
              borderRadius: '0.5rem',
              marginTop: '2em',
              marginBottom: '2em',
              overflow: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
            },

            // Tables
            table: {
              marginTop: '2em',
              marginBottom: '2em',
              width: '100%',
            },
            thead: {
              borderBottomWidth: '2px',
              borderBottomColor: theme('colors.neutral.300'),
            },
            'thead th': {
              color: theme('colors.neutral.900'),
              fontWeight: '600',
              paddingTop: '0.75em',
              paddingBottom: '0.75em',
              paddingLeft: '1em',
              paddingRight: '1em',
              textAlign: 'left',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.neutral.200'),
            },
            'tbody td': {
              paddingTop: '0.75em',
              paddingBottom: '0.75em',
              paddingLeft: '1em',
              paddingRight: '1em',
            },

            // Horizontal rules
            hr: {
              borderColor: theme('colors.neutral.300'),
              marginTop: '2em',
              marginBottom: '2em',
            },

            // Images - handled by BlogImage component
            img: {
              marginTop: '2em',
              marginBottom: '2em',
            },
          },
        },

        // Dark mode
        dark: {
          css: {
            color: theme('colors.neutral.300'),
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.neutral.100'),
            },
            h2: {
              borderBottomColor: theme('colors.neutral.800'),
            },
            a: {
              color: theme('colors.indigo.400'),
              borderBottomColor: theme('colors.indigo.600'),
              '&:hover': {
                borderBottomColor: theme('colors.indigo.400'),
              },
            },
            strong: {
              color: theme('colors.neutral.100'),
            },
            blockquote: {
              color: theme('colors.neutral.400'),
              borderLeftColor: theme('colors.indigo.500'),
            },
            code: {
              color: theme('colors.neutral.100'),
              backgroundColor: theme('colors.neutral.800'),
            },
            pre: {
              backgroundColor: theme('colors.neutral.950'),
              borderWidth: '1px',
              borderColor: theme('colors.neutral.800'),
            },
            'thead th': {
              color: theme('colors.neutral.100'),
            },
            'thead tr': {
              borderBottomColor: theme('colors.neutral.700'),
            },
            'tbody tr': {
              borderBottomColor: theme('colors.neutral.800'),
            },
            hr: {
              borderColor: theme('colors.neutral.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}