import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Lion-themed color palette
        lion: {
          // Orange side
          orange: {
            DEFAULT: "#FF6B00", // Main orange
            light: "#FF8A3D",
            dark: "#E55A00",
          },
          // Red side
          red: {
            DEFAULT: "#FF2D00", // Main red
            light: "#FF5C3D",
            dark: "#E52800",
          },
          // Teal variant
          teal: {
            DEFAULT: "#0A7B7D", // Main teal
            light: "#0E9799",
            dark: "#086466",
          },
          // Face colors
          face: {
            DEFAULT: "#FFD699", // Main beige
            light: "#FFEAC7",
            dark: "#F5C170",
          },
          // Accent colors
          accent: {
            DEFAULT: "#2D3748", // Dark blue for text/accents
            light: "#4A5568",
            dark: "#1A202C",
          },
        },

        primary: {
          DEFAULT: "#FF6B00", // Orange from lion
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#0A7B7D", // Teal from lion
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF2D00", // Red from lion
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#FFD699", // Beige from lion face
          foreground: "#2D3748", // Dark blue
        },
        accent: {
          DEFAULT: "#0E9799", // Light teal
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#2D3748", // Dark blue
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2D3748", // Dark blue
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
      },
      boxShadow: {
        lion: "0 10px 25px -5px rgba(255, 107, 0, 0.1), 0 8px 10px -6px rgba(255, 107, 0, 0.1)",
        "lion-teal": "0 10px 25px -5px rgba(10, 123, 125, 0.1), 0 8px 10px -6px rgba(10, 123, 125, 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
