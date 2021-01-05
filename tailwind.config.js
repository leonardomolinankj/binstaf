module.exports = {
  mode: "jit",
  purge: ["./public/index.html", "./src/frontend/**/*.svelte"],
  darkMode: "class", // or 'media' or 'class'
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
