const base = require("@statflo/ui/tailwind/tailwind-workspace-preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...base,
  content: ["./src/**/*.{js,jsx,ts,tsx}", ".public/**/*.{html,htm}"],
};
