module.exports = {
  mode: "jit",
  purge: ["./public/index.html", "./src/frontend/**/*.svelte"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        archivo: ["Archivo Black"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
