// tailwind.config.ts
import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config = {
	darkMode: 'class',
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				purple: {
					100: '#F3ECFF',
					400: '#9056F5',
				},
				gray: {
					100: '#F3F3F3',
					400: '#87838F',
					600: '#0E0420',
				},
				quiz: {
					badge: '#FFF4E3',
				},
			},
			fontFamily: {
				baloo: ['var(--font-baloo)', 'sans-serif'],
			},
			boxShadow: {
				'elevation': '0 0 20px rgba(14, 4, 32, 0.1)',
				'custom': '0 0px 10px rgba(14, 4, 32, 0.1)',
				// Matches Figma token: 0px 5px 20px 0px rgba(14, 4, 32, 0.04)
				'cardPC': '0px 5px 20px 0px rgba(14, 4, 32, 0.04)',
			},
		},
	},
	plugins: [
		tailwindcssAnimate,
	],

} satisfies Config

export default config
