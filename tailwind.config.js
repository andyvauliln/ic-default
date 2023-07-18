const { fontFamily } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'app/**/*.{jsx,tsx}',
    'components/**/*.{jsx,tsx}',
  ],
  theme: {
    extend: {
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      },
      boxShadow: {
        allSides: '0 0 10px rgba(0,0,0,0.6);',
        allSidesSm: '0 0 6px rgba(0,0,0,0.6);',
        bottom: '0px 15px 10px -15px rgba(0,0,0,0.6);',
        top: '0px -15px 10px -15px rgba(0,0,0,0.6);',
        topLong: "0px -59px 92px 15px var(--color-purple-600)",
        topBottom: '0px -15px 10px -15px rgba(0,0,0,0.6), 0px 15px 10px -15px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: [
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === 'string'
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ':root': extractColorVars(theme('colors')),
      });
    },
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    },
  ],
};
