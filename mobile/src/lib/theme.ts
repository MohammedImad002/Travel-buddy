/**
 * Travel Buddy Mobile Design System & Theme
 * Matches the warm cream glassmorphic aesthetics of the Travel Buddy web app.
 */

export const THEME = {
  colors: {
    // Backgrounds
    cream: "#FAF7F2",
    creamLight: "#FFFDF9",
    white: "#FFFFFF",
    cardBg: "rgba(255, 255, 255, 0.82)",
    cardBorder: "rgba(255, 255, 255, 0.9)",
    cardSubtle: "rgba(255, 255, 255, 0.65)",

    // Ambient aura colors
    lilacAura: "rgba(196, 181, 253, 0.35)",
    skyAura: "rgba(186, 230, 253, 0.35)",
    roseAura: "rgba(254, 205, 211, 0.3)",

    // Inks (Text)
    ink: "#1C1826",
    inkMuted: "#6B6478",
    inkSubtle: "#9CA3AF",

    // Brand Gradients
    brandPrimary: "#8B5CF6", // Violet
    brandSecondary: "#EC4899", // Coral / Pink
    brandGradient: ["#8B5CF6", "#EC4899"] as const,
    brandDarkGradient: ["#7C3AED", "#DB2777"] as const,

    // Tints for Tool Cards
    tintLilac: "#EDE9FE",
    tintBrand: "#FCE7F3",
    tintGold: "#FEF3C7",
    tintCoral: "#FFE4E6",
    tintMint: "#D1FAE5",
    tintSky: "#E0F2FE",
    tintRose: "#FFE4E6",

    // UI State colors
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    border: "rgba(0, 0, 0, 0.06)",
  },

  radii: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 26,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    card: {
      shadowColor: "#1C1826",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 12,
      elevation: 3,
    },
    brand: {
      shadowColor: "#8B5CF6",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 6,
    },
    fab: {
      shadowColor: "#EC4899",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 8,
    },
  },
} as const;
