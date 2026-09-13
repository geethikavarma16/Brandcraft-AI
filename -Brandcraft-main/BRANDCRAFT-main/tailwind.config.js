/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    'bg-indigo-50', 'bg-purple-50', 'bg-emerald-50', 'bg-rose-50', 'bg-amber-50',
    'text-indigo-600', 'text-purple-600', 'text-emerald-600', 'text-rose-600', 'text-amber-600',
    'text-indigo-700', 'text-purple-700', 'text-emerald-700', 'text-rose-700', 'text-amber-700',
    'text-indigo-800', 'text-emerald-800', 'text-rose-800', 'text-indigo-900',
    'border-indigo-700', 'border-indigo-600', 'border-emerald-500', 'border-emerald-100', 'border-rose-100', 'border-amber-200'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
