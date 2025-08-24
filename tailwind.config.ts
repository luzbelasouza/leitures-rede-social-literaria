import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      maxWidth: {
        'prose': '70ch',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.06)',
        'card-dark': '0 2px 12px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        bg: {
          DEFAULT: '#faf7f2',
          dark: '#0f1115',
        },
        background: {
          DEFAULT: '#faf7f2',
          dark: '#0f1115',
        },
        foreground: {
          DEFAULT: '#1f1f1f',
          dark: '#e8e8ea',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#151821',
          foreground: {
            DEFAULT: '#1f1f1f',
            dark: '#e8e8ea',
          },
        },
        popover: {
          DEFAULT: '#ffffff',
          dark: '#151821',
          foreground: {
            DEFAULT: '#1f1f1f',
            dark: '#e8e8ea',
          },
        },
        primary: {
          DEFAULT: '#b48a3a',
          dark: '#d5b676',
          foreground: {
            DEFAULT: '#ffffff',
            dark: '#0f1115',
          },
        },
        secondary: {
          DEFAULT: '#f5f1ea',
          dark: '#1a1f2e',
          foreground: {
            DEFAULT: '#1f1f1f',
            dark: '#e8e8ea',
          },
        },
        muted: {
          DEFAULT: '#f5f1ea',
          dark: '#1a1f2e',
          foreground: {
            DEFAULT: '#6b6b6b',
            dark: '#a0a3ad',
          },
        },
        accent: {
          DEFAULT: '#b48a3a',
          dark: '#d5b676',
          foreground: {
            DEFAULT: '#ffffff',
            dark: '#0f1115',
          },
        },
        destructive: {
          DEFAULT: '#dc2626',
          dark: '#ef4444',
          foreground: {
            DEFAULT: '#ffffff',
            dark: '#ffffff',
          },
        },
        border: {
          DEFAULT: '#e8e2d9',
          dark: '#2a2f3a',
        },
        input: {
          DEFAULT: '#ffffff',
          dark: '#151821',
        },
        ring: {
          DEFAULT: '#b48a3a',
          dark: '#d5b676',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
