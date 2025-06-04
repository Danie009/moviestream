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
        // Main colors from the logo
        "movie-purple": {
          50: "#f3effb",
          100: "#e9e0f8",
          200: "#d4c1f1",
          300: "#b89ae6",
          400: "#9c6dd9",
          500: "#8548cc",
          600: "#6B46C1", // Main purple from logo background
          700: "#5a2ea6",
          800: "#4a2889",
          900: "#3d2370",
          950: "#281550",
        },
        "movie-pink": {
          50: "#fdf2fa",
          100: "#fbe6f6",
          200: "#f9cced",
          300: "#f5a3df",
          400: "#f06dcb",
          500: "#E83FB8", // Main pink from logo "M"
          600: "#d71d9e",
          700: "#b91380",
          800: "#991368",
          900: "#801457",
          950: "#500533",
        },
        // Dark shades for backgrounds
        "movie-dark": {
          50: "#f6f6f7",
          100: "#e0e2e4",
          200: "#c2c5c9",
          300: "#9da2a9",
          400: "#787f89",
          500: "#5f6672",
          600: "#4a505c",
          700: "#3d424b",
          800: "#2D2A3F", // Dark purple from logo shadow
          900: "#1E1A2C", // Darker background
          950: "#121118", // Almost black
        },
        // Override shadcn defaults with our palette
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
