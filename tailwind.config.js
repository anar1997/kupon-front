/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Tüm JSX ve diğer dosyaları kapsar
  ],
  theme: {
    extend: {
      screens: {
        '418': '418px',
        '532': '532px', // 532px'lik özel bir breakpoint tanımla
        '367': '367px',
      },
    },
  },
  plugins: [],
}
