module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        'jump-in': 'jumpIn  300ms ease-in forwards', // Adjusted to 300ms
        'jump-out': 'jumpOut 300ms ease-out forwards',
      },
      keyframes: {
        jumpIn: {
          '0%': {
            transform: 'scale(0.8)', // Start at 50% scale when dropped
            opacity: '1', // Start with opacity 0
          },
          '100%': {
            transform: 'scale(1)', // End at normal size
            opacity: '1', // Full opacity
          },
        },
        jumpOut: {
          '0%': {
            transform: 'scale(1)', // Start at normal size when dragging starts
            opacity: '1', // Full opacity
          },
          '100%': {
            transform: 'scale(0.8)', // Scale down to 50% while dragging
            opacity: '1', // Slightly transparent while dragging
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
