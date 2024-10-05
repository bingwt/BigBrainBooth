/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'satoshi': ['Satoshi', 'sans']
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#FFFFFF",
          "secondary": "#202027",
          "accent": "#00BABC",
          "neutral": "#67676C",
          "success": "#5DB85B",
          "warning": "#E6B291",
          "error": "#D7636F",
        },
        dark: {
          "primary": "#202027",
          "secondary": "#FFFFFF",
          "accent": "#00BABC",
          "neutral": "#67676C",
          "success": "#5DB85B",
          "warning": "#E6B291",
          "error": "#D7636F",
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
  ],
}

