module.exports = {
  mode: process.env.TAILWIND_MODE ? 'jit' : '',
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue,html}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
