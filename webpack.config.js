const nodeExternals = require('webpack-node-externals');

module.exports = {
	entry: './src/smartmeter-mbus-dlms.ts',
	output: {
		path: __dirname,
		filename: 'index.js', // <-- Important
		libraryTarget: 'this' // <-- Important
	},
	target: 'node', // <-- Important
	mode: 'development',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true
				}
			}
		]
	},
	resolve: {
		extensions: [ '.ts', '.tsx', '.js' ]
	},
	optimization: {
		minimize: false
	},
	externals: [nodeExternals()] // <-- Important
};
