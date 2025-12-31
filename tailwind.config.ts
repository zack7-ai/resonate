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
        // Semantic Theme Colors (for Dark/Light mode)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // Brand Colors (kept for backward compatibility, but prefer semantic colors)
        "brand-dark": "#0B1120",
        "brand-blue": "#2563eb", // Updated to Royal Blue
        "brand-green": "#22c55e", // Updated to modern green
        "brand-alert": "#ef4444",
        
        // Extended Brand Palette
        "brand-blue-light": "#3b82f6",
        "brand-blue-dark": "#1d4ed8",
        "brand-green-light": "#4ade80",
        "brand-green-dark": "#16a34a",
        
        // Semantic Colors (for status indicators)
        "success": "#22c55e",
        "warning": "#f59e0b",
        "info": "#2563eb",
        "error": "#ef4444",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "calc(var(--radius) + 4px)",
        md: "calc(var(--radius) + 2px)",
        sm: "var(--radius)",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(99, 102, 241, 0.3)",
        "glow-green": "0 0 20px rgba(74, 222, 128, 0.3)",
        "glow-blue-lg": "0 0 40px rgba(99, 102, 241, 0.5)",
        "glow-green-lg": "0 0 40px rgba(74, 222, 128, 0.5)",
      },
      spacing: {
        // Explicit spacing scale for consistency
        "18": "4.5rem", // 72px
        "22": "5.5rem", // 88px
      },
    },
  },
  plugins: [
    // Custom plugin to add 3D effects to all Lucide icons
    function({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.icon-3d': {
          'filter': 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 8px rgba(99, 102, 241, 0.25)) drop-shadow(0 0 12px rgba(99, 102, 241, 0.15))',
          'transform': 'perspective(100px) translateZ(2px)',
          'transform-style': 'preserve-3d',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.icon-3d-primary': {
          'background': 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          'filter': 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.4)) drop-shadow(0 0 12px rgba(99, 102, 241, 0.5))',
        },
        '.icon-3d-success': {
          'background': 'linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          'filter': 'drop-shadow(0 2px 4px rgba(74, 222, 128, 0.4)) drop-shadow(0 0 12px rgba(74, 222, 128, 0.5))',
        },
      });
    },
  ],
};

export default config;

