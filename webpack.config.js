const nodeExternals = require('webpack-node-externals');
const webpack = require("webpack");
const forkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const forkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
	entry: './src/smart-meter-mbus-dlms.ts',
	output: {
		path: __dirname,
		filename: 'smart-meter-mbus-dlms.js', // <-- Important
		//libraryTarget: 'this' // <-- Important
		library: {
			type: 'this'
		}
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
				},
				exclude: /node_modules/,
			}
		]
	},
	resolve: {
		extensions: [ '.ts', '.tsx', '.js' ]
	},
	optimization: {
		minimize: true,
	},
	externals: [nodeExternals()], // <-- Important
	plugins: [
		new webpack.DefinePlugin({ CONFIG: JSON.stringify(require("config")) }),
		new forkTsCheckerWebpackPlugin(),
		new forkTsCheckerNotifierWebpackPlugin({
			title: 'TypeScript',
			excludeWarnings: false,
		}),
	]
};
