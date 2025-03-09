import { type Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [tailwindcssAnimate], // ✅ Add this
};

export default config;
