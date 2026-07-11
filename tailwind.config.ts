import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{html,ts,tsx,jsx,mjs,cjs}',
  ],
  important: true,
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: true,
  },
} satisfies Config;
