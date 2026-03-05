module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        darkBg: 'var(--dark-bg)',
        lightBg: 'var(--light-bg)',
      },
    },
  },
  plugins: [],
};
