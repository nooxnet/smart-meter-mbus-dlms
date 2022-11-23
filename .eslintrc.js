module.exports = {
	ignorePatterns: [
		// 'smart-meter-mbus-dlms.js',
		// '.eslintrc.js',
		// 'webpack.config.js',
		// 'babel.config.js'
		'*.js',
		'src/lib/cosem/cosem-asn2ts'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	// overrides: [
	// 	{
	//files: ['*.ts', '*.tsx'], // Your TypeScript files extension


	// As mentioned in the comments, you should extend TypeScript plugins here,
	// instead of extending them outside the `overrides`.
	// If you don't want to extend any rules, you don't need an `extends` attribute.
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking'//,
		//'plugin:import/typescript'
	],
	parserOptions: {
		project: ['./tsconfig.json'] // Specify it only for TypeScript files
	},
	rules: {
		'no-tabs': 0,
		'no-mixed-spaces-and-tabs': 1,
		indent: 'off',
		'@typescript-eslint/indent': ['warn', 'tab'],
		semi: 'off',
		'@typescript-eslint/semi': 'warn',
		'@typescript-eslint/strict-boolean-expressions': ['warn', {
			allowNullableObject: true,
			allowNullableString: true,
			allowNullableNumber: true,
			allowString: true,
			allowNumber: true
		}],
		// I don't want to write 'if ( )' but "import { xy } from 'abc';" is standard. Stupid eslint - or stupid eslint doc.
		'keyword-spacing': 'off',
		'@typescript-eslint/keyword-spacing': ['off', { 'after': false }],
		'@typescript-eslint/member-delimiter-style': [
			'warn',
			{
				multiline: {
					delimiter: 'semi',
					requireLast: true
				},
				singleline: {
					delimiter: 'semi',
					requireLast: true
				}
			}
		],
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/restrict-template-expressions': 'off',
		'no-constant-condition': 'off',
		'@typescript-eslint/no-explicit-any': ['off'],
		'@typescript-eslint/no-unsafe-member-access': 'off',
	},
	// 	}
	// ],
	env: {
		browser: false,
		es2021: true,
		node: true
	},
	// extends: 'standard-with-typescript',
	// parserOptions: {
	// 	ecmaVersion: 'latest',
	// 	sourceType: 'module'
	// },
	// rules: {
	// 	'no-tabs': 0,
	// 	'no-mixed-spaces-and-tabs': 1,
	// 	indent: ['error', 'tab']
	// }
}
