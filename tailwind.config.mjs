const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        atomic: ["Atomic", "cursive"],
        cabinetGroteskBlack: ["CabinetGrotesk-Black", "sans-serif"],
        cabinetGroteskExtraBold: ["CabinetGrotesk-ExtraBold", "sans-serif"],
        cabinetGroteskBold: ["CabinetGrotesk-Bold", "sans-serif"],
        cabinetGroteskMedium: ["CabinetGrotesk-Medium", "sans-serif"],
        cabinetGroteskRegular: ["CabinetGrotesk-Regular", "sans-serif"],
        cabinetGroteskLight: ["CabinetGrotesk-Light", "sans-serif"],
        cabinetGroteskExtraLight: ["CabinetGrotesk-ExtraLight", "sans-serif"],
        cabinetGroteskThin: ["CabinetGrotesk-Thin", "sans-serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        twitch: "var(--color-twitch)",
        ice: "var(--color-twitch-ice)",
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}