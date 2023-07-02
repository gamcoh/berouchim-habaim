const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		colors: {
			primary: '#446A68',
			green: '#6EA743',
			orange: '#F9C74F',
			red: '#F94144'
		},
		extend: {
			fontSize: {
				xxs: '.55rem'
			},
			boxShadow: {
				outline: '0 0 0 3px'
			}
		}
	},

	plugins: [require('flowbite/plugin')],
	darkMode: 'class'
};

module.exports = config;
