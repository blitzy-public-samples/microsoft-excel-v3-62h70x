const defaultTheme = require('@tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#217346",
        secondary: "#2b579a",
        text: "#333333",
        background: "#ffffff",
        border: "#e0e0e0",
        hover: "#f4f4f4",
        error: "#d92b2b",
        success: "#107c10"
      },
      fontFamily: {
        sans: ["Segoe UI", "Arial", "sans-serif", ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        'xs': '10px',
        'sm': '12px',
        'base': '14px',
        'lg': '16px',
        'xl': '18px',
        '2xl': '20px',
        '3xl': '24px'
      },
      spacing: {
        'cell': '20px'
      },
      minWidth: {
        'cell': '64px'
      },
      minHeight: {
        'cell': '20px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled']
    }
  }
};

// Custom utilities
const customUtilities = {
  '.cell': 'border border-border bg-white',
  '.cell-selected': 'border-2 border-primary',
  '.formula-bar': 'bg-white border border-border p-2',
  '.worksheet-tab': 'bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-t-lg'
};

module.exports.theme.extend.customUtilities = customUtilities;