import type { Config } from "tailwindcss";
import colors from  "./colors"

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: {
  			DEFAULT: '20px',
  			lg: '80px'
  		},
  		screens: {
  			sm: '375px',
  			md: '768px',
  			lg: '1200px'
  		}
  	},
  	screens: {
  		sm: '375px',
  		md: '768px',
  		lg: '1200px'
  	},
  	extend: {
  		colors: {
  			border: 'rgba(255,255,255,0.15)',
  			primary: colors.primary,
  			secondary: colors.secondary,
  			'light-primary': colors.lightPrimary,
  			'dark-primary': colors.darkPrimary,
  			'shadow-primary': colors.shadowPrimary,
  			'shadow-primary-half-quarter': colors.shadowPrimaryHalfQuarter,
  			'light-secondary': colors.lightSecondary,
  			'light-secondary-half': colors.lightSecondaryHalf,
  			'dark-secondary': colors.darkSecondary,
  			'semi-light-primary': colors.semiLightPrimary
  		},
  		backgroundImage: {
  			'hero-globe-gradient': `radial-gradient(50% 50% at 16.8% 18.3%, white, ${colors.lightPrimary} 37.7%, ${colors.darkPrimary})`,
  			'hero-heading-gradient': `radial-gradient(100% 100% at top left,white,white, ${colors.lightSecondaryHalf})`,
  			'hero-background-gradient': `radial-gradient(75% 75% at center center,${colors.shadowPrimaryHalf} 15%,${colors.darkSecondary} 78%,transparent)`,
  			'testimonial-card-gradient': `linear-gradient(to bottom left,${colors.shadowPrimaryHalf},black)`
  		},
  		boxShadow: {
  			'hero-globe-shadow': `-20px -20px 50px rgba(255,255,255,0.5), -20px -20px 80px rgba(255,255,255,0.1), 0 0 50px ${colors.shadowPrimary}`,
  			'button-primary': `0 0 10px ${colors.shadowPrimaryHalfQuarter} inset`,
  			'button-secondary': `0px 0px 12px ${colors.shadowPrimary}`
  		},
  		zIndex: {
  			'-1': '-1',
  			'max': '999999'
  		},
  		height: {
  			'hero-sm': '492px',
  			'hero-md': '800px'
  		},
  		fontSize: {
  			'hero-md': '168px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [{
    handler : function ({ addUtilities }) {
      addUtilities({
        '.centered': {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
      });
    },
  },
      require("tailwindcss-animate")
],
};
export default config;