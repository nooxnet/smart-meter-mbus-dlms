const nodeExternals = require('webpack-node-externals');
const webpack = require("webpack");

module.exports = {
	entry: './src/smartmeter-mbus-dlms.ts',
	output: {
		path: __dirname,
		filename: 'index.js', // <-- Important
		libraryTarget: 'this' // <-- Important
	},
	target: 'node', // <-- Important
	mode: 'production', // development, production
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
		minimize: true
	},
	externals: [nodeExternals()], // <-- Important
	plugins: [
		new webpack.DefinePlugin({ CONFIG: JSON.stringify(require("config")) })
	]
};
