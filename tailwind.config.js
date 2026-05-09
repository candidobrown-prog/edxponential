/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'sans-serif'],
        body: ['var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'sans-serif'],
        mono: ['var(--font-mono)', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'sans-serif'],
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)',
        '5xl': 'var(--space-5xl)',
        '6xl': 'var(--space-6xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        'surface-secondary': 'hsl(var(--surface-secondary))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          dark: 'hsl(var(--primary-dark))',
          light: 'hsl(var(--primary-light))',
        },
        crimson: {
          DEFAULT: 'hsl(var(--crimson-primary))',
          dark: 'hsl(var(--crimson-dark))',
          light: 'hsl(var(--crimson-light))',
          burgundy: 'hsl(var(--crimson-burgundy))',
          tint: 'hsl(var(--crimson-tint))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        'border-subtle': 'hsl(var(--border-subtle))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        error: 'hsl(var(--error))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-tertiary': 'hsl(var(--text-tertiary))',
        blue: {
          pure: '#2563EB',
          light: '#3B82F6',
          glow: 'rgba(37, 99, 235, 0.15)',
        },
        'crimson-accent': {
          'DEFAULT': '#A51C30',
          'dark': '#8B1728',
          'light': '#F9EDEE',
          'burgundy': '#6E0F1F',
          'beige': '#F5F1EC',
        },
        gray: {
          black: '#000000',
          charcoal: '#222222',
          dark: '#666666',
          border: '#EAEAEA',
          light: '#F8F8F8',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      transitionDuration: {
        fast: 'var(--transition-fast)',
        normal: 'var(--transition-normal)',
        slow: 'var(--transition-slow)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        'soft': 'var(--shadow-sm)',
        'md-soft': 'var(--shadow-md)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'slide-in-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'scale-in': {
          from: {
            opacity: '0',
            transform: 'scale(0.95)'
          },
          to: {
            opacity: '1',
            transform: 'scale(1)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-up': 'slide-in-up 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      zIndex: {
        base: '0',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.6' }],
        base: ['16px', { lineHeight: '1.6' }],
        lg: ['18px', { lineHeight: '1.6' }],
        xl: ['20px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        '3xl': ['28px', { lineHeight: '1.2' }],
        '4xl': ['32px', { lineHeight: '1.2' }],
        '5xl': ['40px', { lineHeight: '1.2' }],
        '6xl': ['48px', { lineHeight: '1.1' }],
        '7xl': ['56px', { lineHeight: '1.1' }],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '-0.01em',
        wide: '0.02em',
        wider: '0.05em',
        widest: '0.1em',
      },
      boxShadow: {
        'crimson-glow': '0 0 20px rgba(165, 28, 48, 0.15)',
        'crimson-sm': '0 2px 8px rgba(165, 28, 48, 0.1)',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    // Keep essential safety classes
    'display-1', 'display-2', 'display-3',
    'heading-1', 'heading-2', 'heading-3',
    'title', 'subtitle', 'body', 'body-sm', 'body-xs',
    'label', 'caption', 'overline',
    'btn-base', 'input-base', 'card-premium', 'card-elevated',
    'hover-lift', 'glow-primary', 'gradient-text',
    'animate-fade-in', 'animate-slide-in-up', 'animate-scale-in', 'animate-shimmer',
    'shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl',
  ],
}
