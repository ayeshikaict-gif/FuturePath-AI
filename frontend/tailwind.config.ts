import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F8FA",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#2448A5",
          hover: "#1D3A85",
          light: "#EDF3FF",
        },
        accent: {
          DEFAULT: "#4776D0",
          hover: "#3962B0",
        },
        navy: {
          DEFAULT: "#172033",
          light: "#2A364F",
        },
        muted: {
          DEFAULT: "#64748B",
          light: "#94A3B8",
        },
        border: "#E5E9F0",
        success: {
          DEFAULT: "#18794E",
          light: "#EBF8F1",
        },
        warning: {
          DEFAULT: "#A86408",
          light: "#FEF7EA",
        },
        error: {
          DEFAULT: "#C24141",
          light: "#FDF2F2",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(23, 32, 51, 0.05), 0 1px 2px 0 rgba(23, 32, 51, 0.03)",
        card: "0 2px 6px 0 rgba(23, 32, 51, 0.04), 0 1px 3px 0 rgba(23, 32, 51, 0.02)",
        dropdown: "0 10px 15px -3px rgba(23, 32, 51, 0.08), 0 4px 6px -2px rgba(23, 32, 51, 0.04)",
      },
      borderRadius: {
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
