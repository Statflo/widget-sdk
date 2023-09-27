const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  fontFamily: {
    sans: ["BrandonText", ...defaultTheme.fontFamily.sans],
    mono: defaultTheme.fontFamily.mono,
  },
  fontSize: {
    10: "10px",
    12: "12px",
    14: "14px",
    16: "16px",
    18: "18px",
    20: "20px",
    24: "24px",
    28: "28px",
    32: "32px",
    36: "36px",
    40: "40px",
  },
  fontWeight: {
    regular: 400,
    semibold: 500,
    bold: 700,
  },
  colors: {
    inherit: "inherit",
    transparent: "transparent",
    current: "currentColor",

    white: "#FFFFFF",

    // Neutral
    grey: {
      DEFAULT: "#7F7F7F",
      50: "#F9F9F9",
      100: "#E5E5E5",
      200: "#D0D0D0",
      300: "#BCBCBC",
      400: "#A7A7A7",
      500: "#7F7F7F",
      600: "#6A6A6A",
      700: "#565656",
      800: "#3D3D3D",
      900: "#292929",
    },

    // Primary
    blue: {
      DEFAULT: "#424DE5",
      50: "#F5F6FF",
      100: "#E5E8FF",
      200: "#CDD2FE",
      300: "#99A3FF",
      400: "#5A68ED",
      500: "#424DE5",
      600: "#3947C0",
      700: "#3139A5",
      800: "#293A89",
      900: "#172563",
    },
    blueGrey: {
      DEFAULT: "#7782AC",
      50: "#F9F9FB",
      100: "#F2F3F7",
      200: "#D2D5E3",
      300: "#BDC2D7",
      400: "#9EA6C4",
      500: "#7782AC",
      600: "#626D99",
      700: "#444C6E",
      800: "#3A415F",
      900: "#1F2332",
    },

    // Secondary
    teal: {
      DEFAULT: "#3DB8C0",
      50: "#F8FBFB",
      100: "#E6F3F4",
      200: "#C9ECEE",
      300: "#B4E1E4",
      400: "#3DB8C0",
      500: "#288A8F",
      600: "#286D71",
      700: "#20575A",
      800: "#133C3F",
      900: "#0E2D2F",
    },

    // Tertiary
    oceanBlue: {
      DEFAULT: "#158EB2",
      50: "#F8FBFC",
      100: "#EBF6F9",
      200: "#CFEAF2",
      300: "#AFDBE9",
      400: "#59ACC5",
      500: "#158EB2",
      600: "#1A809E",
      700: "#1C677D",
      800: "#175669",
      900: "#05242E",
    },
    magenta: {
      // TODO: Change to pink
      DEFAULT: "#E21D7A",
      50: "#FEFBFC",
      100: "#FDF1F7",
      200: "#FFBDDC",
      300: "#FF8FC4",
      400: "#E5619F",
      500: "#E21D7A",
      600: "#BF1062",
      700: "#9D034C",
      800: "#7B003A",
      900: "#460B27",
    },

    // Status
    error: {
      DEFAULT: "#D9365C",
      50: "#FFF5F7",
      100: "#FEEBF0",
      200: "#FFE0E8",
      300: "#FCC2CF",
      400: "#F17E99",
      500: "#D9365C",
      600: "#D2234C",
      700: "#B01337",
      800: "#6C0019",
      900: "#3D000E",
    },
    warning: {
      DEFAULT: "#F59E0C",
      50: "#FFFDF5",
      100: "#FEF9E1",
      200: "#FBEFBB",
      300: "#FDE68A",
      400: "#FBBF24",
      500: "#F59E0C",
      600: "#D97708",
      700: "#B4540A",
      800: "#824903",
      900: "#3D2200",
    },
    success: {
      DEFAULT: "#309C7F",
      50: "#F0FAF6",
      100: "#E5F6F0",
      200: "#DBF0EA",
      300: "#B4E4D7",
      400: "#51C2A3",
      500: "#309C7F",
      600: "#2A896F",
      700: "#1C604E",
      800: "#124034",
      900: "#102D26",
    },
    background: {
      light: "#FFFFFF",
      dark: "#0D101C",
    },
    alternate: {
      firstAttempt: {
        background: {
          light: "#F8C4B3",
          dark: "#F17E99",
        },
        text: {
          dark: "#F28968",
        },
      },
    },
    darkMode: {
      500: "#2F344C",
      600: "#272C3F",
      700: "#1F2333",
      800: "#1B2031",
      900: "#171A26",
    },
  },
  boxShadow: {
    inner: "inset 0px 0px 2px 0px #626D993D",
    modal: "0px 4px 8px 0px #1F233229",
    navigation: "0px 1px 4px 0px #1F233229",
    tooltip: "0px 2px 4px 0px #1F233229",
    card: "0px 1px 4px 0px #1F233229",
    topBlur: "0px -1px 4px 0px #1F233214",
    tab: "0px 1px 4px 0px #1F233229",
    focusInner: "inset 0px 0px 4px 0px #30374F66",
    popup: "0px 8px 32px 0px #1F233229",
    table: "0px 2px 8px 0px #1F233214",
    convoCard: "0px 1px 4px #626D993D",
    navBar: "2px 0px 4px #1F233229",
  },
  extend: {
    animation: {
      shimmer: "shimmer 3s infinite",
    },
    backgroundImage: {
      conicGradient:
        "conic-gradient(from 270deg, #424DE5, #E21D7A, #E21D7A, #3DB8C0, #3DB8C0, #424DE5)",
      shimmer: "linear-gradient(90deg, #F2F3F7, #F9F9FB, #F2F3F7)",
    },
    gridTemplateRows: {
      reassignmentAlert: "2.25rem 3.5rem 2.75rem 1.75rem minmax(0, 1fr)",
      reassignment: "2.25rem 0rem 2.75rem 1.75rem minmax(0, 1fr)",
      leads: "2.25rem 2.75rem 1.75rem minmax(0, 1fr)",
    },
    keyframes: {
      shimmer: {
        "100%": { transform: "translateX(100%)" },
      },
    },
    letterSpacing: {
      1: "0.01em",
      3: "0.03em",
    },
    maxWidth: {
      40: "10rem",
    },
    minWidth: {
      4: "1rem",
      5: "1.25rem",
      12: "3rem",
      24: "6rem",
    },
    opacity: {
      15: "0.15",
    },
    spacing: {
      15: "3.75rem",
      22: "5.5rem",
      26: "6.5rem",
      84: "21rem",
      88: "22rem",
      100: "25rem",
      120: "30rem",
      124: "31rem",

      sub4: "calc(100% - 1rem)",
      sub7: "calc(100% - 1.75rem)",

      halfScreen: "50vw",
    },
  },
};
