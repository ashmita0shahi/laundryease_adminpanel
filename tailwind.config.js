/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EAF5FF',
          100: '#D0EAFF',
          200: '#A1D5FF',
          300: '#72BFFF',
          400: '#44AAFF',
          500: '#1590FF',
          600: '#0073E6',
          700: '#0059B3',
          800: '#003F80',
          900: '#002B57',
        },
        accent: {
          50: '#FFF5EA',
          100: '#FFE8D0',
          200: '#FFD1A1',
          300: '#FFB972',
          400: '#FFA244',
          500: '#FF8B15',
          600: '#E67100',
          700: '#B35800',
          800: '#803F00',
          900: '#572B00',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          700: '#047857',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          700: '#B91C1C',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          700: '#B45309',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 8px rgba(0, 0, 0, 0.12), 0 6px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
