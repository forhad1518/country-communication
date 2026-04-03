module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Good
    // This might be too broad
    // It will match `packages/**/node_modules` too
    // '../../packages/**/*.{js,ts,jsx,tsx}',
  ],
}