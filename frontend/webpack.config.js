const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'phpug.js',
		path: path.resolve(__dirname + '/../public/', 'lib'),
	},
	plugins: [
		new MiniCssExtractPlugin()
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.png$/,
				loader:	'file-loader',
				options:{
					outputPath: '../img',
					name: "[name].[ext]",
					publicPath: 'img'

				}
			},
			{
				test: /\.(scss)$/,
				use: [ {
					loader: MiniCssExtractPlugin.loader,
				}, {
					loader: 'css-loader', // inject CSS to page
				},{
					loader: 'postcss-loader', // Run post css actions
				}, {
					loader: 'sass-loader' // compiles Sass to CSS
				}]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				type: "asset"
			}
		]
	}
};
