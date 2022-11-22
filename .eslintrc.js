module.exports = {
	ignorePatterns: [
		'smart-meter-mbus-dlms.js'
	],
	env: {
		browser: false,
		es2021: true
	},
	extends: 'standard-with-typescript',
	overrides: [
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	rules: {
		'no-tabs': 0,
		'no-mixed-spaces-and-tabs': 1,
		indent: ['error', 'tab']
	}
}
