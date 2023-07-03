const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		colors: {
			primary: '#446A68'
		},
		extend: {
			colors: {
				green: {
					500: '#6EA743',
					'500/50': 'rgba(110, 167, 67, 0.5)'
				},
				orange: {
					500: '#F9C74F',
					'500/50': 'rgba(249, 199, 79, 0.5)'
				},
				red: {
					500: '#F94144',
					'500/50': 'rgba(249, 65, 68, 0.5)'
				}
			},
			fontSize: {
				xxs: '.55rem'
			},
			boxShadow: {
				outline: '0 0 0 3px'
			}
		}
	},

	plugins: [require('flowbite/plugin')],
	darkMode: ['class', "[data-theme='dark']"]
};

module.exports = config;
