const plugin = require("tailwindcss/plugin");
const theme = require("./theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", ".public/**/*.{html,htm}"],
  darkMode: "class",
  theme,
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/typography"),
    plugin(function ({ addBase, addVariant, theme }) {
      addBase({
        h1: {
          fontSize: theme("fontSize.28"),
        },
        p: {
          fontSize: theme("fontSize.16"),
        },
      });

      addVariant("hover-not-disabled", "&:hover:not([disabled])");
      addVariant(
        "group-hover-not-disabled",
        ":merge(.group):hover:not([disabled]) &"
      );
      addVariant(
        "peer-hover-not-disabled",
        ":merge(.peer):hover:not([disabled]) &"
      );
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("group-hocus", [
        ":merge(.group):hover &  ",
        ":merge(.group):focus &",
      ]);
      addVariant("hocus-not-disabled", ["&:hover:not([disabled])", "&:focus"]);
      addVariant("group-hocus-not-disabled", [
        ":merge(.group):hover:not([disabled]) &",
        ":merge(.group):focus &",
      ]);
      addVariant("checkterminate", ["&:checked", "&:indeterminate"]);
      addVariant("active", ["&:active", "&.active"]);
      addVariant("disabled", ["&:disabled", "&.disabled"]);
      addVariant("selected", "&.selected");
      addVariant("group-active", [
        ":merge(.group).active &",
        ":merge(.group):active &",
      ]);
      addVariant("group-selected", ":merge(.group).selected &");
    }),
  ],
};
