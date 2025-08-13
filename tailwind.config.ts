import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
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
          50: "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          200: "hsl(var(--primary-200))",
          300: "hsl(var(--primary-300))",
          400: "hsl(var(--primary-400))",
          500: "hsl(var(--primary-500))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          800: "hsl(var(--primary-800))",
          900: "hsl(var(--primary-900))",
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
        // Dashboard-specific colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          50: "hsl(var(--success-50))",
          100: "hsl(var(--success-100))",
          200: "hsl(var(--success-200))",
          300: "hsl(var(--success-300))",
          400: "hsl(var(--success-400))",
          500: "hsl(var(--success-500))",
          600: "hsl(var(--success-600))",
          700: "hsl(var(--success-700))",
          800: "hsl(var(--success-800))",
          900: "hsl(var(--success-900))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          50: "hsl(var(--warning-50))",
          100: "hsl(var(--warning-100))",
          200: "hsl(var(--warning-200))",
          300: "hsl(var(--warning-300))",
          400: "hsl(var(--warning-400))",
          500: "hsl(var(--warning-500))",
          600: "hsl(var(--warning-600))",
          700: "hsl(var(--warning-700))",
          800: "hsl(var(--warning-800))",
          900: "hsl(var(--warning-900))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
          50: "hsl(var(--danger-50))",
          100: "hsl(var(--danger-100))",
          200: "hsl(var(--danger-200))",
          300: "hsl(var(--danger-300))",
          400: "hsl(var(--danger-400))",
          500: "hsl(var(--danger-500))",
          600: "hsl(var(--danger-600))",
          700: "hsl(var(--danger-700))",
          800: "hsl(var(--danger-800))",
          900: "hsl(var(--danger-900))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          50: "hsl(var(--info-50))",
          100: "hsl(var(--info-100))",
          200: "hsl(var(--info-200))",
          300: "hsl(var(--info-300))",
          400: "hsl(var(--info-400))",
          500: "hsl(var(--info-500))",
          600: "hsl(var(--info-600))",
          700: "hsl(var(--info-700))",
          800: "hsl(var(--info-800))",
          900: "hsl(var(--info-900))",
        },
        // Chart colors
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
          6: "hsl(var(--chart-6))",
          7: "hsl(var(--chart-7))",
          8: "hsl(var(--chart-8))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Custom spacing for dashboard
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Typography scales for metrics
      fontSize: {
        'metric-xs': ['0.625rem', { lineHeight: '1rem' }],
        'metric-sm': ['0.75rem', { lineHeight: '1.25rem' }],
        'metric-base': ['1rem', { lineHeight: '1.5rem' }],
        'metric-lg': ['1.5rem', { lineHeight: '2rem' }],
        'metric-xl': ['2rem', { lineHeight: '2.5rem' }],
        'metric-2xl': ['3rem', { lineHeight: '3.5rem' }],
        'metric-3xl': ['4rem', { lineHeight: '4.5rem' }],
      },
      // Custom shadows for dashboard
      boxShadow: {
        'dashboard-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'dashboard': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'dashboard-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'dashboard-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'dashboard-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
      },
      // Gradients for dashboard
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(var(--primary-400)) 0%, hsl(var(--primary-600)) 100%)',
        'gradient-success': 'linear-gradient(135deg, hsl(var(--success-400)) 0%, hsl(var(--success-600)) 100%)',
        'gradient-warning': 'linear-gradient(135deg, hsl(var(--warning-400)) 0%, hsl(var(--warning-600)) 100%)',
        'gradient-danger': 'linear-gradient(135deg, hsl(var(--danger-400)) 0%, hsl(var(--danger-600)) 100%)',
        'gradient-info': 'linear-gradient(135deg, hsl(var(--info-400)) 0%, hsl(var(--info-600)) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.3s ease-out",
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
