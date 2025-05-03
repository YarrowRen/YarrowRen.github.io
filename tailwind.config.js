/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,js,ts}"],
    safelist: [
      "columns-1",
      "sm:columns-2",
      "lg:columns-3",
      "bg-red-100",
      "break-inside-avoid"
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  