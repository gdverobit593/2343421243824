/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          900: '#05070d',
          800: '#070b17',
          700: '#0b1024',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 80px rgba(0,0,0,0.55)',
        soft: '0 0 0 1px rgba(255,255,255,0.06), 0 10px 30px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(600px circle at 20% 20%, rgba(56,189,248,0.14), transparent 55%), radial-gradient(700px circle at 80% 30%, rgba(99,102,241,0.18), transparent 55%), radial-gradient(900px circle at 50% 90%, rgba(168,85,247,0.10), transparent 60%)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
