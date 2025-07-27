/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables dark mode using the "class" strategy
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
     screens: {
      'fold': '540px',
      'hub': '1024px',
       
    },
      container: {
        center: true, // Centers the container
        padding: '0', // Removes default padding
      },
      boxShadow: {
        'custom': 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      },
      colors: {
        background: "var(--background)", 
        foreground: "var(--foreground)", 
      },
      fontFamily: {
        heading: ['heading',],
      },
     
    },
  },
  plugins: [
    require('tailwindcss-pseudo-elements')({
      customPseudoClasses: ['before', 'after'],
      contentUtilities: true,
    }),
  ],
};
