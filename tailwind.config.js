/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text)-(red|green|blue|orange|sky|purple|violet|pink|gray)-(100|200|300|400|500|600|700|800|900)/,
    },
  ],
};
