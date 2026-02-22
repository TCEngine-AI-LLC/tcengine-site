import { alpha, type ThemeOptions } from "@mui/material/styles";
import { siteMeta } from "@/src/customizations/site";

// ----------------------------
// Single source of truth
// Change colors here only.
// ----------------------------
const COLORS = {
  primary: "#7BA6FF",
  primaryLight: "#A9C3FF",
  primaryDark: "#4F7DFF",
  secondary: "#A78BFA",

  text: "#F8FAFC",

  // Background system
  bgTop: "#070A1D",
  bgMid: "#050717",
  bgBottom: "#04040C",
  aurora1: "#5B56BD",
  aurora2: "#496FFF",

  // “Glass paper” base
  paperBase: "#0A1027",
} as const;

const OPACITY = {
  // Glass surfaces
  glassSelected: 0.08,
  glassHover: 0.14,
  glassDisabled: 0.04,

  // Paper + text + borders
  paper: 0.78,
  textSecondary: 0.72,
  divider: 0.16,

  // Effects
  selection: 0.32,
  paperGradient: 0.06,

  // Background aurora fields
  aurora1: 0.34,
  aurora2: 0.26,
} as const;

const bg = siteMeta.background;

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: COLORS.primary,
      light: COLORS.primaryLight,
      dark: COLORS.primaryDark,
    },
    secondary: { main: COLORS.secondary },

    // glass opacities live here (ONE place)
    action: {
      selected: alpha("#fff", OPACITY.glassSelected),
      hover: alpha("#fff", OPACITY.glassHover),
      disabledBackground: alpha("#fff", OPACITY.glassDisabled),
    },

    background: {
      default: "transparent",
      paper: alpha(COLORS.paperBase, OPACITY.paper),
    },

    text: {
      primary: COLORS.text,
      secondary: alpha(COLORS.text, OPACITY.textSecondary),
    },

    divider: alpha(COLORS.primary, OPACITY.divider),
  },

  shape: { borderRadius: 18 },

  typography: {
    fontFamily:
      'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    button: { textTransform: "none", fontWeight: 650 },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { colorScheme: "dark" },

        body: {
          margin: 0,
          color: COLORS.text,
          position: "relative",
          isolation: "isolate",

          backgroundColor: COLORS.bgMid,
          backgroundImage: `
            radial-gradient(1100px 700px at 14% 12%, ${alpha(COLORS.aurora1, OPACITY.aurora1)}, transparent 60%),
            radial-gradient(950px 650px at 86% 18%, ${alpha(COLORS.aurora2, OPACITY.aurora2)}, transparent 58%),
            linear-gradient(180deg, ${COLORS.bgTop} 0%, ${COLORS.bgMid} 55%, ${COLORS.bgBottom} 100%)
          `,
          backgroundAttachment: "fixed",
        },

        // Background image layer (optional, controlled in site.ts)
        "body::before": {
          content: '""',
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",

          backgroundImage: bg.enabled ? `url(${bg.image})` : "none",
          backgroundRepeat: "no-repeat",
          backgroundPosition: bg.position,
          backgroundSize: "cover",

          opacity: bg.enabled ? bg.opacity : 0,
          filter: "grayscale(35%) contrast(110%) saturate(120%)",
        },

        "::selection": { backgroundColor: alpha(COLORS.primary, OPACITY.selection) },

        a: { color: "inherit", textDecoration: "none" },
      },
    },

    MuiTooltip: { defaultProps: { arrow: true } },

    // Keep Paper “subtle gradient” consistent everywhere
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: `linear-gradient(180deg, ${alpha(COLORS.primary, OPACITY.paperGradient)} 0%, ${alpha(
            COLORS.primary,
            0
          )} 42%)`,
        },
      },
    },
  },
};